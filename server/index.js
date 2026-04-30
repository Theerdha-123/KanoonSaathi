import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import multer from 'multer';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  createUser, loginUser, verifyToken, getUserById, updateUserProfile, resetUserPassword,
  logQuery, logPageView, logLawSearch, logDraftUsage,
  getOverviewStats, getTopQueries, getTopLawSearches,
  getUsageByLanguage, getUsageByState, getUsageByFeature,
  getDraftUsageStats, getPageViewStats, getQueryTimeline,
  getRecentQueries, getAllUsers, getDbStatus, disconnectDb,
} from './dbProvider.js';
import { IPC_BNS_MAPPING } from '../src/data/lawMapping.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === 'production';

// Trust proxy for Render/Cloudflare (required for rate limiting)
if (IS_PROD) {
  app.set('trust proxy', 1);
}

// ─── Security Middleware ────────────────────────────────────────────────────────

// Security headers (CSP, XSS protection, etc.)
app.use(helmet({
  contentSecurityPolicy: false,       // Disabled — we serve a SPA with inline styles
  crossOriginEmbedderPolicy: false,   // Allow image loading
}));

// CORS — flexible by default, can be locked down via CORS_ORIGIN
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : true; // Allow all origins if not specified (simplifies initial deployment)

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Body size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Rate Limiting ──────────────────────────────────────────────────────────────

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 200,                   // 200 requests per window
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health', // Always allow health checks
});

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,                    // 50 AI requests per 15 minutes
  message: { error: 'Too many AI requests. Please wait a few minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,                    // 20 auth attempts per 15 minutes
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/chat', chatLimiter);
app.use('/api/analyze-document', chatLimiter);
app.use('/api/extract-text', chatLimiter);
app.use('/api/auth/', authLimiter);

// ─── Auth Middleware ────────────────────────────────────────────────────────────

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid or expired token' });
  req.userId = decoded.id;
  req.userRole = decoded.role;
  next();
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.userRole !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
  });
}

// Optional auth — sets userId if token present, but doesn't block
function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) { req.userId = decoded.id; req.userRole = decoded.role; }
  }
  next();
}

// ─── AI Provider Configuration ─────────────────────────────────────────────────

const AI_PROVIDER = process.env.AI_PROVIDER || 'mock';

