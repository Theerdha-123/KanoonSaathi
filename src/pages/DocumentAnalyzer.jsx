import { useState, useRef } from 'react';
import NavBar from '../components/NavBar';

const DOC_TYPES = [
  { id: 'fir', icon: '🚔', label: 'FIR Copy', desc: 'Police First Information Report' },
  { id: 'notice', icon: '📜', label: 'Legal Notice', desc: 'Notices from lawyers, courts, or companies' },
  { id: 'contract', icon: '📋', label: 'Contract / Agreement', desc: 'Rental, employment, or service contracts' },
  { id: 'court', icon: '⚖️', label: 'Court Order / Summons', desc: 'Orders from any court or tribunal' },
  { id: 'tax', icon: '💰', label: 'Tax Notice', desc: 'Income Tax, GST, or property tax notices' },
  { id: 'property', icon: '🏠', label: 'Property Document', desc: 'Sale deed, title deed, rent agreement' },
  { id: 'other', icon: '📄', label: 'Other Document', desc: 'Any other legal document' },
];

const ANALYZE_PROMPT = `You are KanoonSaathi's Document Analyzer. The user has uploaded a legal document. Analyze it using this format:

📄 **Document Type & Summary**
[Identify what kind of document this is and provide a 2-3 line summary]

⚖️ **Key Legal Provisions Referenced**
[List all laws, sections, acts mentioned in the document]

📖 **What This Means for You (Plain Language)**
[Explain in simple terms what this document is saying and what it means for the user]

⚠️ **Red Flags / Important Warnings**
[Flag anything concerning — unfair clauses, excessive penalties, missing protections, deadlines]

✅ **What You Should Do Next**
[Numbered action steps the person should take]

💡 **Your Rights in This Situation**
[What rights the person has regarding this document]

📞 **Where to Get Help**
[Relevant helplines and free legal aid options]

Be empathetic and empowering. Many users receiving these documents are scared — reassure them about their rights.`;

