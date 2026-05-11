import { useState, useEffect, useRef } from 'react';
import NavBar from '../components/NavBar';
import { TEMPLATES, FIELD_META, DRAFT_PROMPTS } from '../data/draftTemplates';

const HISTORY_KEY = 'ks_draft_history';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function saveHistory(list) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 20))); } catch {}
}

/* ─── Step Indicator ─────────────────────────────────────────────────────── */
function StepBar({ steps, current, onStep }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:28 }}>
      {steps.map((label, i) => {
        const done = i < current, active = i === current;
        return (
          <div key={i} style={{ display:'flex', alignItems:'center', flex:1 }}>
            <button onClick={() => onStep(i)} style={{
              width:32, height:32, borderRadius:'50%', border: active ? '2px solid #FF9500' : done ? '2px solid #4CAF50' : '2px solid rgba(255,255,255,0.12)',
              background: done ? '#4CAF50' : active ? 'rgba(255,107,0,0.15)' : 'transparent',
              color: done ? '#fff' : active ? '#FF9500' : 'rgba(240,237,232,0.35)',
              fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.3s',
            }}>
              {done ? '✓' : i + 1}
            </button>
            <div style={{ flex:1, marginLeft:8 }}>
              <div style={{ fontSize:11, fontWeight: active ? 700 : 400, color: active ? '#FF9500' : done ? '#4CAF50' : 'rgba(240,237,232,0.3)' }}>{label}</div>
            </div>
            {i < steps.length - 1 && <div style={{ width:40, height:2, background: done ? '#4CAF50' : 'rgba(255,255,255,0.08)', margin:'0 8px', borderRadius:2 }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Template Card ──────────────────────────────────────────────────────── */
function TemplateCard({ tpl, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding:'20px', borderRadius:16,
        background: hover ? 'rgba(255,107,0,0.07)' : 'rgba(255,255,255,0.025)',
        border: hover ? '1px solid rgba(255,107,0,0.3)' : '1px solid rgba(255,255,255,0.08)',
        cursor:'pointer', textAlign:'left', fontFamily:'inherit', color:'#F0EDE8', transition:'all 0.25s', width:'100%',
      }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
        <div style={{ fontSize:32, width:48, height:48, borderRadius:12, background:'rgba(255,107,0,0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>{tpl.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700 }}>{tpl.title}</div>
          <div style={{ fontSize:12, color:'rgba(240,237,232,0.45)', marginTop:2 }}>{tpl.desc}</div>
        </div>
        <span style={{ padding:'3px 10px', borderRadius:12, background:'rgba(255,107,0,0.08)', border:'1px solid rgba(255,107,0,0.15)', fontSize:10, color:'#FF9500', fontWeight:600 }}>{tpl.category}</span>
      </div>
      <div style={{ fontSize:10, color:'rgba(240,237,232,0.25)' }}>
        {tpl.steps.length} sections · {tpl.steps.reduce((a, s) => a + s.fields.length, 0)} fields
      </div>
    </button>
  );
}

/* ─── Document Preview (Paper Style) ─────────────────────────────────────── */
function DocumentPreview({ draft, templateTitle, templateIcon }) {
  const formatted = draft
    .replace(/\[TO BE FILLED\]/g, '<mark style="background:rgba(255,149,0,0.18);color:#FF9500;padding:1px 4px;border-radius:3px;font-weight:600">[TO BE FILLED]</mark>')
    .replace(/^(#{1,3})\s+(.+)$/gm, (_, h, t) => {
      const sz = h.length === 1 ? 18 : h.length === 2 ? 15 : 13;
      return `<div style="font-size:${sz}px;font-weight:700;margin:18px 0 8px;color:#F0EDE8;border-bottom:${h.length===1?'1px solid rgba(255,255,255,0.08)':'none'};padding-bottom:${h.length===1?'8px':'0'}">${t}</div>`;
    })
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:16px 0"/>')
    .replace(/\n/g, '<br/>');

  return (
    <div style={{
      background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,107,0,0.12)', borderRadius:16,
      padding:'32px 28px', fontFamily:'Georgia,serif', lineHeight:1.8, fontSize:13.5,
      color:'rgba(240,237,232,0.85)', position:'relative', boxShadow:'0 4px 24px rgba(0,0,0,0.3)',
    }}>
      {/* Letterhead */}
      <div style={{ textAlign:'center', marginBottom:24, paddingBottom:16, borderBottom:'2px solid rgba(255,107,0,0.2)' }}>
        <div style={{ fontSize:14, letterSpacing:1, color:'#FF9500', fontWeight:700, marginBottom:4 }}>
          {templateIcon} {templateTitle.toUpperCase()}
        </div>
        <div style={{ fontSize:10, color:'rgba(240,237,232,0.25)' }}>Generated by KanoonSaathi AI · For Review Only</div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: formatted }} />
      {/* Footer */}
      <div style={{ marginTop:28, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.06)', fontSize:11, color:'rgba(240,237,232,0.3)', textAlign:'center', lineHeight:1.7 }}>
        ⚠️ AI-generated draft · Review with a qualified advocate before submission<br/>
        Replace all <mark style={{ background:'rgba(255,149,0,0.18)', color:'#FF9500', padding:'1px 4px', borderRadius:3, fontSize:10 }}>[TO BE FILLED]</mark> placeholders with actual information
      </div>
    </div>
  );
}

/* ─── Main DraftPage ─────────────────────────────────────────────────────── */
export default function DraftPage({ loggedIn, user, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogin, onSignup, onLogout, onHome, onProfile, onAdmin, auth }) {
  const [templateId, setTemplateId] = useState(null);
  const [wizardStep, setWizardStep] = useState(0); // 0=select, 1..N=form steps, last+1=preview
  const [form, setForm] = useState({});
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState(loadHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef(null);

  const tpl = TEMPLATES.find(t => t.id === templateId);
  const totalFormSteps = tpl ? tpl.steps.length : 0;
  const isPreviewStep = wizardStep > totalFormSteps;

  // Auto-fill from user profile
  useEffect(() => {
    if (!tpl || !user) return;
    const allFields = tpl.steps.flatMap(s => s.fields);
    const prefilled = { ...form };
    let changed = false;
    allFields.forEach(f => {
      const meta = FIELD_META[f];
      if (meta?.autoFill && !prefilled[f]) {
        if (meta.autoFill === 'name' && user.name) { prefilled[f] = user.name; changed = true; }
        if (meta.autoFill === 'phone' && user.phone) { prefilled[f] = user.phone; changed = true; }
      }
    });
    if (changed) setForm(prefilled);
  }, [templateId, user]);

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const selectTemplate = (id) => { setTemplateId(id); setWizardStep(1); setForm({}); setDraft(''); setError(''); };
  const resetAll = () => { setTemplateId(null); setWizardStep(0); setForm({}); setDraft(''); setError(''); };

  const generate = async () => {
    if (!tpl) return;
    const allFields = tpl.steps.flatMap(s => s.fields);
    const filledCount = allFields.filter(f => form[f]?.toString().trim()).length;
    if (filledCount < 3) { setError('Please fill at least 3 fields to generate a draft.'); return; }

    setGenerating(true); setDraft(''); setError('');
    const fieldText = allFields.map(f => {
      const meta = FIELD_META[f] || { label: f };
      return `${meta.label}: ${form[f] || '[Not provided]'}`;
    }).join('\n');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (auth?.token) headers['Authorization'] = `Bearer ${auth.token}`;

      const res = await fetch('/api/chat', {
        method: 'POST', headers,
        credentials: 'include',
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Generate a ${tpl.title} draft based on this information:\n\n${fieldText}\n\nFill in all standard legal language, proper formatting, section headers, and placeholders marked as [TO BE FILLED] for any missing details. Output the document as properly formatted text with clear section headers.` }],
          system: DRAFT_PROMPTS[templateId] || 'You are a legal document drafter for Indian law. Use BNS 2023 references.',
        }),
      });
      const data = await res.json();
      let reply = data.reply || '';
      // If reply is JSON-wrapped, extract it
      try { const parsed = JSON.parse(reply); reply = parsed.response || parsed.content || parsed.reply || reply; } catch {}
      if (!reply) reply = '⚠️ Could not generate draft. Please try again.';
      setDraft(reply);
      setWizardStep(totalFormSteps + 1);

      // Save to history
      const entry = { id: Date.now(), templateId, title: tpl.title, icon: tpl.icon, date: new Date().toISOString(), draft: reply.slice(0, 2000) };
      const updated = [entry, ...history].slice(0, 20);
      setHistory(updated); saveHistory(updated);

      // Track analytics
      auth?.trackDraft?.(templateId, lang);
    } catch {
      setError('Could not connect to server. Please ensure the backend is running.');
    }
    setGenerating(false);
  };

  const copyDraft = () => {
    navigator.clipboard?.writeText(draft);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const printDraft = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${tpl?.title || 'Legal Draft'}</title>
    <style>
      body { font-family: Georgia, serif; padding: 50px 60px; max-width: 750px; margin: 0 auto; line-height: 1.8; color: #1a1a1a; font-size: 14px; }
      h1 { font-size: 20px; text-align: center; border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 24px; }
      h2 { font-size: 16px; margin-top: 24px; border-bottom: 1px solid #ccc; padding-bottom: 6px; }
      h3 { font-size: 14px; margin-top: 18px; }
      hr { border: none; border-top: 1px solid #ccc; margin: 20px 0; }
      .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #999; font-size: 11px; color: #888; text-align: center; }
      @media print { .footer { position: fixed; bottom: 20px; left: 0; right: 0; } }
    </style></head><body>
    <h1>${tpl?.icon || ''} ${tpl?.title || 'Legal Draft'}</h1>
    <pre style="white-space:pre-wrap;font-family:Georgia,serif;font-size:14px;line-height:1.8">${draft}</pre>
    <div class="footer">Generated by KanoonSaathi · AI-generated draft — Review with a qualified advocate before submission</div>
    </body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 600);
  };

  const shareDraft = () => {
    const text = `${tpl?.icon} ${tpl?.title}\n\n${draft.slice(0, 800)}...\n\n— Generated by KanoonSaathi (AI Legal Assistant)`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const loadFromHistory = (entry) => {
    setTemplateId(entry.templateId);
    setDraft(entry.draft);
    setWizardStep(TEMPLATES.find(t => t.id === entry.templateId)?.steps.length + 1 || 1);
    setShowHistory(false);
  };

  const commonProps = { loggedIn, user, onLogin, onSignup, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogout, onProfile, onHome, onAdmin, back: onHome, backLabel: '← Home' };

  return (
    <div style={{ minHeight:'100vh', background:'#07070F', color:'#F0EDE8', fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <NavBar {...commonProps} />

      <div style={{ maxWidth:800, margin:'0 auto', padding:'28px 20px' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:28, animation:'fadeUp 0.3s ease' }}>
          <div style={{ fontSize:48, marginBottom:10, filter:'drop-shadow(0 0 12px rgba(255,107,0,0.3))' }}>📝</div>
          <div style={{ fontSize:24, fontWeight:800, marginBottom:6, background:'linear-gradient(90deg,#FF6B00,#FFD700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>AI Legal Draft Generator</div>
          <div style={{ fontSize:13, color:'rgba(240,237,232,0.4)', lineHeight:1.7, maxWidth:500, margin:'0 auto' }}>
            Generate production-ready legal documents — FIR, Legal Notice, RTI, Rent Agreement & more. Updated for BNS/BNSS 2023.
          </div>
          {history.length > 0 && (
            <button onClick={() => setShowHistory(!showHistory)} style={{ marginTop:12, padding:'6px 16px', borderRadius:20, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(240,237,232,0.5)', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>
              📂 {showHistory ? 'Hide' : 'Show'} Recent Drafts ({history.length})
            </button>
          )}
        </div>

        {/* History Panel */}
        {showHistory && history.length > 0 && (
          <div style={{ marginBottom:24, padding:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, animation:'fadeUp 0.2s ease' }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#FF9500', marginBottom:12 }}>📂 Recent Drafts</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {history.map(h => (
                <button key={h.id} onClick={() => loadFromHistory(h)} style={{
                  padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)',
                  cursor:'pointer', fontFamily:'inherit', color:'#F0EDE8', textAlign:'left', display:'flex', alignItems:'center', gap:10, transition:'all 0.2s',
                }}>
                  <span style={{ fontSize:20 }}>{h.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600 }}>{h.title}</div>
                    <div style={{ fontSize:10, color:'rgba(240,237,232,0.3)' }}>{new Date(h.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
                  </div>
                  <span style={{ fontSize:10, color:'rgba(240,237,232,0.25)' }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* === STEP 0: Template Selection === */}
        {wizardStep === 0 && (
          <div style={{ animation:'fadeUp 0.3s ease' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#FF9500', marginBottom:16 }}>Choose a document type:</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:12 }}>
              {TEMPLATES.map(t => <TemplateCard key={t.id} tpl={t} onClick={() => selectTemplate(t.id)} />)}
            </div>
          </div>
        )}

        {/* === STEPS 1..N: Form Fields === */}
        {tpl && wizardStep >= 1 && wizardStep <= totalFormSteps && (
          <div style={{ animation:'fadeUp 0.25s ease' }}>
            {/* Template badge + Back */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <button onClick={resetAll} style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'6px 14px', color:'rgba(240,237,232,0.5)', cursor:'pointer', fontSize:11, fontFamily:'inherit' }}>← Back</button>
              <div style={{ padding:'5px 14px', borderRadius:20, background:'rgba(255,107,0,0.08)', border:'1px solid rgba(255,107,0,0.2)', fontSize:12, color:'#FF9500', fontWeight:600 }}>
                {tpl.icon} {tpl.title}
              </div>
            </div>

            {/* Step indicator */}
            <StepBar steps={[...tpl.steps.map(s => s.title), 'Preview & Export']} current={wizardStep - 1} onStep={(i) => setWizardStep(i + 1)} />

            {/* Auto-fill notice */}
            {user && (
              <div style={{ marginBottom:16, padding:'8px 14px', background:'rgba(76,175,80,0.06)', border:'1px solid rgba(76,175,80,0.12)', borderRadius:10, fontSize:11, color:'rgba(240,237,232,0.5)', display:'flex', alignItems:'center', gap:8 }}>
                <span>✨</span> Some fields auto-filled from your profile. Edit as needed.
              </div>
            )}

            {/* Current step fields */}
            {(() => {
              const step = tpl.steps[wizardStep - 1];
              if (!step) return null;
              return (
                <div>
                  <div style={{ fontSize:16, fontWeight:700, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:28, height:28, borderRadius:8, background:'rgba(255,107,0,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'#FF9500', fontWeight:700 }}>{wizardStep}</span>
                    {step.title}
                  </div>
                  {step.fields.map(fieldKey => {
                    const meta = FIELD_META[fieldKey] || { label: fieldKey, type: 'text', placeholder: '' };
                    return (
                      <div key={fieldKey} style={{ marginBottom:18 }}>
                        <label style={{ fontSize:12, color:'rgba(240,237,232,0.55)', display:'block', marginBottom:6, fontWeight:500 }}>{meta.label}</label>
                        {meta.type === 'textarea' ? (
                          <textarea className="input" style={{ minHeight: (meta.rows || 3) * 24, resize:'vertical' }}
                            placeholder={meta.placeholder} value={form[fieldKey] || ''} onChange={e => setField(fieldKey, e.target.value)} />
                        ) : (
                          <input className="input" type={meta.type} placeholder={meta.placeholder || ''}
                            value={form[fieldKey] || ''} onChange={e => setField(fieldKey, e.target.value)} />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {error && <div style={{ marginBottom:14, padding:'10px 14px', background:'rgba(231,76,60,0.08)', border:'1px solid rgba(231,76,60,0.25)', borderRadius:10, fontSize:12, color:'#E74C3C' }}>⚠️ {error}</div>}

            {/* Navigation */}
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              {wizardStep > 1 && (
                <button onClick={() => setWizardStep(w => w - 1)} className="btn btn-secondary" style={{ flex:1, padding:13, borderRadius:10, fontSize:13 }}>
                  ← Previous
                </button>
              )}
              {wizardStep < totalFormSteps ? (
                <button onClick={() => { setError(''); setWizardStep(w => w + 1); }} className="btn btn-primary" style={{ flex:2, padding:13, borderRadius:10, fontSize:13 }}>
                  Next: {tpl.steps[wizardStep]?.title} →
                </button>
              ) : (
                <button onClick={generate} disabled={generating} className="btn btn-primary btn-lg" style={{ flex:2, padding:13, borderRadius:10, fontSize:14, opacity: generating ? 0.7 : 1 }}>
                  {generating ? '⚡ Generating with AI…' : '⚡ Generate Draft'}
                </button>
              )}
            </div>

            {/* Generating animation */}
            {generating && (
              <div style={{ padding:28, textAlign:'center', marginTop:16, animation:'fadeUp 0.3s ease' }}>
                <div style={{ display:'flex', gap:6, justifyContent:'center', marginBottom:14 }}>
                  {[0,1,2,3,4].map(j => <div key={j} style={{ width:8, height:8, borderRadius:'50%', background:'#FF6B00', animation:`pulse 1.4s ${j*0.15}s infinite` }} />)}
                </div>
                <div style={{ fontSize:14, fontWeight:600, color:'rgba(240,237,232,0.7)', marginBottom:6 }}>Drafting your {tpl.title}…</div>
                <div style={{ fontSize:11, color:'rgba(240,237,232,0.3)' }}>Applying proper legal formatting, BNS/BNSS references, and section headers</div>
              </div>
            )}
          </div>
        )}

        {/* === PREVIEW STEP === */}
        {tpl && isPreviewStep && draft && (
          <div style={{ animation:'fadeUp 0.3s ease' }} ref={previewRef}>
            {/* Top bar */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, flexWrap:'wrap' }}>
              <button onClick={resetAll} style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'6px 14px', color:'rgba(240,237,232,0.5)', cursor:'pointer', fontSize:11, fontFamily:'inherit' }}>← New Draft</button>
              <div style={{ padding:'5px 14px', borderRadius:20, background:'rgba(76,175,80,0.08)', border:'1px solid rgba(76,175,80,0.2)', fontSize:12, color:'#4CAF50', fontWeight:600 }}>
                ✅ Draft Generated
              </div>
              <div style={{ flex:1 }} />
              {/* Export buttons */}
              <button onClick={copyDraft} style={{ padding:'7px 14px', borderRadius:8, background:'rgba(255,107,0,0.08)', border:'1px solid rgba(255,107,0,0.2)', color:'#FF9500', fontSize:11, cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
              <button onClick={printDraft} style={{ padding:'7px 14px', borderRadius:8, background:'rgba(255,107,0,0.08)', border:'1px solid rgba(255,107,0,0.2)', color:'#FF9500', fontSize:11, cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
                🖨️ Print/PDF
              </button>
              <button onClick={shareDraft} style={{ padding:'7px 14px', borderRadius:8, background:'rgba(76,175,80,0.08)', border:'1px solid rgba(76,175,80,0.2)', color:'#4CAF50', fontSize:11, cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
                📱 WhatsApp
              </button>
            </div>

            <StepBar steps={[...tpl.steps.map(s => s.title), 'Preview & Export']} current={totalFormSteps} onStep={(i) => { if (i <= totalFormSteps - 1) setWizardStep(i + 1); }} />

            <DocumentPreview draft={draft} templateTitle={tpl.title} templateIcon={tpl.icon} />

            {/* Legal Disclaimer */}
            <div style={{ marginTop:20, padding:'14px 18px', background:'rgba(255,149,0,0.05)', border:'1px solid rgba(255,149,0,0.15)', borderRadius:12, fontSize:11, color:'rgba(240,237,232,0.45)', lineHeight:1.7 }}>
              <strong style={{ color:'#FF9500' }}>⚠️ Legal Disclaimer:</strong> This document is AI-generated using KanoonSaathi and is intended as a starting template only. It does NOT constitute legal advice. Please have this draft reviewed by a qualified advocate or your nearest DLSA (Helpline: 15100) before official submission. All references to BNS 2023, BNSS 2023, and other statutes should be independently verified.
            </div>

            {/* Edit button */}
            <button onClick={() => setWizardStep(1)} className="btn btn-secondary" style={{ width:'100%', marginTop:14, padding:12, borderRadius:10, fontSize:12 }}>
              ✏️ Edit Details & Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
