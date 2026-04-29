import { useState } from 'react';
import NavBar from '../components/NavBar';

const TEMPLATES = [
  { id: 'fir', icon: '🚔', title: 'FIR (First Information Report)', desc: 'File a criminal complaint at the police station', fields: ['complainantName', 'fatherName', 'address', 'phone', 'incidentDate', 'incidentTime', 'incidentPlace', 'accusedName', 'accusedDesc', 'incidentDetails', 'witnessNames', 'propertyLost'] },
  { id: 'legalnotice', icon: '📜', title: 'Legal Notice', desc: 'Formal demand before filing a case', fields: ['senderName', 'senderAddress', 'recipientName', 'recipientAddress', 'subject', 'facts', 'legalBasis', 'demand', 'deadline'] },
  { id: 'rti', icon: '📋', title: 'RTI Application', desc: 'Right to Information request to any government body', fields: ['applicantName', 'applicantAddress', 'applicantPhone', 'department', 'pioDesignation', 'questions'] },
  { id: 'consumer', icon: '🛒', title: 'Consumer Complaint', desc: 'Complaint to Consumer Forum for defective products/services', fields: ['complainantName', 'complainantAddress', 'oppositePartyName', 'oppositePartyAddress', 'productService', 'purchaseDate', 'amount', 'deficiency', 'reliefSought'] },
  { id: 'harassment', icon: '👩', title: 'Workplace Harassment Complaint', desc: 'Complaint under POSH Act 2013', fields: ['complainantName', 'designation', 'department', 'respondentName', 'respondentDesignation', 'incidentDate', 'incidentPlace', 'incidentDetails', 'witnesses'] },
];

const FIELD_META = {
  complainantName: { label: 'Your Full Name', placeholder: 'e.g. Rahul Kumar', type: 'text' },
  fatherName: { label: "Father's / Spouse's Name", placeholder: 'e.g. Shri Rajesh Kumar', type: 'text' },
  address: { label: 'Your Full Address', placeholder: 'House/Flat No, Street, City, State, PIN', type: 'textarea' },
  phone: { label: 'Mobile Number', placeholder: '10-digit mobile number', type: 'tel' },
  incidentDate: { label: 'Date of Incident', placeholder: '', type: 'date' },
  incidentTime: { label: 'Approximate Time', placeholder: 'e.g. Around 9:30 PM', type: 'text' },
  incidentPlace: { label: 'Place of Incident', placeholder: 'Full address where it happened', type: 'text' },
  accusedName: { label: 'Accused Person Name (if known)', placeholder: 'Name, if known. Write "Unknown" if not', type: 'text' },
  accusedDesc: { label: 'Description of Accused', placeholder: 'Physical appearance, clothing, vehicle number etc.', type: 'textarea' },
  incidentDetails: { label: 'Describe What Happened', placeholder: 'Write in detail — what happened, in what sequence, how you were affected. Include all facts.', type: 'textarea' },
  witnessNames: { label: 'Witnesses (if any)', placeholder: 'Names and contact details of witnesses', type: 'textarea' },
  propertyLost: { label: 'Property Lost/Stolen (if any)', placeholder: 'List items with approximate value', type: 'textarea' },
  senderName: { label: 'Your Name (Sender)', placeholder: 'Your full legal name', type: 'text' },
  senderAddress: { label: 'Your Address', placeholder: 'Complete postal address', type: 'textarea' },
  recipientName: { label: 'Recipient Name', placeholder: 'Person/Company you are sending notice to', type: 'text' },
  recipientAddress: { label: 'Recipient Address', placeholder: 'Complete postal address of recipient', type: 'textarea' },
  subject: { label: 'Subject of Notice', placeholder: 'e.g. Legal Notice for Non-Payment of Salary', type: 'text' },
  facts: { label: 'Statement of Facts', placeholder: 'Explain the facts chronologically — dates, events, amounts', type: 'textarea' },
  legalBasis: { label: 'Legal Basis (optional)', placeholder: 'Laws/sections applicable (leave blank if unsure — AI will add)', type: 'textarea' },
  demand: { label: 'Your Demand', placeholder: 'What do you want the recipient to do? (e.g. Pay Rs.X, vacate property)', type: 'textarea' },
  deadline: { label: 'Deadline for Compliance', placeholder: 'e.g. 15 days from receipt of this notice', type: 'text' },
  applicantName: { label: 'Your Name', placeholder: 'Full name', type: 'text' },
  applicantAddress: { label: 'Your Address', placeholder: 'Full postal address', type: 'textarea' },
  applicantPhone: { label: 'Mobile Number', placeholder: '10-digit number', type: 'tel' },
  department: { label: 'Department / Ministry', placeholder: 'e.g. Ministry of Housing, Municipal Corporation', type: 'text' },
  pioDesignation: { label: 'PIO Designation', placeholder: 'e.g. Public Information Officer, Municipal Corp.', type: 'text' },
  questions: { label: 'Your RTI Questions', placeholder: 'List specific, clear questions — one per line.\n\n1. How much money was spent on...\n2. What is the current status of...\n3. Please provide copies of...', type: 'textarea' },
  oppositePartyName: { label: 'Company / Seller Name', placeholder: 'Business name or individual', type: 'text' },
  oppositePartyAddress: { label: 'Company / Seller Address', placeholder: 'Complete address', type: 'textarea' },
  productService: { label: 'Product / Service', placeholder: 'e.g. Samsung Galaxy S24, AC repair service', type: 'text' },
  purchaseDate: { label: 'Date of Purchase / Service', placeholder: '', type: 'date' },
  amount: { label: 'Amount Paid (₹)', placeholder: 'e.g. 15000', type: 'number' },
  deficiency: { label: 'Defect / Deficiency', placeholder: 'Describe the problem — what was promised vs what you got', type: 'textarea' },
  reliefSought: { label: 'Relief Sought', placeholder: 'e.g. Full refund of Rs.15,000 + Rs.5,000 compensation', type: 'textarea' },
  designation: { label: 'Your Designation', placeholder: 'e.g. Software Engineer, Accounts Manager', type: 'text' },
  department2: { label: 'Your Department', placeholder: 'e.g. Engineering, HR, Finance', type: 'text' },
  respondentName: { label: 'Respondent Name', placeholder: 'Name of the person who harassed', type: 'text' },
  respondentDesignation: { label: 'Respondent Designation', placeholder: 'Their position in the company', type: 'text' },
  witnesses: { label: 'Witnesses', placeholder: 'Names of colleagues who witnessed the incident', type: 'textarea' },
};