export default function DocumentAnalyzer({ loggedIn, user, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogin, onSignup, onLogout, onHome, onProfile, onAdmin }) {
  const [docType, setDocType] = useState(null);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [pdfInfo, setPdfInfo] = useState(null);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const extractTextFromFile = async (f) => {
    setExtracting(true);
    setError('');
    setPdfInfo(null);

    try {
      const formData = new FormData();
      formData.append('file', f);

      const res = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to extract text from file.');
        if (data.suggestion) setError(prev => `${prev}\n\n💡 ${data.suggestion}`);
        setExtracting(false);
        return;
      }

      if (data.text) {
        setText(data.text);
        setPdfInfo({ pages: data.pages, source: data.source });
      }

      if (data.warning) {
        setError(data.warning);
        setPdfInfo({ pages: data.pages, source: data.source, warning: true });
      }
    } catch (err) {
      setError('Could not connect to the server for text extraction. You can still paste document text manually.');
    }

    setExtracting(false);
  };

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError('');
    setPdfInfo(null);
    setResult('');
    setImagePreview(null);

    if (f.type === 'text/plain') {
      const content = await f.text();
      setText(content);
      setPdfInfo({ pages: 1, source: 'text' });
    } else if (f.type === 'application/pdf') {
      await extractTextFromFile(f);
    } else if (f.type.startsWith('image/')) {
      // Show image preview
      const url = URL.createObjectURL(f);
      setImagePreview(url);
      // Extract text via Gemini Vision OCR
      await extractTextFromFile(f);
    }
  };

  const analyzeDirectly = async () => {
    // Direct image analysis — sends the image to Gemini Vision for one-step analysis
    if (!file || !file.type.startsWith('image/')) return;

    setAnalyzing(true);
    setResult('');
    setError('');

    const docLabel = DOC_TYPES.find(d => d.id === docType)?.label || 'Legal Document';

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('docType', docLabel);
      formData.append('language', lang);

      const res = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to analyze document.');
      } else {
        setResult(data.reply || '⚠️ Could not analyze. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to the server. Please ensure the backend is running.');
    }

    setAnalyzing(false);
  };

  const analyze = async () => {
    const content = text.trim();

    // If it's an image and no text was extracted, try direct vision analysis
    if (!content && file?.type?.startsWith('image/')) {
      return analyzeDirectly();
    }

    if (!content && !file) {
      setError('Please paste the document text or upload a file.');
      return;
    }
    if (!content) {
      setError('No text available to analyze. Please paste the text content of your document, or upload a PDF with selectable text.');
      return;
    }

    setAnalyzing(true);
    setResult('');
    setError('');

    const docLabel = DOC_TYPES.find(d => d.id === docType)?.label || 'Legal Document';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `I have received a ${docLabel}. Please analyze this document and explain it to me in simple language:\n\n---\n${content}\n---` }],
          system: ANALYZE_PROMPT,
        }),
      });
      const data = await res.json();
      setResult(data.reply || '⚠️ Could not analyze. Please try again.');
    } catch (err) {
      setError('Could not connect to the server. Please ensure the backend is running.');
    }
    setAnalyzing(false);
  };

  const fmt = (text) => text.split('\n').map((line, i) => {
    const isH = ['📄', '⚖️', '📖', '⚠️', '✅', '💡', '📞'].some(e => line.startsWith(e));
    if (isH) return <div key={i} style={{ marginTop: 16, marginBottom: 5, fontWeight: 700, fontSize: 13, color: '#FF9500', borderBottom: '1px solid rgba(255,149,0,0.15)', paddingBottom: 3 }}>{line}</div>;
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div key={i} dangerouslySetInnerHTML={{ __html: bold || '&nbsp;' }} style={{ marginBottom: 2, fontSize: 14, lineHeight: 1.65 }} />;
  });

  const resetAll = () => {
    setDocType(null); setText(''); setFile(null); setResult(''); setError('');
    setPdfInfo(null); setImagePreview(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  };

  const isImage = file?.type?.startsWith('image/');
  const commonProps = { loggedIn, user, onLogin, onSignup, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogout, onProfile, onHome, onAdmin, back: onHome, backLabel: '← Home' };

  return (
    <div style={{ minHeight: '100vh', background: '#07070F', color: '#F0EDE8', fontFamily: 'Georgia,serif' }}>
      <NavBar {...commonProps} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, animation: 'fadeUp 0.3s ease' }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>📄</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Document Analyzer</div>
          <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)', lineHeight: 1.7 }}>
            Upload or paste any legal document — FIR, notice, contract, court order — and get a plain-language explanation with your rights and next steps.
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '6px 14px', borderRadius: 20, background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.2)', fontSize: 11, color: '#4CAF50' }}>
            📷 Now supports photos! Take a picture of any document with your camera
          </div>
        </div>

        {/* Step 1: Document Type */}
        {!docType ? (
          <div style={{ animation: 'fadeUp 0.3s ease' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FF9500', marginBottom: 14 }}>Step 1: What type of document is this?</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {DOC_TYPES.map((dt) => (
                <button key={dt.id} onClick={() => setDocType(dt.id)}
                  style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.2s', color: '#F0EDE8' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{dt.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{dt.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(240,237,232,0.4)', marginTop: 2 }}>{dt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ animation: 'fadeUp 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <button onClick={resetAll} className="btn btn-ghost" style={{ fontSize: 11 }}>← Change Type</button>
              <div style={{ padding: '4px 12px', borderRadius: 16, background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.25)', fontSize: 12, color: '#FF9500' }}>
                {DOC_TYPES.find(d => d.id === docType)?.icon} {DOC_TYPES.find(d => d.id === docType)?.label}
              </div>
            </div>

            {/* Step 2: Upload or Paste */}
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FF9500', marginBottom: 12 }}>Step 2: Upload document (PDF, photo, or text)</div>

            {/* Upload buttons row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {/* File upload button */}
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  flex: 1, padding: '16px 14px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                  border: '2px dashed rgba(255,107,0,0.2)', background: 'rgba(255,107,0,0.02)',
                  fontFamily: 'inherit', color: '#F0EDE8', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.background = 'rgba(255,107,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.2)'; e.currentTarget.style.background = 'rgba(255,107,0,0.02)'; }}
              >
                <input type="file" ref={fileRef} accept=".txt,.pdf,image/*" onChange={handleFile} style={{ display: 'none' }} />
                <div style={{ fontSize: 24, marginBottom: 4 }}>📎</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>Upload File</div>
                <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)', marginTop: 2 }}>PDF, TXT, Image</div>
              </button>

              {/* Camera button */}
              <button
                onClick={() => cameraRef.current?.click()}
                style={{
                  flex: 1, padding: '16px 14px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                  border: '2px dashed rgba(76,175,80,0.25)', background: 'rgba(76,175,80,0.03)',
                  fontFamily: 'inherit', color: '#F0EDE8', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.background = 'rgba(76,175,80,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(76,175,80,0.25)'; e.currentTarget.style.background = 'rgba(76,175,80,0.03)'; }}
              >
                <input type="file" ref={cameraRef} accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
                <div style={{ fontSize: 24, marginBottom: 4 }}>📷</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#4CAF50' }}>Take Photo</div>
                <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)', marginTop: 2 }}>Use camera</div>
              </button>
            </div>

            {/* Extraction in progress */}
            {extracting && (
              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,107,0,0.05)', border: '1px solid rgba(255,107,0,0.15)', marginBottom: 14, textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 8 }}>
                  {[0, 1, 2].map(j => <div key={j} style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF6B00', animation: `pulse 1.2s ${j * 0.2}s infinite` }} />)}
                </div>
                <div style={{ fontSize: 12, color: '#FF9500' }}>
                  {isImage ? '🔍 Reading document with AI Vision…' : '📄 Extracting text…'}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)', marginTop: 4 }}>
                  {isImage ? 'Gemini Vision is scanning your photo for text' : `Processing ${file?.name}`}
                </div>
              </div>
            )}

            {/* Image preview */}
            {imagePreview && !extracting && (
              <div style={{ marginBottom: 14, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,107,0,0.15)', position: 'relative' }}>
                <img src={imagePreview} alt="Document preview" style={{ width: '100%', maxHeight: 300, objectFit: 'contain', background: '#111' }} />
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                  <div style={{ padding: '3px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.7)', fontSize: 10, color: pdfInfo?.source === 'image-ocr' ? '#4CAF50' : '#FF9500' }}>
                    {pdfInfo?.source === 'image-ocr' ? '✅ OCR Complete' : '📷 Photo uploaded'}
                  </div>
                </div>
                <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.6)' }}>📄 {file?.name} · {(file?.size / 1024).toFixed(1)} KB</span>
                  <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', color: '#FF9500', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Change file</button>
                </div>
              </div>
            )}

            {/* File info (non-image) */}
            {file && !isImage && !extracting && (
              <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{file.type === 'application/pdf' ? '📕' : '📄'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#FF9500' }}>{file.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)' }}>
                    {(file.size / 1024).toFixed(1)} KB
                    {pdfInfo?.pages ? ` · ${pdfInfo.pages} page${pdfInfo.pages > 1 ? 's' : ''}` : ''}
                    {pdfInfo?.source === 'pdf' && !pdfInfo?.warning ? ' · ✅ Text extracted' : ''}
                  </div>
                </div>
                <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', color: 'rgba(240,237,232,0.3)', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Change</button>
              </div>
            )}

            {/* Success banners */}
            {pdfInfo?.source === 'pdf' && text && !pdfInfo?.warning && (
              <div style={{ marginBottom: 14, padding: '9px 12px', background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)', borderRadius: 8, fontSize: 12, color: '#4CAF50', display: 'flex', alignItems: 'center', gap: 8 }}>
                ✅ <span>PDF text extracted successfully ({pdfInfo.pages} page{pdfInfo.pages > 1 ? 's' : ''}, {text.length.toLocaleString()} characters). Ready to analyze!</span>
              </div>
            )}
            {pdfInfo?.source === 'image-ocr' && text && (
              <div style={{ marginBottom: 14, padding: '9px 12px', background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)', borderRadius: 8, fontSize: 12, color: '#4CAF50', display: 'flex', alignItems: 'center', gap: 8 }}>
                ✅ <span>AI Vision extracted {text.length.toLocaleString()} characters from your photo. Ready to analyze!</span>
              </div>
            )}

            {error && (
              <div style={{ marginBottom: 14, padding: '9px 12px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.25)', borderRadius: 8, fontSize: 12, color: '#E74C3C', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Text area — pre-filled from PDF/OCR, or for manual paste */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <textarea
                className="input"
                style={{ minHeight: 140, resize: 'vertical', fontSize: 13, lineHeight: 1.65, paddingRight: 60 }}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={`Paste the text of your ${DOC_TYPES.find(d => d.id === docType)?.label || 'document'} here…\n\nOr upload a PDF / take a photo above — the text will be extracted automatically.`}
              />
              {text && (
                <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, color: 'rgba(240,237,232,0.3)', background: '#0E0E18', padding: '2px 6px', borderRadius: 6 }}>
                  {text.length.toLocaleString()} chars
                </div>
              )}
            </div>

            {/* Analyze button */}
            <button onClick={analyze} disabled={analyzing || extracting} className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 20, opacity: (analyzing || extracting) ? 0.7 : 1 }}>
              {analyzing
                ? (isImage && !text ? '🔍 AI is reading & analyzing your photo…' : '🔍 Analyzing your document…')
                : (isImage && !text ? '📷 Analyze Photo with AI Vision' : '🔍 Analyze Document')}
            </button>

            {/* Analyzing spinner */}
            {analyzing && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 12 }}>
                  {[0, 1, 2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B00', animation: `pulse 1.2s ${j * 0.2}s infinite` }} />)}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)' }}>
                  {isImage && !text ? '📷 AI Vision is reading your document photo and identifying applicable laws…' : 'Reading your document and identifying applicable laws…'}
                </div>
              </div>
            )}

            {/* Result */}
            {result && (
              <div style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,107,0,0.15)', borderRadius: 14, animation: 'fadeUp 0.3s ease' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#FF9500', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>⚖️ DOCUMENT ANALYSIS</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => navigator.clipboard?.writeText(result)} className="btn btn-ghost" style={{ fontSize: 10, padding: '4px 8px' }}>📋 Copy</button>
                    <button onClick={() => { const w = window.open('', '_blank'); if (w) { w.document.write(`<html><head><title>Document Analysis</title><style>body{font-family:Georgia,serif;padding:40px;max-width:700px;margin:0 auto;line-height:1.7;color:#1a1a1a}h1{color:#FF6B00}</style></head><body><h1>⚖️ Document Analysis</h1><pre style="white-space:pre-wrap">${result}</pre><hr><p style="font-size:11px;color:#888">Generated by KanoonSaathi</p></body></html>`); w.document.close(); setTimeout(() => w.print(), 500); } }}
                      className="btn btn-ghost" style={{ fontSize: 10, padding: '4px 8px' }}>📥 PDF</button>
                  </div>
                </div>
                {fmt(result)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
