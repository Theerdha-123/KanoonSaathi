import { useState, useMemo } from 'react';
import NavBar from '../components/NavBar';
import { IPC_TO_BNS, BNS_SEO } from '../data/ipcBnsDatabase';

/* ─── SEO Head Component ──────────────────────────────────────────────────── */
function SeoHead() {
  // Inject meta tags into document head on mount
  useState(() => {
    document.title = BNS_SEO.title;
    const setMeta = (name, content, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', BNS_SEO.description);
    setMeta('keywords', BNS_SEO.keywords);
    setMeta('og:title', BNS_SEO.ogTitle, 'property');
    setMeta('og:description', BNS_SEO.ogDescription, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('robots', 'index, follow');
    // Structured data for Google
    let ld = document.getElementById('bns-ld-json');
    if (!ld) { ld = document.createElement('script'); ld.id = 'bns-ld-json'; ld.type = 'application/ld+json'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "WebApplication",
      "name": "IPC to BNS Converter — KanoonSaathi",
      "description": BNS_SEO.description,
      "applicationCategory": "LegalService",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    });
  });
  return null;
}

/* ─── Result Card ─────────────────────────────────────────────────────────── */
function ResultCard({ entry, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, padding: '20px', transition: 'all 0.25s', cursor: 'pointer',
      animation: `fadeUp 0.3s ${index * 0.05}s ease both`,
    }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)'; e.currentTarget.style.background = 'rgba(255,107,0,0.04)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
    >
      {/* Crime Name Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F0EDE8', marginBottom: 2 }}>{entry.crimeNameEnglish}</div>
          <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.45)' }}>{entry.crimeNameHindi}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {entry.cognizable && <span style={{ padding: '3px 8px', borderRadius: 8, fontSize: 9, fontWeight: 700, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>COGNIZABLE</span>}
          <span style={{ padding: '3px 8px', borderRadius: 8, fontSize: 9, fontWeight: 700, background: entry.bailable ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${entry.bailable ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`, color: entry.bailable ? '#34D399' : '#EF4444' }}>
            {entry.bailable ? 'BAILABLE' : 'NON-BAILABLE'}
          </span>
        </div>
      </div>

      {/* Mapping Type Badge */}
      <div style={{ marginBottom: 14 }}>
        {entry.mappingType === '1:1' && <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700, background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.2)' }}>1:1 Direct Mapping</span>}
        {entry.mappingType === 'Many:1' && <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700, background: 'rgba(232,168,56,0.1)', color: '#E8A838', border: '1px solid rgba(232,168,56,0.2)' }}>Many-to-One Consolidation</span>}
        {entry.mappingType === 'Modified' && <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700, background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)' }}>Modified / Redefined</span>}
        {entry.mappingType === 'Omitted' && <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>Omitted / Decriminalized</span>}
        {entry.mappingType === 'New' && <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700, background: 'rgba(168,85,247,0.1)', color: '#A855F7', border: '1px solid rgba(168,85,247,0.2)' }}>Entirely New Section</span>}
      </div>

      {/* IPC vs BNS Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center' }}>
        {/* OLD IPC */}
        <div style={{ padding: '14px 16px', borderRadius: 12, background: entry.mappingType === 'New' ? 'rgba(255,255,255,0.02)' : 'rgba(239,68,68,0.06)', border: entry.mappingType === 'New' ? '1px dashed rgba(255,255,255,0.1)' : '1px solid rgba(239,68,68,0.12)', textAlign: 'center', opacity: entry.mappingType === 'New' ? 0.5 : 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: entry.mappingType === 'New' ? '#888' : '#EF4444', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' }}>Old · IPC</div>
          <div style={{ fontSize: entry.ipcSection.length > 8 ? 16 : 22, fontWeight: 800, color: entry.mappingType === 'New' ? '#888' : '#EF4444', textDecoration: entry.mappingType === 'Omitted' ? 'line-through' : 'none' }}>
            {entry.ipcSection === 'None' ? 'N/A' : `§ ${entry.ipcSection}`}
          </div>
          <div style={{ fontSize: 9, color: 'rgba(240,237,232,0.25)', marginTop: 4 }}>Indian Penal Code 1860</div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {entry.mappingType === 'Omitted' ? (
            <div style={{ fontSize: 20, color: '#EF4444' }}>×</div>
          ) : (
            <div style={{ fontSize: 20, color: '#FF9500', animation: 'pulse 2s infinite' }}>→</div>
          )}
          <div style={{ fontSize: 8, color: 'rgba(240,237,232,0.2)', fontWeight: 700, letterSpacing: 0.5 }}>NOW</div>
        </div>

        {/* NEW BNS */}
        <div style={{ padding: '14px 16px', borderRadius: 12, background: entry.mappingType === 'Omitted' ? 'rgba(255,255,255,0.02)' : 'rgba(52,211,153,0.06)', border: entry.mappingType === 'Omitted' ? '1px dashed rgba(255,255,255,0.1)' : '1px solid rgba(52,211,153,0.12)', textAlign: 'center', opacity: entry.mappingType === 'Omitted' ? 0.5 : 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: entry.mappingType === 'Omitted' ? '#888' : '#34D399', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' }}>New · BNS</div>
          <div style={{ fontSize: entry.bnsSection.length > 8 ? 16 : 22, fontWeight: 800, color: entry.mappingType === 'Omitted' ? '#888' : '#34D399' }}>
            {entry.bnsSection === 'Omitted' ? 'Removed' : `§ ${entry.bnsSection}`}
          </div>
          <div style={{ fontSize: 9, color: 'rgba(240,237,232,0.25)', marginTop: 4 }}>Bharatiya Nyaya Sanhita 2023</div>
        </div>
      </div>

      {/* Expanded Description */}
      {expanded && (
        <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(255,149,0,0.04)', border: '1px solid rgba(255,149,0,0.1)', borderRadius: 10, fontSize: 13, color: 'rgba(240,237,232,0.7)', lineHeight: 1.7, animation: 'fadeUp 0.2s ease' }}>
          📖 {entry.simpleDescription}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.2)' }}>{expanded ? '▲ Click to collapse' : '▼ Click for details'}</span>
      </div>
    </div>
  );
}

/* ─── Stats Bar ───────────────────────────────────────────────────────────── */
function StatsBar({ total, filtered }) {
  return (
    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', padding: '14px 0', marginBottom: 20, flexWrap: 'wrap' }}>
      {[
        ['⚖️', `${total}`, 'Total Sections'],
        ['🔄', 'July 2024', 'Effective Date'],
        ['📋', 'BNS 2023', 'New Law'],
        ['📕', 'IPC 1860', 'Replaced'],
      ].map(([icon, val, label]) => (
        <div key={label} style={{ textAlign: 'center', minWidth: 80 }}>
          <div style={{ fontSize: 12 }}>{icon}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#FF9500' }}>{val}</div>
          <div style={{ fontSize: 9, color: 'rgba(240,237,232,0.3)' }}>{label}</div>
        </div>
      ))}
      {filtered !== total && (
        <div style={{ textAlign: 'center', minWidth: 80 }}>
          <div style={{ fontSize: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#34D399' }}>{filtered}</div>
          <div style={{ fontSize: 9, color: 'rgba(240,237,232,0.3)' }}>Matches</div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function BNSTranslator({ loggedIn, user, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogin, onSignup, onLogout, onHome, onProfile, onAdmin }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return IPC_TO_BNS;
    const q = search.toLowerCase().trim();
    return IPC_TO_BNS.filter(e =>
      e.ipcSection.toLowerCase().includes(q) ||
      e.bnsSection.toLowerCase().includes(q) ||
      e.crimeNameEnglish.toLowerCase().includes(q) ||
      e.crimeNameHindi.includes(q) ||
      e.simpleDescription.toLowerCase().includes(q) ||
      e.mappingType.toLowerCase().includes(q)
    );
  }, [search]);

  const commonProps = { loggedIn, user, onLogin, onSignup, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogout, onProfile, onHome, onAdmin, back: onHome, backLabel: '← Home' };

  return (
    <div style={{ minHeight: '100vh', background: '#07070F', color: '#F0EDE8', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <SeoHead />
      <NavBar {...commonProps} />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '28px 20px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 28, animation: 'fadeUp 0.3s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 10, filter: 'drop-shadow(0 0 14px rgba(255,107,0,0.3))' }}>🔄</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, background: 'linear-gradient(90deg,#FF6B00,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            IPC → BNS Translator
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.45)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            India's criminal law changed on 1 July 2024. The Indian Penal Code (1860) is now replaced by the <strong style={{ color: '#FF9500' }}>Bharatiya Nyaya Sanhita (BNS) 2023</strong>. Search any crime, IPC section, or BNS section below.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>🔍</div>
          <input
            className="input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search: "Theft", "302", "Murder", "चोरी", or any BNS section...'
            style={{ paddingLeft: 46, fontSize: 14, padding: '14px 16px 14px 46px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,107,0,0.15)', width: '100%' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, padding: '4px 10px', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Quick Filter Chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 22, justifyContent: 'center' }}>
          {['1:1', 'Many:1', 'Omitted', 'New', 'Murder', 'Theft', 'Cheating', 'Rape'].map(chip => (
            <button key={chip} onClick={() => setSearch(chip)}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                background: search === chip ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)',
                border: search === chip ? '1px solid rgba(255,107,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
                color: search === chip ? '#FF9500' : 'rgba(240,237,232,0.4)',
              }}>
              {chip}
            </button>
          ))}
        </div>

        <StatsBar total={IPC_TO_BNS.length} filtered={filtered.length} />

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', animation: 'fadeUp 0.3s ease' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>No matching sections found</div>
            <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)' }}>Try searching by crime name, IPC number, or BNS number</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map((entry, i) => <ResultCard key={entry.ipcSection} entry={entry} index={i} />)}
          </div>
        )}

        {/* Legal Disclaimer */}
        <div style={{ marginTop: 32, padding: '18px 20px', background: 'rgba(255,149,0,0.04)', border: '1px solid rgba(255,149,0,0.12)', borderRadius: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>⚖️</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#FF9500', marginBottom: 6 }}>Legal Disclaimer</div>
          <div style={{ fontSize: 12, color: 'rgba(240,237,232,0.45)', lineHeight: 1.8, maxWidth: 560, margin: '0 auto' }}>
            <strong>I am not a lawyer.</strong> This tool is for <em>educational and informational purposes only</em> and does NOT constitute legal advice. While we strive for accuracy, section mappings may not cover all sub-clauses, provisos, or exceptions. Always consult a qualified advocate or your nearest <strong>DLSA (15100)</strong> for legal matters. Data based on the Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023), effective 1 July 2024.
          </div>
        </div>

        {/* SEO-friendly content block */}
        <div style={{ marginTop: 24, padding: '16px 18px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#FF9500', marginBottom: 10 }}>About the IPC to BNS Transition</h2>
          <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)', lineHeight: 1.8, marginBottom: 10 }}>
            On 1 July 2024, India replaced its 164-year-old Indian Penal Code (IPC) with the <strong>Bharatiya Nyaya Sanhita (BNS) 2023</strong>. Similarly, the Code of Criminal Procedure (CrPC) was replaced by the <strong>Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023</strong>, and the Indian Evidence Act by the <strong>Bharatiya Sakshya Adhiniyam (BSA) 2023</strong>.
          </p>
          <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)', lineHeight: 1.8 }}>
            This free IPC to BNS converter tool by KanoonSaathi helps Indian citizens, law students, journalists, and legal professionals quickly find the new BNS section equivalent for any old IPC section. Search by crime name (in English or Hindi), old IPC number, or new BNS number.
          </p>
        </div>
      </div>
    </div>
  );
}