const DRAFT_PROMPTS = {
  fir: `You are a legal document drafter. Generate a formal FIR (First Information Report) in proper Indian police format. Include: To (SHO, Police Station), Subject, Reference sections of IPC/BNS, a structured Statement. Format it professionally.`,
  legalnotice: `You are a legal notice drafter. Generate a formal Legal Notice under Indian law. Include: WITHOUT PREJUDICE header, NOTICE header, From/To addresses, facts, legal basis, demand, deadline, and "I shall be constrained to take legal action" closing.`,
  rti: `You are an RTI application drafter. Generate a formal RTI application under RTI Act 2005 Sec 6. Include: To (PIO, Department), Subject, reference to RTI Act, numbered specific questions, fee payment mention (Rs.10), and applicant signature block.`,
  consumer: `You are a Consumer Forum complaint drafter. Generate a formal consumer complaint for the District Consumer Disputes Redressal Forum. Include: proper court heading, parties, facts, deficiency, legal provisions (CPA 2019), reliefs sought, and verification.`,
  harassment: `You are a POSH Act complaint drafter. Generate a formal sexual harassment complaint for the Internal Complaints Committee under POSH Act 2013. Include: To (ICC Chairperson), subject, chronological facts, impact statement, relief sought, and declaration.`,
};

export default function DraftPage({ loggedIn, user, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogin, onSignup, onLogout, onHome, onProfile, onAdmin }) {
  const [template, setTemplate] = useState(null);
  const [form, setForm] = useState({});
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const generate = async () => {
    const tpl = TEMPLATES.find(t => t.id === template);
    if (!tpl) return;

    const filledFields = tpl.fields.filter(f => form[f]?.trim());
    if (filledFields.length < 3) {
      setError('Please fill at least 3 fields to generate a draft.');
      return;
    }

    setGenerating(true);
    setDraft('');
    setError('');

    const fieldText = tpl.fields.map(f => {
      const meta = FIELD_META[f] || { label: f };
      return `${meta.label}: ${form[f] || '[Not provided]'}`;
    }).join('\n');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Please generate a ${tpl.title} draft based on this information:\n\n${fieldText}\n\nPlease fill in all standard legal language, proper formatting, and any missing details with appropriate placeholders marked as [TO BE FILLED].` }],
          system: DRAFT_PROMPTS[template] || 'You are a legal document drafter for Indian law.',
        }),
      });
      const data = await res.json();
      setDraft(data.reply || '⚠️ Could not generate draft. Please try again.');
    } catch (err) {
      setError('Could not connect to the server. Ensure the backend is running.');
    }
    setGenerating(false);
  };

  const commonProps = { loggedIn, user, onLogin, onSignup, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogout, onProfile, onHome, onAdmin, back: onHome, backLabel: '← Home' };

  return (
    <div style={{ minHeight: '100vh', background: '#07070F', color: '#F0EDE8', fontFamily: 'Georgia,serif' }}>
      <NavBar {...commonProps} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, animation: 'fadeUp 0.3s ease' }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>📝</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Legal Draft Generator</div>
          <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)', lineHeight: 1.7 }}>
            Generate ready-to-use legal documents — FIR, Legal Notice, RTI Application, Consumer Complaint. Just fill in your details.
          </div>
        </div>

        {/* Template Selector */}
        {!template ? (
          <div style={{ animation: 'fadeUp 0.3s ease' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FF9500', marginBottom: 14 }}>Choose a template:</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {TEMPLATES.map(tpl => (
                <button key={tpl.id} onClick={() => setTemplate(tpl.id)}
                  style={{ padding: '16px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', color: '#F0EDE8' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{tpl.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{tpl.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)', marginTop: 2 }}>{tpl.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ animation: 'fadeUp 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <button onClick={() => { setTemplate(null); setForm({}); setDraft(''); setError(''); }} className="btn btn-ghost" style={{ fontSize: 11 }}>← Back</button>
              <div style={{ padding: '4px 12px', borderRadius: 16, background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.25)', fontSize: 12, color: '#FF9500' }}>
                {TEMPLATES.find(t => t.id === template)?.icon} {TEMPLATES.find(t => t.id === template)?.title}
              </div>
            </div>

            <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(76,175,80,0.06)', border: '1px solid rgba(76,175,80,0.15)', borderRadius: 9, fontSize: 11, color: 'rgba(240,237,232,0.5)', lineHeight: 1.6 }}>
              💡 Fill in as many fields as you can. The AI will complete the rest with proper legal language. Mark unknown items as "Unknown" or leave blank.
            </div>

            {/* Form Fields */}
            {TEMPLATES.find(t => t.id === template)?.fields.map(fieldKey => {
              const meta = FIELD_META[fieldKey] || { label: fieldKey, type: 'text', placeholder: '' };
              return (
                <div key={fieldKey} style={{ marginBottom: 15 }}>
                  <label style={{ fontSize: 12, color: 'rgba(240,237,232,0.5)', display: 'block', marginBottom: 5 }}>{meta.label}</label>
                  {meta.type === 'textarea' ? (
                    <textarea className="input" style={{ minHeight: 80, resize: 'vertical' }} placeholder={meta.placeholder} value={form[fieldKey] || ''} onChange={e => setField(fieldKey, e.target.value)} />
                  ) : (
                    <input className="input" type={meta.type} placeholder={meta.placeholder} value={form[fieldKey] || ''} onChange={e => setField(fieldKey, e.target.value)} />
                  )}
                </div>
              );
            })}

            {error && <div style={{ marginBottom: 14, padding: '9px 12px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.25)', borderRadius: 8, fontSize: 12, color: '#E74C3C' }}>⚠️ {error}</div>}

            <button onClick={generate} disabled={generating} className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 20, opacity: generating ? 0.7 : 1 }}>
              {generating ? '📝 Generating draft…' : '📝 Generate Draft'}
            </button>

            {generating && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 12 }}>
                  {[0, 1, 2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B00', animation: `pulse 1.2s ${j * 0.2}s infinite` }} />)}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)' }}>Generating your legal document with proper formatting…</div>
              </div>
            )}

            {draft && (
              <div style={{ padding: '20px 22px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,107,0,0.15)', borderRadius: 14, animation: 'fadeUp 0.3s ease' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#FF9500', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>📝 GENERATED DRAFT</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => navigator.clipboard?.writeText(draft)} className="btn btn-ghost" style={{ fontSize: 10, padding: '4px 8px' }}>📋 Copy</button>
                    <button onClick={() => { const w = window.open('', '_blank'); if (w) { w.document.write(`<html><head><title>${TEMPLATES.find(t => t.id === template)?.title}</title><style>body{font-family:Georgia,serif;padding:40px;max-width:700px;margin:0 auto;line-height:1.7;color:#1a1a1a}h1{color:#FF6B00}</style></head><body><h1>${TEMPLATES.find(t => t.id === template)?.icon} ${TEMPLATES.find(t => t.id === template)?.title}</h1><pre style="white-space:pre-wrap;font-family:Georgia,serif;font-size:14px">${draft}</pre><hr><p style="font-size:11px;color:#888">Generated by KanoonSaathi — Review with a lawyer before submitting.</p></body></html>`); w.document.close(); setTimeout(() => w.print(), 500); } }}
                      className="btn btn-ghost" style={{ fontSize: 10, padding: '4px 8px' }}>📥 Print/PDF</button>
                    <button onClick={() => { const encoded = encodeURIComponent(draft.slice(0, 1000)); window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank'); }}
                      className="btn btn-ghost" style={{ fontSize: 10, padding: '4px 8px' }}>📱 WhatsApp</button>
                  </div>
                </div>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: 13, lineHeight: 1.7, color: 'rgba(240,237,232,0.82)', fontFamily: 'Georgia,serif' }}>{draft}</pre>
                <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(255,149,0,0.07)', border: '1px solid rgba(255,149,0,0.2)', borderRadius: 8, fontSize: 11, color: 'rgba(240,237,232,0.5)', lineHeight: 1.6 }}>
                  ⚠️ <strong>Important:</strong> This is an AI-generated draft. Please have it reviewed by a lawyer or your DLSA (15100) before official submission. Replace all [TO BE FILLED] placeholders with actual information.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
