import { useState, useEffect } from 'react';

export default function Splash({ onDone }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const steps = [10,25,40,55,70,82,91,97,100];
    let i = 0;
    const iv = setInterval(() => {
      if (i < steps.length) { setPct(steps[i]); i++; }
      else { clearInterval(iv); setTimeout(onDone, 350); }
    }, 180);
    return () => clearInterval(iv);
  }, [onDone]);

  return (
    <div style={{ position:'fixed',inset:0,background:'#07070F',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:9999 }}>
      {[320,200,100].map((sz,i) => (
        <div key={i} className="orbit-ring" style={{ width:sz,height:sz,border:`1px solid rgba(255,107,0,${0.06+i*0.04})`,animation:`orbit ${18+i*6}s linear infinite` }} />
      ))}
      <div style={{ fontSize:56,marginBottom:20,animation:'glow 2s infinite' }}>⚖️</div>
      <div style={{ fontSize:28,fontWeight:700,fontFamily:'Georgia,serif',background:'linear-gradient(90deg,#FF6B00,#FFD700)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:6 }}>KanoonSaathi</div>
      <div style={{ fontSize:13,color:'rgba(240,237,232,0.4)',fontFamily:'Georgia,serif',marginBottom:36,letterSpacing:'1px' }}>India's Legal Companion</div>
      <div style={{ width:220,height:3,background:'rgba(255,255,255,0.07)',borderRadius:3,overflow:'hidden' }}>
        <div style={{ height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#FF6B00,#FFD700)',borderRadius:3,transition:'width 0.18s ease' }} />
      </div>
      <div style={{ fontSize:11,color:'rgba(240,237,232,0.3)',fontFamily:'Georgia,serif',marginTop:10 }}>Loading {pct}%</div>
    </div>
  );
}