const PROVIDER_CONFIG = {
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    keyEnv: 'ANTHROPIC_API_KEY',
    buildHeaders: (key) => ({
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    }),
    buildBody: (system, messages, model) => ({
      model: model || 'claude-sonnet-4-5-20250514',
      max_tokens: 2048,
      system,
      messages,
    }),
    extractReply: (data) => {
      if (data.error) throw new Error(`${data.error.type}: ${data.error.message}`);
      return data.content?.[0]?.text || '';
    },
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    keyEnv: 'OPENAI_API_KEY',
    buildHeaders: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
    buildBody: (system, messages, model) => ({
      model: model || 'gpt-4o-mini',
      max_tokens: 2048,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
    extractReply: (data) => {
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || '';
    },
  },
  gemini: {
    url: (model, key) => `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-2.5-flash-lite'}:generateContent?key=${key}`,
    keyEnv: 'GEMINI_API_KEY',
    buildHeaders: () => ({ 'Content-Type': 'application/json' }),
    buildBody: (system, messages) => ({
      system_instruction: { parts: [{ text: system }] },
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    }),
    extractReply: (data) => {
      if (data.error) throw new Error(data.error.message);
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    },
  },
  nvidia: {
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    keyEnv: 'NVIDIA_API_KEY',
    buildHeaders: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
    buildBody: (system, messages, model) => ({
      model: model || 'meta/llama-3.1-70b-instruct',
      max_tokens: 2048,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
    extractReply: (data) => {
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || '';
    },
  },
};

// ─── Mock AI ────────────────────────────────────────────────────────────────────

function mockAIResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes('fir') || lower.includes('police')) {
    return JSON.stringify({
      confidenceScore: 90,
      legalPosition: "Police CANNOT legally refuse to register your FIR for any cognizable offence.",
      relevantLaw: {
        ipc: "Section 166 IPC",
        bns: "Section 204 BNS",
        framework: "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) Section 173"
      },
      practicalSteps: [
        "Go to the nearest police station and demand FIR registration",
        "If refused: send a written complaint by Speed Post to the SP/SSP",
        "Approach the Judicial Magistrate under BNSS Section 175(3)"
      ],
      remedies: [
        "File complaint with State Human Rights Commission",
        "Call DLSA for free legal aid: 15100"
      ],
      caveat: "Applicable only for cognizable offences."
    });
  }

  return JSON.stringify({
    confidenceScore: 10,
    legalPosition: "KanoonSaathi is in demo mode. Set up an AI API key for real advice.",
    relevantLaw: { ipc: null, bns: null, framework: "None" },
    practicalSteps: [
      "Add your API key to .env",
      "Set AI_PROVIDER=gemini (or anthropic/openai)",
      "Restart the server"
    ],
    remedies: ["Emergency: 112", "Police: 100"],
    caveat: "This is a mock response."
  });
}

// ─── Auth API Endpoints ─────────────────────────────────────────────────────────

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password, state, language } = req.body;
    console.log(`📝 Signup attempt: ${email}`);
    
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    
    await createUser({ name: name.trim(), email, phone, password, state, language });
    console.log(`✅ User created: ${email}. Attempting auto-login...`);
    
    const loginResult = await loginUser(email, password);
    if (!loginResult) {
      console.error(`❌ Auto-login failed for ${email}`);
      return res.status(500).json({ error: 'Account created but auto-login failed. Please login manually.' });
    }
    
    console.log(`✨ Signup successful: ${email}`);
    res.json(loginResult);
  } catch (e) {
    console.error(`❌ Signup error for ${req.body.email}:`, e.message);
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔑 Login attempt: ${email}`);
    
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    
    const result = await loginUser(email, password);
    if (!result) {
      console.warn(`⚠️ Invalid login: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log(`✅ Login successful: ${email} (${result.user.role})`);
    res.json(result);
  } catch (e) {
    console.error(`❌ Login error for ${req.body.email}:`, e.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.userId);
    if (!user) {
      console.warn(`⚠️ Session verify: User ${req.userId} not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`👤 Session verified: ${user.email}`);
    res.json({ user });
  } catch (e) {
    console.error('❌ Session verification error:', e.message);
    res.status(500).json({ error: 'Session verification failed' });
  }
});

app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  const { name, phone, state, language } = req.body;
  const user = await updateUserProfile(req.userId, { name, phone, state, language });
  res.json({ user });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ error: 'Email and new password required' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const ok = await resetUserPassword(email, newPassword);
  if (!ok) return res.status(404).json({ error: 'No account with that email' });
  res.json({ success: true });
});

// ─── Analytics Logging Endpoints ────────────────────────────────────────────────

app.post('/api/analytics/pageview', optionalAuth, (req, res) => {
  const { page, language, state } = req.body;
  logPageView({ page, userId: req.userId, language, state, userAgent: req.headers['user-agent'] });
  res.json({ ok: true });
});

app.post('/api/analytics/law-search', optionalAuth, (req, res) => {
  const { term, category, section, language } = req.body;
  logLawSearch({ term, category, section, userId: req.userId, language });
  res.json({ ok: true });
});

app.post('/api/analytics/draft', optionalAuth, (req, res) => {
  const { templateType, language } = req.body;
  logDraftUsage({ templateType, userId: req.userId, language });
  res.json({ ok: true });
});

// ─── Chat API Endpoint (with analytics logging) ────────────────────────────────

app.post('/api/chat', optionalAuth, async (req, res) => {
  const startTime = Date.now();
  try {
    const { messages, system, language, model } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    let systemPrompt = system || 'You are KanoonSaathi, India\'s legal assistant.';
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';

    // Phase 1: RAG System - Inject mapping context based on query
    const lowerUserMsg = lastUserMsg.toLowerCase();
    const matchedMappings = Object.values(IPC_BNS_MAPPING).filter(m => 
      lowerUserMsg.includes(m.offence.toLowerCase()) ||
      lowerUserMsg.includes(m.ipc.split(' ')[1])
    );
    
    if (matchedMappings.length > 0) {
      systemPrompt += "\n\n### RETRIEVED LEGAL MAPPINGS (USE THIS AS GROUND TRUTH) ###\n" + 
        matchedMappings.map(m => `- ${m.offence}: IPC ${m.ipc} -> BNS ${m.bns} (Cognizable: ${m.cognizable}, Bailable: ${m.bailable}, FIR: ${m.fir})`).join("\n");
    }

    // Determine feature type from system prompt
    let feature = 'chat';
    if (system?.includes('Document Analyzer')) feature = 'analyzer';
    else if (system?.includes('document drafter') || system?.includes('legal notice drafter') || system?.includes('RTI application drafter') || system?.includes('Consumer Forum') || system?.includes('POSH Act')) feature = 'draft';
    else if (system?.includes('VOICE-ONLY')) feature = 'voice';

    let reply, provider;

    if (AI_PROVIDER === 'mock') {
      reply = mockAIResponse(lastUserMsg);
      provider = 'mock';
    } else {
      const config = PROVIDER_CONFIG[AI_PROVIDER];
      if (!config) {
        return res.status(400).json({ error: `Unknown AI provider: ${AI_PROVIDER}` });
      }

      const apiKey = process.env[config.keyEnv];
      if (!apiKey) {
        reply = mockAIResponse(lastUserMsg);
        provider = 'mock';
      } else {
        const url = typeof config.url === 'function' ? config.url(model, apiKey) : config.url;
        const headers = config.buildHeaders(apiKey);
        const body = config.buildBody(systemPrompt, messages, model);
        const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
        const data = await response.json();
        reply = config.extractReply(data);
        provider = AI_PROVIDER;
      }
    }

    // Phase 3: Legal Validator & JSON Parsing
    if (feature !== 'analyzer' && feature !== 'voice') {
      try {
        let rawJson = reply;
        const jsonMatch = reply.match(/```json\n([\s\S]*?)\n```/) || reply.match(/```([\s\S]*?)```/);
        if (jsonMatch) rawJson = jsonMatch[1];
        
        let parsedReply = JSON.parse(rawJson);
        
        // Hallucination Detector
        const strReply = JSON.stringify(parsedReply).toLowerCase();
        let changed = false;
        
        if (strReply.includes("aadhaar required") || strReply.includes("pan required") || strReply.includes("always illegal")) {
          parsedReply.confidenceScore = Math.max(0, parsedReply.confidenceScore - 30);
          if (Array.isArray(parsedReply.practicalSteps)) {
            parsedReply.practicalSteps = parsedReply.practicalSteps.filter(s => !s.toLowerCase().includes("aadhaar") && !s.toLowerCase().includes("pan"));
          }
          changed = true;
        }

        if (parsedReply.relevantLaw && parsedReply.relevantLaw.ipc) {
          const mapped = Object.values(IPC_BNS_MAPPING).find(m => parsedReply.relevantLaw.ipc.includes(m.ipc.split(' ')[1]));
          if (mapped && parsedReply.relevantLaw.bns && !parsedReply.relevantLaw.bns.includes(mapped.bns.split(' ')[1])) {
             parsedReply.relevantLaw.bns = mapped.bns; 
             changed = true;
          }
        }
        
        if (changed) {
          reply = JSON.stringify(parsedReply);
        } else {
          reply = rawJson; // Use cleaned JSON string
        }
      } catch (e) {
        console.error("JSON Parse/Validate Error (falling back to raw):", e.message);
      }
    }

    // Log the query for analytics
    const responseTime = Date.now() - startTime;
    try {
      logQuery({
        userId: req.userId, query: lastUserMsg, response: reply,
        language: language || 'en', provider, feature,
        state: req.body.state, responseTime,
      });
    } catch (e) { console.error('Analytics log error:', e.message); }

    res.json({ reply, provider });
  } catch (err) {
    console.error('AI API error:', err.message);
    const responseTime = Date.now() - startTime;
    res.status(500).json({
      error: err.message || 'AI service error',
      reply: mockAIResponse('fallback'),
      provider: 'mock',
    });
  }
});

// ─── File Upload & PDF Extraction ───────────────────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

app.post('/api/extract-text', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { mimetype, originalname, buffer } = req.file;

    // Plain text files
    if (mimetype === 'text/plain' || originalname.endsWith('.txt')) {
      const text = buffer.toString('utf-8');
      return res.json({ text, pages: 1, source: 'text' });
    }

    // PDF files
    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      try {
        const uint8 = new Uint8Array(buffer);
        const loadingTask = getDocument({ data: uint8, verbosity: 0 });
        const doc = await loadingTask.promise;
        const numPages = doc.numPages;
        let fullText = '';

        for (let i = 1; i <= numPages; i++) {
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }

        const text = fullText.trim();
        if (!text) {
          return res.json({
            text: '',
            pages: numPages,
            source: 'pdf',
            warning: 'This PDF appears to be a scanned image. The text could not be extracted. Please manually type or paste the key content from the document.',
          });
        }
        return res.json({
          text,
          pages: numPages,
          source: 'pdf',
        });
      } catch (pdfErr) {
        console.error('PDF parse error:', pdfErr.message);
        return res.status(422).json({
          error: 'Could not read this PDF. It may be encrypted, corrupted, or a scanned image.',
          suggestion: 'Try opening the PDF, selecting all text (Ctrl+A), copying it (Ctrl+C), and pasting it into the text box.',
        });
      }
    }

    // Image files — use Gemini Vision API for OCR
    if (mimetype.startsWith('image/')) {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return res.json({
          text: '',
          source: 'image',
          warning: 'Image OCR requires a Gemini API key. Please type or paste the document text manually.',
        });
      }

      try {
        const base64Image = buffer.toString('base64');
        const model = 'gemini-2.5-flash-lite';
        const visionUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

        const visionRes = await fetch(visionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: 'Extract ALL text from this document image. Reproduce the text exactly as it appears — include every heading, date, name, number, section reference, address, stamp text, and signature line. Preserve the original structure and formatting. Output ONLY the extracted text, nothing else.' },
                { inline_data: { mime_type: mimetype, data: base64Image } },
              ],
            }],
          }),
        });

        const visionData = await visionRes.json();

        if (visionData.error) {
          console.error('Gemini Vision error:', visionData.error.message);
          return res.json({
            text: '',
            source: 'image',
            warning: `Could not read this image: ${visionData.error.message}. Please type or paste the document text manually.`,
          });
        }

        const extractedText = visionData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

        if (!extractedText) {
          return res.json({
            text: '',
            source: 'image',
            warning: 'Could not extract readable text from this image. The image may be blurry or too dark. Please retake the photo or type the text manually.',
          });
        }

        return res.json({
          text: extractedText,
          pages: 1,
          source: 'image-ocr',
        });
      } catch (ocrErr) {
        console.error('Image OCR error:', ocrErr.message);
        return res.json({
          text: '',
          source: 'image',
          warning: 'Could not process this image. Please try a clearer photo or type the text manually.',
        });
      }
    }

    // Unsupported file type
    return res.status(400).json({ error: `Unsupported file type: ${mimetype}. Please upload a PDF, TXT, or image file.` });

  } catch (err) {
    console.error('Extract text error:', err.message);
    res.status(500).json({ error: 'Failed to process file. Please try again.' });
  }
});

// ─── Direct Image Document Analysis (Gemini Vision) ─────────────────────────────

app.post('/api/analyze-document', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) return res.status(500).json({ error: 'Gemini API key not configured' });

    const { mimetype, buffer } = req.file;
    const docType = req.body.docType || 'Legal Document';
    const lang = req.body.language || 'en';

    if (!mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'This endpoint only handles image files. Use /api/extract-text for PDFs.' });
    }

    const base64Image = buffer.toString('base64');
    const model = 'gemini-2.5-flash-lite';
    const visionUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

    const analysisPrompt = `You are KanoonSaathi, India's AI legal assistant. The user has uploaded a photo of a ${docType}. 

First, read and extract ALL text from this document image. Then analyze it using this format:

📄 **Document Type & Summary**
[Identify the document type and provide a 2-3 line summary]

⚖️ **Key Legal Provisions Referenced**
[List all laws, sections, acts mentioned or applicable]

📖 **What This Means for You (Plain Language)**
[Explain in simple terms what this document says and means for the user]

⚠️ **Red Flags / Important Warnings**
[Flag anything concerning — unfair clauses, deadlines, missing protections]

✅ **What You Should Do Next**
[Numbered action steps]

💡 **Your Rights in This Situation**
[What rights the person has]

📞 **Where to Get Help**
[Relevant helplines: Emergency 112, Police 100, Women 181, DLSA 15100, Cyber 1930]

Be empathetic. Many users are scared — reassure them about their rights.`;

    const visionRes = await fetch(visionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: analysisPrompt }] },
        contents: [{
          parts: [
            { text: `Please analyze this ${docType} document that I photographed. Tell me what it says and what I should do.` },
            { inline_data: { mime_type: mimetype, data: base64Image } },
          ],
        }],
      }),
    });

    const visionData = await visionRes.json();

    if (visionData.error) {
      console.error('Gemini Vision analysis error:', visionData.error.message);
      return res.status(500).json({ error: `AI analysis failed: ${visionData.error.message}` });
    }

    const reply = visionData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!reply) {
      return res.status(500).json({ error: 'Could not analyze this image. Please try a clearer photo.' });
    }

    // Log the query
    try { logQuery('user', `[Image Analysis] ${docType}`, reply.slice(0, 200), 'document', lang, '', 0); } catch(e) {}

    res.json({ reply, provider: 'gemini-vision' });

  } catch (err) {
    console.error('Document analysis error:', err.message);
    res.status(500).json({ error: 'Failed to analyze document. Please try again.' });
  }
});

// ─── Admin Dashboard API ────────────────────────────────────────────────────────

app.get('/api/admin/overview', adminMiddleware, async (req, res) => {
  res.json(await getOverviewStats());
});

app.get('/api/admin/top-queries', adminMiddleware, async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json(await getTopQueries(limit));
});

app.get('/api/admin/top-law-searches', adminMiddleware, async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json(await getTopLawSearches(limit));
});

app.get('/api/admin/usage-by-language', adminMiddleware, async (req, res) => {
  res.json(await getUsageByLanguage());
});

app.get('/api/admin/usage-by-state', adminMiddleware, async (req, res) => {
  res.json(await getUsageByState());
});

app.get('/api/admin/usage-by-feature', adminMiddleware, async (req, res) => {
  res.json(await getUsageByFeature());
});

app.get('/api/admin/draft-usage', adminMiddleware, async (req, res) => {
  res.json(await getDraftUsageStats());
});

app.get('/api/admin/page-views', adminMiddleware, async (req, res) => {
  res.json(await getPageViewStats());
});

app.get('/api/admin/query-timeline', adminMiddleware, async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  res.json(await getQueryTimeline(days));
});

app.get('/api/admin/recent-queries', adminMiddleware, async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(await getRecentQueries(limit));
});

app.get('/api/admin/users', adminMiddleware, async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;
  res.json(await getAllUsers(limit, offset));
});

app.get('/api/provider', (req, res) => {
  const config = PROVIDER_CONFIG[AI_PROVIDER];
  const apiKey = config ? process.env[config.keyEnv] : null;
  res.json({ provider: AI_PROVIDER, configured: !!apiKey, supported: ['anthropic', 'openai', 'gemini', 'nvidia', 'mock'] });
});

// ─── Health Check ───────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  const dbStatus = typeof getDbStatus === 'function' ? getDbStatus() : { connected: true };
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    aiProvider: AI_PROVIDER,
    environment: IS_PROD ? 'production' : 'development',
    version: '1.0.0',
  });
});

// ─── Serve React Frontend (Production) ─────────────────────────────────────────

const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));

  // Catch-all: send React app for any non-API route (SPA routing)
  // Express 5 requires named parameter syntax for catch-all
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    if (req.method !== 'GET') return next();
    res.sendFile(join(distPath, 'index.html'));
  });
  console.log('   🌐 Serving frontend from dist/');
}

// ─── Start Server ───────────────────────────────────────────────────────────────

const DB_PROVIDER = process.env.DB_PROVIDER || 'sqlite';

const server = app.listen(PORT, () => {
  console.log(`\n⚖️  KanoonSaathi API Server`);
  console.log(`   Port:        ${PORT}`);
  console.log(`   Environment: ${IS_PROD ? '🔒 Production' : '🔧 Development'}`);
  console.log(`   AI Provider: ${AI_PROVIDER}`);
  console.log(`   Database:    ${DB_PROVIDER === 'mongodb' ? 'MongoDB Atlas' : 'SQLite (data/kanoonsaathi.db)'}`);
  console.log(`   Security:    ✅ Helmet + Rate limiting + CORS${IS_PROD ? ' (locked)' : ''}`);
  if (AI_PROVIDER === 'mock') {
    console.log(`   ⚠️  Running in MOCK mode — set AI_PROVIDER and API key in .env for real AI`);
  } else {
    const config = PROVIDER_CONFIG[AI_PROVIDER];
    const hasKey = !!process.env[config?.keyEnv];
    console.log(`   API Key:     ${hasKey ? '✅ Configured' : '❌ Missing — will fall back to mock'}`);
  }
  console.log(`   Health:      http://localhost:${PORT}/api/health`);
  console.log(`   Ready at:    http://localhost:${PORT}\n`);
});

// ─── Graceful Shutdown ──────────────────────────────────────────────────────────

function gracefulShutdown(signal) {
  console.log(`\n🛑 ${signal} received — shutting down gracefully...`);
  server.close(() => {
    console.log('   ✅ HTTP server closed');
    try {
      if (typeof disconnectDb === 'function') disconnectDb();
      console.log('   ✅ Database connection closed');
    } catch {}
    console.log('   👋 KanoonSaathi stopped.\n');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('   ⚠️  Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
