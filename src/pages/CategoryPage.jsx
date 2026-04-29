import NavBar from '../components/NavBar';
import { LAW_DB } from '../data/lawDatabase';

export default function CategoryPage({ catId, loggedIn, user, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogin, onSignup, onLogout, onHome, onProfile, onAdmin, onChat, bookmarkHook }) {
  const cat = LAW_DB[catId];
  const { isBookmarked, toggleBookmark } = bookmarkHook;

  if (!cat) return <div style={{ padding:40,textAlign:'center',color:'#F0EDE8' }}>Category not found.</div>;

  return (
    <div style={{ minHeight:'100vh',background:'#07070F',color:'#F0EDE8',fontFamily:'Georgia,serif' }}>
      <NavBar loggedIn={loggedIn} user={user} onLogin={onLogin} onSignup={onSignup} lang={lang} theme={theme} fontSize={fontSize} setTheme={setTheme} setFontSize={setFontSize} onLangPick={onLangPick} onLogout={onLogout} onProfile={onProfile} onHome={onHome} onAdmin={onAdmin} back={onHome} />

      <div style={{ maxWidth:740,margin:'0 auto',padding:'24px 20px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:8 }}>
          <div style={{ width:50,height:50,borderRadius:12,background:`${cat.color}16`,border:`1px solid ${cat.color}35`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26 }}>{cat.icon}</div>
          <div>
            <div style={{ fontSize:20,fontWeight:700,color:cat.color }}>{cat.title}</div>
            <div style={{ fontSize:12,color:'rgba(240,237,232,0.35)' }}>{cat.laws.length} laws covered · Click any law for AI explanation</div>
          </div>
        </div>

        <div style={{ marginBottom:20,padding:'10px 14px',background:'rgba(255,107,0,0.05)',border:'1px solid rgba(255,107,0,0.12)',borderRadius:9,fontSize:12,color:'rgba(240,237,232,0.5)',lineHeight:1.6 }}>
          💡 Each card shows the section number, plain-language description, and what you should do. Click <strong style={{ color:'#FF9500' }}>Ask AI</strong> for a personalised answer.
        </div>

        {cat.laws.map((law, i) => (
          <div key={i} className="card" style={{ borderColor:'rgba(255,255,255,0.06)',marginBottom:9,cursor:'default',animation:`fadeUp 0.3s ease ${i*0.05}s both` }}>
            <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:4 }}>
              <div style={{ fontSize:14,fontWeight:700,flex:1 }}>{law.name}</div>
              <button
                onClick={() => toggleBookmark({ id:`law_${cat.id}_${i}`,type:'law',title:law.name,section:law.section,desc:law.desc,actionable:law.actionable,color:cat.color,catIcon:cat.icon,catTitle:cat.title,catId:cat.id })}
                style={{ background:'none',border:'none',cursor:'pointer',fontSize:18,padding:'0 2px',flexShrink:0,opacity:isBookmarked(`law_${cat.id}_${i}`)?1:0.35,color:isBookmarked(`law_${cat.id}_${i}`)?'#FFD700':'#F0EDE8',transition:'all 0.2s' }}>
                {isBookmarked(`law_${cat.id}_${i}`) ? '⭐' : '☆'}
              </button>
            </div>
            <span className="tag" style={{ background:`${cat.color}12`,color:cat.color,border:`1px solid ${cat.color}25`,marginBottom:7,display:'inline-block' }}>{law.section}</span>
            <div style={{ fontSize:12,color:'rgba(240,237,232,0.48)',lineHeight:1.65,marginBottom:9 }}>{law.desc}</div>
            <div style={{ fontSize:12,color:'#4CAF50',background:'rgba(76,175,80,0.06)',border:'1px solid rgba(76,175,80,0.15)',borderRadius:7,padding:'7px 11px',marginBottom:9,lineHeight:1.5 }}>✅ {law.actionable}</div>
            <button className="btn" style={{ padding:'6px 13px',borderRadius:6,background:`${cat.color}10`,border:`1px solid ${cat.color}28`,color:cat.color,fontSize:11,fontWeight:600 }}
              onClick={() => onChat(`Explain "${law.name}" (${law.section}) in detail for a common Indian citizen. Cover what it means, how to use it, and exact action steps.`)}>
              Ask AI about this law →
            </button>
          </div>
        ))}

        <div style={{ marginTop:24,textAlign:'center' }}>
          <button className="btn btn-primary btn-lg" onClick={() => onChat(null)}>Ask Custom Query about {cat.title} ⚖️</button>
        </div>
      </div>
    </div>
  );
}
