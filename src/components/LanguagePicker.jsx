import { useState } from 'react';
import { LANGUAGES } from '../data/languages';

export default function LanguagePicker({ lang, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.includes(search) ||
    l.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{ position:'fixed',inset:0,zIndex:300,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(14px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}
      onClick={onClose}
    >
      <div
        style={{ width:'100%',maxWidth:560,background:'var(--bg-card)',border:'1px solid var(--border-medium)',borderRadius:20,padding:'28px 24px',maxHeight:'85vh',display:'flex',flexDirection:'column',animation:'fadeUp 0.25s ease' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18 }}>
          <div>
            <div style={{ fontSize:18,fontWeight:700,fontFamily:'var(--font-serif)',color:'var(--text-primary)' }}>🌐 Choose Language</div>
            <div style={{ fontSize:11,color:'var(--text-muted)',marginTop:3 }}>22 Scheduled Languages + English (Article 344, 8th Schedule)</div>
          </div>
          <button onClick={onClose} style={{ background:'var(--border-light)',border:'1px solid var(--border-medium)',color:'var(--text-secondary)',borderRadius:8,width:32,height:32,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
        </div>

        <input
          value={search} onChange={e => setSearch(e.target.value)}
          className="input"
          style={{ marginBottom:16 }}
          placeholder="Search by language name or region…"
        />

        <div style={{ overflowY:'auto',flex:1 }}>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:8 }}>
            {filtered.map(l => {
              const active = lang === l.code;
              return (
                <button key={l.code} onClick={() => { onSelect(l.code); onClose(); }}
                  style={{
                    padding:'11px 12px',borderRadius:10,cursor:'pointer',textAlign:'left',fontFamily:'inherit',transition:'all 0.15s',
                    border:`1px solid ${active ? 'var(--accent)' : 'var(--border-light)'}`,
                    background: active ? 'var(--accent-bg)' : 'transparent',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={e => { if(!active) { e.currentTarget.style.background='var(--bg-card-hover)'; e.currentTarget.style.borderColor='var(--accent-border)'; }}}
                  onMouseLeave={e => { if(!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='var(--border-light)'; }}}
                >
                  <div style={{ fontSize:16,marginBottom:3,direction:l.dir }}>{l.native}</div>
                  <div style={{ fontSize:11,color:active?'var(--accent)':'var(--text-secondary)',fontWeight:active?700:400 }}>{l.name}</div>
                  <div style={{ fontSize:9,color:'var(--text-muted)',marginTop:2,lineHeight:1.3 }}>{l.region}</div>
                  {active && <div style={{ fontSize:9,color:'var(--accent)',marginTop:3 }}>✓ Selected</div>}
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign:'center',padding:'32px 0',color:'var(--text-muted)',fontSize:13 }}>No language found for "{search}"</div>
          )}
        </div>

        <div style={{ marginTop:14,padding:'9px 12px',background:'var(--accent-bg)',border:'1px solid var(--accent-border)',borderRadius:8,fontSize:11,color:'var(--text-muted)',lineHeight:1.6 }}>
          🇮🇳 All 22 languages listed in the 8th Schedule of the Constitution of India are included. The AI will respond in your chosen language.
        </div>
      </div>
    </div>
  );
}
