import { LANGUAGES } from '../data/languages';

export default function NavBar({ loggedIn, user, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogin, onSignup, onLogout, onHome, onProfile, onAdmin, back, backLabel = '← Home' }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={onHome}>
        <div className="navbar-logo-icon">⚖️</div>
        <span className="navbar-logo-text">KanoonSaathi</span>
      </div>
      <div className="navbar-actions">
        {back && <button className="btn btn-ghost" onClick={back} style={{ fontSize:11 }}>{backLabel}</button>}
        
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn" style={{ padding:'5px 8px',borderRadius:7,background:'rgba(255,107,0,0.08)',border:'1px solid rgba(255,107,0,0.25)',color:'#FF9500',fontSize:13 }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <button onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')} className="btn" style={{ padding:'5px 8px',borderRadius:7,background:'rgba(255,107,0,0.08)',border:'1px solid rgba(255,107,0,0.25)',color:'#FF9500',fontSize:12,fontWeight:'bold' }}>
          {fontSize === 'normal' ? 'A+' : 'A-'}
        </button>

        <button onClick={onLangPick} className="btn" style={{ padding:'5px 10px',borderRadius:7,background:'rgba(255,107,0,0.08)',border:'1px solid rgba(255,107,0,0.25)',color:'#FF9500',fontSize:11,display:'flex',alignItems:'center',gap:5 }}>
          🌐 <span style={{ direction: LANGUAGES.find(l => l.code === lang)?.dir || 'ltr' }}>{LANGUAGES.find(l => l.code === lang)?.native || 'EN'}</span>
        </button>
        {loggedIn ? (
          <>
            <div onClick={onProfile} style={{ display:'flex',alignItems:'center',gap:5,padding:'5px 10px',borderRadius:20,background:'rgba(255,107,0,0.1)',border:'1px solid rgba(255,107,0,0.2)',cursor:'pointer' }}>
              <div style={{ width:20,height:20,borderRadius:'50%',background:'linear-gradient(135deg,#FF6B00,#FF9500)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10 }}>👤</div>
              <span style={{ fontSize:11,color:'#FF9500',fontWeight:600 }}>{user?.name?.split(' ')[0]}</span>
            </div>
            {onAdmin && <button className="btn" onClick={onAdmin} style={{ fontSize:10,padding:'5px 10px',borderRadius:7,background:'rgba(231,76,60,0.08)',border:'1px solid rgba(231,76,60,0.25)',color:'#E74C3C',fontWeight:700 }}>🔐 Admin</button>}
            <button className="btn btn-ghost" onClick={onLogout} style={{ fontSize:11 }}>Logout</button>
          </>
        ) : (
          <>
            <button className="btn btn-accent-outline" onClick={onLogin} style={{ fontSize:11 }}>Login</button>
            <button className="btn btn-primary" onClick={onSignup} style={{ padding:'6px 14px',fontSize:11 }}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}
