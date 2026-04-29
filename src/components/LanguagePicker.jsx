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
        style={{ width:'100%',maxWidth:560,background:'#0E0E1A',border:'1px solid rgba(255,107,0,0.22)',borderRadius:20,padding:'28px 24px',maxHeight:'85vh',display:'flex',flexDirection:'column',animation:'fadeUp 0.25s ease' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18 }}>
          <div>
            <div style={{ fontSize:18,fontWeight:700,fontFamily:'Georgia,serif' }}>🌐 Choose Language</div>
            <div style={{ fontSize:11,color:'rgba(240,237,232,0.4)',marginTop:3 }}>22 Scheduled Languages + English (Article 344, 8th Schedule)</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(240,237,232,0.6)',borderRadius:8,width:32,height:32,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
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
                    border:`1px solid ${active ? 'rgba(255,107,0,0.6)' : 'rgba(255,255,255,0.08)'}`,
                    background: active ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.03)',
                  }}
                  onMouseEnter={e => { if(!active) { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,107,0,0.3)'; }}}
                  onMouseLeave={e => { if(!active) { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}}
                >
                  <div style={{ fontSize:16,marginBottom:3,direction:l.dir }}>{l.native}</div>
                  <div style={{ fontSize:11,color:active?'#FF9500':'rgba(240,237,232,0.55)',fontWeight:active?700:400 }}>{l.name}</div>
                  <div style={{ fontSize:9,color:'rgba(240,237,232,0.28)',marginTop:2,lineHeight:1.3 }}>{l.region}</div>
                  {active && <div style={{ fontSize:9,color:'#FF9500',marginTop:3 }}>✓ Selected</div>}
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign:'center',padding:'32px 0',color:'rgba(240,237,232,0.35)',fontSize:13 }}>No language found for "{search}"</div>
          )}
        </div>

        <div style={{ marginTop:14,padding:'9px 12px',background:'rgba(255,107,0,0.05)',border:'1px solid rgba(255,107,0,0.12)',borderRadius:8,fontSize:11,color:'rgba(240,237,232,0.4)',lineHeight:1.6 }}>
          🇮🇳 All 22 languages listed in the 8th Schedule of the Constitution of India are included. The AI will respond in your chosen language.
        </div>
      </div>
    </div>
  );
}
