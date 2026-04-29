import { useState } from 'react';
import NavBar from '../components/NavBar';
import { SCENARIOS, HELPLINES, RIGHTS, WOMEN_APPS, DISABILITY_LAWS, WHAT_IF, LAW_FACTS } from '../data/index';
import { LAW_DB } from '../data/lawDatabase';
import { LANGUAGES, getT } from '../data/languages';

export default function HomePage({ loggedIn, user, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogin, onSignup, onLogout, onHome, onProfile, onAdmin, onChat, onCategory, speech, bookmarkHook, onAnalyzer, onDrafts, onVoiceOnly }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('categories');
  const [openSc, setOpenSc] = useState(null);

  const t = getT(lang);
  const activeLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const { bookmarks, isBookmarked, toggleBookmark, clearAll } = bookmarkHook;
  const { speaking, supported, speak, stopSpeaking } = speech;

  const cats = Object.values(LAW_DB).filter(c =>
    !query || c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.laws.some(l => l.section.toLowerCase().includes(query.toLowerCase()) || l.name.toLowerCase().includes(query.toLowerCase()))
  );
  const scs = SCENARIOS.filter(s =>
    !query || s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.tag.toLowerCase().includes(query.toLowerCase()) || s.situation.toLowerCase().includes(query.toLowerCase())
  );

  const fact = LAW_FACTS[new Date().getDate() % LAW_FACTS.length];

  const TABS = [
    ['categories', t.tab_cat], ['scenarios', t.tab_sc], ['whatif', t.tab_wi],
    ['rights', t.tab_rights], ['women', t.tab_women], ['disability', t.tab_dis],
    ['bookmarks', `⭐ Bookmarks${bookmarks.length > 0 ? ` (${bookmarks.length})` : ''}`],
    ['helplines', t.tab_help],
  ];

  return (
    <div style={{ minHeight:'100vh',background:'#07070F',color:'#F0EDE8',fontFamily:'Georgia,serif',position:'relative',overflowX:'hidden' }}>
      {[500,350,200].map((sz,i) => (
        <div key={i} className="orbit-ring" style={{ width:sz,height:sz,border:`1px solid rgba(255,107,0,${0.03+i*0.015})`,transform:'translate(-50%,-50%)',animation:`orbit ${20+i*8}s linear infinite` }} />
      ))}

      <NavBar loggedIn={loggedIn} user={user} onLogin={onLogin} onSignup={onSignup} lang={lang} theme={theme} fontSize={fontSize} setTheme={setTheme} setFontSize={setFontSize} onLangPick={onLangPick} onLogout={onLogout} onProfile={onProfile} onHome={onHome} onAdmin={onAdmin} />

      {/* Hero */}
      <div style={{ textAlign:'center',padding:'56px 24px 36px',position:'relative',zIndex:1 }}>
        <div className="animate-badge" style={{ display:'inline-block',padding:'4px 14px',borderRadius:18,background:'rgba(255,107,0,0.1)',border:'1px solid rgba(255,107,0,0.22)',color:'#FF9500',fontSize:11,marginBottom:18,letterSpacing:'0.9px' }}>
          🇮🇳 FOR EVERY INDIAN CITIZEN · {t.noLawyer}
        </div>
        <h1 className="hero-title" style={{ direction:activeLang.dir }}>{t.heroTitle}</h1>
        <p className="hero-subtitle" style={{ direction:activeLang.dir }}>{t.heroSub}</p>
        <div style={{ display:'flex',maxWidth:540,margin:'0 auto 20px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:11,overflow:'hidden' }}>
          <input className="input" style={{ flex:1,border:'none',borderRadius:0,background:'transparent' }}
            value={query} onChange={e => setQuery(e.target.value)} placeholder={t.searchPH} dir={activeLang.dir} />
          <button style={{ padding:'12px 18px',background:'linear-gradient(135deg,#FF6B00,#FF9500)',border:'none',color:'#fff',cursor:'pointer',fontSize:13 }}>🔍</button>
        </div>
        <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => onChat(null)}>{t.askBtn}</button>
          <button className="btn btn-secondary btn-lg" onClick={() => document.getElementById('main')?.scrollIntoView({ behavior:'smooth' })}>{t.browseLaws}</button>
        </div>

        {/* Quick Tools */}
        <div style={{ display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginTop:18 }}>
          {[
            ['📄','Analyze Document','Upload any legal doc for AI explanation', onAnalyzer],
            ['📝','Draft Generator','Generate FIR, RTI, Legal Notice', onDrafts],
            ['🎙️','Voice Mode','Speak-only mode — no typing needed', onVoiceOnly],
          ].map(([icon,title,desc,handler]) => (
            <button key={title} onClick={handler}
              style={{ padding:'10px 16px',borderRadius:12,background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',cursor:'pointer',textAlign:'left',fontFamily:'inherit',display:'flex',alignItems:'center',gap:10,color:'#F0EDE8',transition:'all 0.2s',maxWidth:220 }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,107,0,0.07)'; e.currentTarget.style.borderColor='rgba(255,107,0,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; }}>
              <span style={{ fontSize:22 }}>{icon}</span>
              <div>
                <div style={{ fontSize:12,fontWeight:700 }}>{title}</div>
                <div style={{ fontSize:10,color:'rgba(240,237,232,0.35)' }}>{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'flex',justifyContent:'center',gap:40,padding:'20px 24px',borderTop:'1px solid rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.05)',marginBottom:44,flexWrap:'wrap',position:'relative',zIndex:1 }}>
        {[['180+','Laws & Sections'],['20','Categories'],['9','What If Guides'],['10','Women Safety'],['10','Disability Rights']].map(([n,l]) => (
          <div key={n} style={{ textAlign:'center' }}>
            <div style={{ fontSize:24,fontWeight:700,background:'linear-gradient(90deg,#FF6B00,#FFD700)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{n}</div>
            <div style={{ fontSize:11,color:'rgba(240,237,232,0.32)',marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Daily Fact */}
      <div style={{ margin:'0 28px 32px',padding:'16px 20px',background:'linear-gradient(135deg,rgba(255,107,0,0.09),rgba(46,64,87,0.12))',border:'1px solid rgba(255,107,0,0.2)',borderRadius:14,display:'flex',alignItems:'flex-start',gap:14,position:'relative',zIndex:1,animation:'fadeUp 0.4s ease' }}>
        <div style={{ fontSize:28,flexShrink:0 }}>{fact.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10,color:'#FF9500',fontWeight:700,letterSpacing:'0.8px',marginBottom:5 }}>{t.dailyFact}</div>
          <div style={{ fontSize:13,color:'rgba(240,237,232,0.85)',lineHeight:1.65,marginBottom:6 }}>{fact.fact}</div>
          <span className="tag" style={{ background:'rgba(255,107,0,0.1)',color:'#FF9500',border:'1px solid rgba(255,107,0,0.2)' }}>{fact.law}</span>
        </div>
        {supported.tts && (
          <button onClick={() => speaking ? stopSpeaking() : speak(`${t.dailyFact}. ${fact.fact}. Law: ${fact.law}`)}
            style={{ width:36,height:36,borderRadius:8,border:`1px solid ${speaking?'rgba(76,175,80,0.5)':'rgba(255,107,0,0.25)'}`,background:speaking?'rgba(76,175,80,0.12)':'rgba(255,107,0,0.08)',color:speaking?'#4CAF50':'#FF9500',cursor:'pointer',fontSize:17,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            {speaking ? '⏹' : '🔊'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div id="main" style={{ position:'relative',zIndex:1,padding:'0 28px',marginBottom:28 }}>
        <div className="tabs">
          {TABS.map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)} className={`tab-btn ${tab===key?'active':''}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      {tab==='categories' && (
        <>
          <div className="section-title">Browse by Legal Category</div>
          <div className="section-subtitle">{query ? `Results for "${query}" — ${cats.length} categories` : 'Click any category to explore all laws, sections & your rights'}</div>
          <div className="grid-container grid-cards">
            {cats.map((cat,idx) => (
              <div key={cat.id} className="card" style={{ borderColor:`${cat.color}20`,animationDelay:`${idx*0.04}s`,cursor:'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background=`${cat.color}0D`; e.currentTarget.style.borderColor=`${cat.color}45`; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor=`${cat.color}20`; }}
                onClick={() => onCategory(cat.id)}>
                <div style={{ fontSize:26,marginBottom:9 }}>{cat.icon}</div>
                <div style={{ fontSize:14,fontWeight:700,marginBottom:4,color:cat.color }}>{cat.title}</div>
                <div style={{ fontSize:11,color:'rgba(240,237,232,0.37)',marginBottom:9,lineHeight:1.55 }}>{cat.desc}</div>
                <div>
                  {cat.laws.slice(0,4).map((l,i) => <span key={i} className="tag" style={{ background:`${cat.color}10`,color:`${cat.color}BB`,border:`1px solid ${cat.color}22` }}>{l.section}</span>)}
                  {cat.laws.length>4 && <span className="tag" style={{ background:`${cat.color}10`,color:`${cat.color}BB`,border:`1px solid ${cat.color}22` }}>+{cat.laws.length-4}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── SCENARIOS ── */}
      {tab==='scenarios' && (
        <>
          <div className="section-title">Common Legal Scenarios</div>
          <div className="section-subtitle">{query ? `Results for "${query}"` : 'Real situations → exact laws → step-by-step action plan'}</div>
          <div className="grid-container grid-wide">
            {scs.map((sc,idx) => {
              const open = openSc===sc.id;
              return (
                <div key={sc.id} className="card" style={{ padding:0,overflow:'hidden',borderColor:open?sc.color+'45':sc.color+'20',background:open?`${sc.color}0A`:'rgba(255,255,255,0.02)' }}>
                  <div style={{ padding:'15px 17px 12px',display:'flex',alignItems:'flex-start',gap:11,cursor:'pointer' }} onClick={() => setOpenSc(open?null:sc.id)}>
                    <div style={{ width:40,height:40,borderRadius:10,background:`${sc.color}16`,border:`1px solid ${sc.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{sc.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:3 }}>
                        <span style={{ fontSize:14,fontWeight:700 }}>{sc.title}</span>
                        <span className="tag tag-pill" style={{ background:`${sc.color}14`,color:sc.color,border:`1px solid ${sc.color}28` }}>{sc.tag}</span>
                      </div>
                      <div style={{ fontSize:11,color:'rgba(240,237,232,0.42)',lineHeight:1.5 }}>{sc.situation}</div>
                    </div>
                    <div style={{ color:'rgba(240,237,232,0.3)',fontSize:13,marginTop:4,display:'flex',alignItems:'center',gap:8 }}>
                      <button onClick={e => { e.stopPropagation(); toggleBookmark({ id:`sc_${sc.id}`,type:'scenario',title:sc.title,tag:sc.tag,situation:sc.situation,color:sc.color,icon:sc.icon,helpline:sc.helpline,laws:sc.laws }); }}
                        style={{ background:'none',border:'none',cursor:'pointer',fontSize:17,padding:0,opacity:isBookmarked(`sc_${sc.id}`)?1:0.3,color:isBookmarked(`sc_${sc.id}`)?'#FFD700':'#F0EDE8' }}>
                        {isBookmarked(`sc_${sc.id}`) ? '⭐' : '☆'}
                      </button>
                      {open ? '▲' : '▼'}
                    </div>
                  </div>
                  {open && (
                    <div style={{ padding:'0 17px 16px',animation:'fadeIn 0.2s ease' }}>
                      <div style={{ height:1,background:'rgba(255,255,255,0.06)',marginBottom:14 }} />
                      <div style={{ fontSize:11,fontWeight:700,color:sc.color,marginBottom:8 }}>⚖️ APPLICABLE LAWS</div>
                      {sc.laws.map((l,i) => <div key={i} style={{ fontSize:11,padding:'5px 10px',background:`${sc.color}0C`,border:`1px solid ${sc.color}22`,borderRadius:6,marginBottom:5,color:'rgba(240,237,232,0.72)' }}>{l}</div>)}
                      <div style={{ fontSize:11,fontWeight:700,color:'#4CAF50',margin:'13px 0 8px' }}>✅ WHAT YOU SHOULD DO</div>
                      {sc.steps.map((step,i) => (
                        <div key={i} style={{ display:'flex',gap:9,marginBottom:7,alignItems:'flex-start' }}>
                          <div style={{ width:20,height:20,borderRadius:'50%',background:`${sc.color}16`,color:sc.color,fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{i+1}</div>
                          <div style={{ fontSize:12,color:'rgba(240,237,232,0.68)',lineHeight:1.55 }}>{step}</div>
                        </div>
                      ))}
                      <div style={{ marginTop:12,padding:'8px 12px',background:'rgba(192,57,43,0.07)',border:'1px solid rgba(192,57,43,0.16)',borderRadius:8,fontSize:12,color:'rgba(240,237,232,0.58)',lineHeight:1.5 }}>🔨 <strong style={{ color:'#E74C3C' }}>Punishment:</strong> {sc.punishment}</div>
                      <div style={{ marginTop:7,padding:'8px 12px',background:'rgba(19,136,8,0.06)',border:'1px solid rgba(19,136,8,0.15)',borderRadius:8,fontSize:12,color:'rgba(240,237,232,0.58)' }}>📞 <strong style={{ color:'#4CAF50' }}>Helplines:</strong> {sc.helpline}</div>
                      <button className="btn btn-primary" style={{ width:'100%',marginTop:13,padding:10,borderRadius:8,fontSize:13 }}
                        onClick={() => onChat(`I need help with: ${sc.title}. ${sc.situation} Please give me detailed advice.`)}>
                        Get Personalised AI Legal Advice →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── HELPLINES ── */}
      {tab==='helplines' && (
        <>
          <div className="section-title">📞 Emergency Legal Helplines</div>
          <div className="section-subtitle">Most are free, 24×7, and available across all of India</div>
          <div style={{ margin:'0 28px 22px',padding:'14px 20px',background:'rgba(192,57,43,0.1)',border:'1px solid rgba(192,57,43,0.25)',borderRadius:12,display:'flex',alignItems:'center',gap:14,position:'relative',zIndex:1,animation:'glow 3s infinite' }}>
            <div style={{ fontSize:32 }}>🚨</div>
            <div>
              <div style={{ fontWeight:700,fontSize:16,color:'#E74C3C',marginBottom:2 }}>Life-Threatening Emergency?</div>
              <div style={{ fontSize:13,color:'rgba(240,237,232,0.58)' }}>Call <strong style={{ color:'#fff',fontSize:20 }}>112</strong> — India's universal emergency number. Works 24×7.</div>
            </div>
          </div>
          <div className="grid-container grid-helpline">
            {HELPLINES.map((h,i) => (
              <div key={i} className="card" style={{ borderColor:`${h.color}20` }}
                onMouseEnter={e => { e.currentTarget.style.background=`${h.color}0C`; e.currentTarget.style.borderColor=`${h.color}40`; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor=`${h.color}20`; }}>
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:7 }}>
                  <span style={{ fontSize:20 }}>{h.icon}</span>
                  <span style={{ fontSize:12,fontWeight:700,color:'rgba(240,237,232,0.82)' }}>{h.name}</span>
                </div>
                <div style={{ fontSize:20,fontWeight:700,color:h.color,fontFamily:'monospace',marginBottom:3 }}>{h.number}</div>
                <div style={{ fontSize:11,color:'rgba(240,237,232,0.36)',lineHeight:1.5 }}>{h.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WHAT IF ── */}
      {tab==='whatif' && (
        <>
          <div className="section-title">🚨 What If Situations</div>
          <div className="section-subtitle">Real emergencies — exact laws + what to do RIGHT NOW</div>
          <div className="grid-container" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:14 }}>
            {WHAT_IF.map((wi,idx) => {
              const open = openSc===wi.id;
              return (
                <div key={wi.id} className="card" style={{ padding:0,overflow:'hidden',borderColor:open?wi.color+'50':wi.color+'22',background:open?`${wi.color}0C`:'rgba(255,255,255,0.02)' }}>
                  <div style={{ padding:'15px 17px 13px',display:'flex',alignItems:'flex-start',gap:12,cursor:'pointer' }} onClick={() => setOpenSc(open?null:wi.id)}>
                    <div style={{ width:44,height:44,borderRadius:11,background:`${wi.color}18`,border:`1px solid ${wi.color}35`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0 }}>{wi.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:3,flexWrap:'wrap' }}>
                        <span style={{ fontSize:14,fontWeight:700 }}>{wi.title}</span>
                        <span className="tag tag-pill" style={{ background:`${wi.color}15`,color:wi.color,border:`1px solid ${wi.color}30` }}>{wi.tag}</span>
                      </div>
                      <div style={{ fontSize:11,color:'rgba(240,237,232,0.42)',lineHeight:1.5 }}>{wi.situation}</div>
                    </div>
                    <div style={{ color:'rgba(240,237,232,0.3)',fontSize:13,marginTop:4 }}>{open?'▲':'▼'}</div>
                  </div>
                  {open && (
                    <div style={{ padding:'0 17px 16px',animation:'fadeIn 0.2s ease' }}>
                      <div style={{ height:1,background:'rgba(255,255,255,0.06)',marginBottom:14 }} />
                      <div style={{ fontSize:11,fontWeight:700,color:'#E74C3C',marginBottom:9 }}>🚨 DO THIS RIGHT NOW</div>
                      {wi.doNow.map((step,i) => (
                        <div key={i} style={{ display:'flex',gap:9,marginBottom:8,alignItems:'flex-start' }}>
                          <div style={{ width:22,height:22,borderRadius:'50%',background:`${wi.color}18`,color:wi.color,fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{i+1}</div>
                          <div style={{ fontSize:12,color:'rgba(240,237,232,0.72)',lineHeight:1.55 }}>{step}</div>
                        </div>
                      ))}
                      <div style={{ fontSize:11,fontWeight:700,color:wi.color,margin:'14px 0 9px' }}>⚖️ APPLICABLE LAWS</div>
                      {wi.laws.map((l,i) => (
                        <div key={i} style={{ marginBottom:6,padding:'7px 10px',background:`${wi.color}0A`,border:`1px solid ${wi.color}22`,borderRadius:7 }}>
                          <span style={{ fontSize:10,fontWeight:700,color:wi.color }}>{l.s}</span>
                          <span style={{ fontSize:11,color:'rgba(240,237,232,0.65)',marginLeft:7 }}>{l.d}</span>
                        </div>
                      ))}
                      <div style={{ marginTop:12,padding:'9px 12px',background:'rgba(192,57,43,0.07)',border:'1px solid rgba(192,57,43,0.18)',borderRadius:8,fontSize:12,color:'rgba(240,237,232,0.6)',lineHeight:1.5 }}>🔨 <strong style={{ color:'#E74C3C' }}>Punishment:</strong> {wi.punishment}</div>
                      <div style={{ marginTop:7,padding:'9px 12px',background:'rgba(255,149,0,0.07)',border:'1px solid rgba(255,149,0,0.2)',borderRadius:8,fontSize:12,color:'rgba(240,237,232,0.6)',lineHeight:1.5 }}>{wi.warn}</div>
                      <div style={{ marginTop:7,padding:'8px 12px',background:'rgba(19,136,8,0.06)',border:'1px solid rgba(19,136,8,0.15)',borderRadius:8,fontSize:12,color:'rgba(240,237,232,0.6)' }}>📞 <strong style={{ color:'#4CAF50' }}>Call:</strong> {wi.helpline}</div>
                      <button className="btn btn-primary" style={{ width:'100%',marginTop:13,padding:10,borderRadius:8,fontSize:13 }}
                        onClick={() => onChat(`I need urgent help: ${wi.title}. ${wi.situation} What are my exact rights and what should I do?`)}>
                        Get Detailed AI Legal Advice →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── RIGHTS ── */}
      {tab==='rights' && (
        <>
          <div className="section-title">⚖️ Know Your Rights</div>
          <div className="section-subtitle">12 fundamental rights every Indian should know</div>
          <div className="grid-container grid-rights">
            {RIGHTS.map((r,idx) => (
              <div key={idx} className="card" style={{ borderColor:`${r.color}22`,cursor:'default' }}
                onMouseEnter={e => { e.currentTarget.style.background=`${r.color}0D`; e.currentTarget.style.borderColor=`${r.color}45`; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor=`${r.color}22`; }}>
                <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}>
                  <div style={{ width:38,height:38,borderRadius:9,background:`${r.color}16`,border:`1px solid ${r.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0 }}>{r.icon}</div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,lineHeight:1.3 }}>{r.title}</div>
                    <span className="tag" style={{ background:`${r.color}12`,color:r.color,border:`1px solid ${r.color}28` }}>{r.article}</span>
                  </div>
                </div>
                <div style={{ fontSize:12,color:'rgba(240,237,232,0.5)',lineHeight:1.65,marginBottom:10 }}>{r.desc}</div>
                <div style={{ fontSize:11,padding:'8px 11px',background:'rgba(76,175,80,0.07)',border:'1px solid rgba(76,175,80,0.17)',borderRadius:7,color:'rgba(240,237,232,0.65)',lineHeight:1.55 }}>✅ {r.action}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WOMEN SAFETY ── */}
      {tab==='women' && (
        <>
          <div className="section-title">👩 Women's Safety — Apps & Helplines</div>
          <div className="section-subtitle">Save these before you need them</div>
          <div style={{ margin:'0 28px 24px',display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center',position:'relative',zIndex:1 }}>
            {[['👩 Mahila Helpline','181','#9B1D20'],['🆘 Emergency','112','#8B0000'],['👶 Child Helpline','1098','#FF9500'],['💻 Cyber Crime','1930','#1A5276'],['⚖️ NCW WhatsApp','7217735372','#1A6B3A']].map(([n,num,c]) => (
              <div key={num} style={{ padding:'8px 16px',borderRadius:20,background:`${c}15`,border:`1px solid ${c}40`,display:'flex',alignItems:'center',gap:7 }}>
                <span style={{ fontSize:13 }}>{n.split(' ')[0]}</span>
                <div>
                  <div style={{ fontSize:11,color:'rgba(240,237,232,0.5)' }}>{n.split(' ').slice(1).join(' ')}</div>
                  <div style={{ fontSize:16,fontWeight:700,color:c,fontFamily:'monospace' }}>{num}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid-container grid-wide">
            {WOMEN_APPS.map((app,idx) => (
              <div key={idx} className="card" style={{ borderColor:`${app.color}22` }}
                onMouseEnter={e => { e.currentTarget.style.background=`${app.color}0C`; e.currentTarget.style.borderColor=`${app.color}44`; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor=`${app.color}22`; }}>
                <div style={{ display:'flex',alignItems:'flex-start',gap:11,marginBottom:11 }}>
                  <div style={{ width:42,height:42,borderRadius:10,background:`${app.color}18`,border:`1px solid ${app.color}35`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0 }}>{app.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14,fontWeight:700,marginBottom:2 }}>{app.name}</div>
                    <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                      <span className="tag" style={{ background:`${app.color}15`,color:app.color,border:`1px solid ${app.color}30` }}>{app.type}</span>
                      <span className="tag" style={{ background:'rgba(255,255,255,0.05)',color:'rgba(240,237,232,0.45)',border:'1px solid rgba(255,255,255,0.08)' }}>by {app.by}</span>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize:12,color:'rgba(240,237,232,0.55)',lineHeight:1.65,marginBottom:10 }}>{app.desc}</div>
                <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:8,padding:'7px 10px',background:`${app.color}0A`,borderRadius:7,border:`1px solid ${app.color}20` }}>
                  <span style={{ fontSize:11 }}>📞</span>
                  <span style={{ fontSize:13,fontWeight:700,color:app.color,fontFamily:'monospace' }}>{app.number}</span>
                </div>
                <div style={{ fontSize:11,padding:'8px 11px',background:'rgba(76,175,80,0.07)',border:'1px solid rgba(76,175,80,0.17)',borderRadius:7,color:'rgba(240,237,232,0.65)',lineHeight:1.55 }}>✅ {app.howto}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── DISABILITY ── */}
      {tab==='disability' && (
        <>
          <div className="section-title">♿ Rights of Persons with Disabilities</div>
          <div className="section-subtitle">Rights & protections under RPwD Act 2016</div>
          <div style={{ margin:'0 28px 24px',padding:'13px 18px',background:'rgba(26,143,191,0.08)',border:'1px solid rgba(26,143,191,0.25)',borderRadius:12,display:'flex',alignItems:'center',gap:14,flexWrap:'wrap',position:'relative',zIndex:1 }}>
            <div style={{ fontSize:28 }}>♿</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:700,color:'#1A8FBF',marginBottom:4 }}>Chief Commissioner for Persons with Disabilities</div>
              <div style={{ fontSize:13,color:'rgba(240,237,232,0.65)' }}>Free helpline: <strong style={{ color:'#fff' }}>1800-11-4515</strong> · UDID Card: swavlambancard.gov.in</div>
            </div>
          </div>
          <div className="grid-container" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))' }}>
            {DISABILITY_LAWS.map((d,idx) => (
              <div key={idx} className="card" style={{ borderColor:`${d.color}22` }}
                onMouseEnter={e => { e.currentTarget.style.background=`${d.color}0D`; e.currentTarget.style.borderColor=`${d.color}45`; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor=`${d.color}22`; }}>
                <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}>
                  <div style={{ width:40,height:40,borderRadius:9,background:`${d.color}16`,border:`1px solid ${d.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{d.icon}</div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,lineHeight:1.3 }}>{d.title}</div>
                    <span className="tag" style={{ background:`${d.color}12`,color:d.color,border:`1px solid ${d.color}28` }}>{d.article}</span>
                  </div>
                </div>
                <div style={{ fontSize:12,color:'rgba(240,237,232,0.52)',lineHeight:1.65,marginBottom:10 }}>{d.desc}</div>
                <div style={{ fontSize:11,padding:'8px 11px',background:'rgba(76,175,80,0.07)',border:'1px solid rgba(76,175,80,0.17)',borderRadius:7,color:'rgba(240,237,232,0.65)',lineHeight:1.55 }}>✅ {d.action}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── BOOKMARKS ── */}
      {tab==='bookmarks' && (
        <>
          <div className="section-title">⭐ My Bookmarks</div>
          <div className="section-subtitle">{bookmarks.length > 0 ? `${bookmarks.length} saved item${bookmarks.length>1?'s':''}` : 'No bookmarks yet — tap ☆ on any law or scenario'}</div>
          {bookmarks.length === 0 ? (
            <div style={{ textAlign:'center',padding:'48px 28px',position:'relative',zIndex:1 }}>
              <div style={{ fontSize:56,marginBottom:16 }}>☆</div>
              <div style={{ fontSize:16,fontWeight:700,marginBottom:10 }}>No bookmarks yet</div>
              <div style={{ fontSize:13,color:'rgba(240,237,232,0.4)',marginBottom:24,maxWidth:380,margin:'0 auto 24px',lineHeight:1.7 }}>
                Browse <strong style={{ color:'#FF9500' }}>Categories</strong> or <strong style={{ color:'#FF9500' }}>Scenarios</strong> and tap the ☆ star to save.
              </div>
              <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
                <button className="btn btn-primary" onClick={() => setTab('categories')}>📚 Browse Categories</button>
                <button className="btn btn-secondary" onClick={() => setTab('scenarios')}>🎭 Browse Scenarios</button>
              </div>
            </div>
          ) : (
            <div style={{ padding:'0 28px 48px',maxWidth:1140,margin:'0 auto',position:'relative',zIndex:1 }}>
              <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:16 }}>
                <button onClick={clearAll} style={{ padding:'6px 14px',borderRadius:7,background:'rgba(231,76,60,0.08)',border:'1px solid rgba(231,76,60,0.22)',color:'rgba(231,76,60,0.7)',fontSize:11,cursor:'pointer' }}>🗑 Clear All</button>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))',gap:10 }}>
                {bookmarks.map((bm,i) => (
                  <div key={bm.id} className="card" style={{ borderColor:`${bm.color}22` }}>
                    <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:6 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:8,flex:1 }}>
                        <span style={{ fontSize:16 }}>{bm.icon || bm.catIcon}</span>
                        <div>
                          <div style={{ fontSize:12,fontWeight:700 }}>{bm.title}</div>
                          <span className="tag tag-pill" style={{ background:`${bm.color}14`,color:bm.color,border:`1px solid ${bm.color}28` }}>{bm.tag || bm.section}</span>
                        </div>
                      </div>
                      <button onClick={() => toggleBookmark(bm)} style={{ background:'none',border:'none',cursor:'pointer',fontSize:16,padding:0,color:'#FFD700' }}>⭐</button>
                    </div>
                    <div style={{ fontSize:11,color:'rgba(240,237,232,0.48)',lineHeight:1.55,marginBottom:8 }}>{bm.situation || bm.desc || ''}</div>
                    <button className="btn" style={{ width:'100%',padding:'7px 10px',borderRadius:7,background:`${bm.color}10`,border:`1px solid ${bm.color}28`,color:bm.color,fontSize:11,fontWeight:600 }}
                      onClick={() => onChat(`I need help: ${bm.title}. ${bm.situation || bm.desc || ''} Give detailed advice.`)}>
                      Ask AI →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* AI Tools Section */}
      <div style={{ margin:'0 28px 40px',position:'relative',zIndex:1 }}>
        <div className="section-title">🛠️ AI Legal Tools</div>
        <div className="section-subtitle">Powerful tools powered by AI — completely free</div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12,padding:'0',maxWidth:1140,margin:'0 auto' }}>
          {[
            { icon:'📄', title:'Document Analyzer', desc:'Upload any legal document — FIR, court notice, contract, rent agreement — and get a plain-language explanation with your rights and next steps.', color:'#1A8FBF', action:onAnalyzer, btn:'Analyze a Document →' },
            { icon:'📝', title:'Legal Draft Generator', desc:'Generate ready-to-use legal documents — FIR complaints, RTI applications, legal notices, consumer complaints — just fill in your details.', color:'#27AE60', action:onDrafts, btn:'Generate a Draft →' },
            { icon:'🎙️', title:'Voice-Only Mode', desc:'Designed for illiterate or visually impaired users. Just speak your legal problem — AI listens, understands, and reads the answer aloud. Zero typing.', color:'#E74C3C', action:onVoiceOnly, btn:'Enter Voice Mode →' },
          ].map((tool) => (
            <div key={tool.title} className="card" style={{ borderColor:`${tool.color}20`,cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background=`${tool.color}0C`; e.currentTarget.style.borderColor=`${tool.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor=`${tool.color}20`; }}
              onClick={tool.action}>
              <div style={{ fontSize:32,marginBottom:10 }}>{tool.icon}</div>
              <div style={{ fontSize:15,fontWeight:700,color:tool.color,marginBottom:6 }}>{tool.title}</div>
              <div style={{ fontSize:12,color:'rgba(240,237,232,0.45)',lineHeight:1.65,marginBottom:14 }}>{tool.desc}</div>
              <button className="btn" style={{ padding:'8px 14px',borderRadius:8,background:`${tool.color}12`,border:`1px solid ${tool.color}30`,color:tool.color,fontSize:12,fontWeight:600,width:'100%' }}>
                {tool.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Section */}
      <div style={{ margin:'0 28px 48px',position:'relative',zIndex:1 }}>
        <div style={{ borderRadius:18,padding:'36px 32px',background:'linear-gradient(135deg,rgba(255,107,0,0.08),rgba(255,149,0,0.03))',border:'1px solid rgba(255,107,0,0.14)',textAlign:'center' }}>
          <div style={{ fontSize:28,marginBottom:12 }}>⚖️</div>
          <div style={{ fontSize:22,fontWeight:700,marginBottom:10 }}>{t.impactTitle}</div>
          <div style={{ fontSize:13,color:'rgba(240,237,232,0.44)',maxWidth:480,margin:'0 auto 24px',lineHeight:1.8 }}>
            3 out of 4 Indians have no idea what laws protect them. KanoonSaathi puts the entire Indian legal system in your hands — free, instant, and in plain English.
          </div>
          <div style={{ display:'flex',gap:24,justifyContent:'center',flexWrap:'wrap',marginBottom:24 }}>
            {[['1.4B','Indians who deserve to know their rights'],['80%','Cases dismissed due to lack of awareness'],['₹0','Cost to use KanoonSaathi']].map(([n,l]) => (
              <div key={n} style={{ textAlign:'center' }}>
                <div style={{ fontSize:26,fontWeight:700,background:'linear-gradient(90deg,#FF6B00,#FFD700)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{n}</div>
                <div style={{ fontSize:11,color:'rgba(240,237,232,0.35)',maxWidth:140,lineHeight:1.4 }}>{l}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => onChat(null)}>Ask Free Legal Question ⚖️</button>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div>⚖️ <strong>KanoonSaathi</strong> — Empowering 1.4 Billion Indians with Free Legal Knowledge</div>
        <div>IPC · RERA · RTI · FSS Act · DGCA · PCA Act · Consumer Protection · IT Act · Labour Laws & Codes · Tax Laws · Medical Laws · FIR Rights · PMLA/ED · Education Laws · CBI · ARAI · Armed Forces · BSF · Railways · Disability Rights</div>
        <div style={{ marginTop:4,fontSize:10,color:'rgba(240,237,232,0.18)' }}>🌐 Available in 23 Languages · 22 Scheduled Languages + English · Constitution of India, 8th Schedule</div>
        <div style={{ marginTop:3,fontSize:10,color:'rgba(240,237,232,0.11)' }}>⚠️ For informational purposes only. For formal legal advice, consult a licensed advocate or DLSA.</div>
      </div>
    </div>
  );
}
