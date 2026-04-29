import { useState } from 'react';

export default function ProfilePage({ user, onSave, onBack }) {
  const [dob, setDob] = useState(user.dob || '');
  const [city, setCity] = useState(user.city || '');
  const [state, setState] = useState(user.state || '');
  const [gender, setGender] = useState(user.gender || '');
  const [occupation, setOccupation] = useState(user.occupation || '');
  const [language, setLanguage] = useState(user.language || 'English');
  const [saved, setSaved] = useState(false);

  const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh','Other'];

  const handle = () => {
    onSave({ ...user, dob, city, state, gender, occupation, language });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight:'100vh',background:'#07070F',color:'#F0EDE8',fontFamily:'Georgia,serif' }}>
      <nav className="navbar">
        <div className="navbar-logo" onClick={onBack}>
          <div className="navbar-logo-icon">⚖️</div>
          <span className="navbar-logo-text">KanoonSaathi</span>
        </div>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
      </nav>

      <div style={{ maxWidth:560,margin:'0 auto',padding:'28px 20px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:16,marginBottom:28,animation:'fadeUp 0.3s ease' }}>
          <div style={{ width:70,height:70,borderRadius:'50%',background:'linear-gradient(135deg,#FF6B00,#FF9500)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:700,color:'#fff',flexShrink:0 }}>{initials}</div>
          <div>
            <div style={{ fontSize:20,fontWeight:700 }}>{user.name}</div>
            <div style={{ fontSize:12,color:'rgba(240,237,232,0.4)',marginTop:2 }}>{user.email}</div>
            <div style={{ fontSize:11,color:'#FF9500',marginTop:3 }}>📱 {user.phone || 'Phone not set'}</div>
          </div>
        </div>

        {saved && <div style={{ marginBottom:16,padding:'10px 14px',background:'rgba(76,175,80,0.1)',border:'1px solid rgba(76,175,80,0.25)',borderRadius:9,fontSize:13,color:'#4CAF50',animation:'fadeIn 0.3s ease' }}>✅ Profile saved successfully!</div>}

        <div style={{ marginBottom:22,padding:'14px 16px',background:'rgba(255,107,0,0.05)',border:'1px solid rgba(255,107,0,0.12)',borderRadius:10 }}>
          <div style={{ fontSize:12,fontWeight:700,color:'#FF9500',marginBottom:10 }}>🔐 ACCOUNT INFORMATION</div>
          {[['Full Name',user.name],['Email',user.email],['Mobile',user.phone||'Not set']].map(([l,v]) => (
            <div key={l} style={{ display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:12 }}>
              <span style={{ color:'rgba(240,237,232,0.45)' }}>{l}</span>
              <span style={{ color:'rgba(240,237,232,0.8)',fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:22,padding:'14px 16px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10 }}>
          <div style={{ fontSize:12,fontWeight:700,color:'rgba(240,237,232,0.6)',marginBottom:14 }}>👤 PERSONAL DETAILS</div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            <div>
              <label style={{ fontSize:12,color:'rgba(240,237,232,0.45)',display:'block',marginBottom:5 }}>Date of Birth</label>
              <input className="input" type="date" value={dob} onChange={e => setDob(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:12,color:'rgba(240,237,232,0.45)',display:'block',marginBottom:5 }}>Gender</label>
              <select className="input" style={{ cursor:'pointer' }} value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Prefer not to say</option>
                {['Male','Female','Non-binary','Other'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop:14 }}>
            <label style={{ fontSize:12,color:'rgba(240,237,232,0.45)',display:'block',marginBottom:5 }}>City</label>
            <input className="input" type="text" placeholder="Your city" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div style={{ marginTop:14 }}>
            <label style={{ fontSize:12,color:'rgba(240,237,232,0.45)',display:'block',marginBottom:5 }}>State</label>
            <select className="input" style={{ cursor:'pointer' }} value={state} onChange={e => setState(e.target.value)}>
              <option value="">Select your state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginTop:14 }}>
            <label style={{ fontSize:12,color:'rgba(240,237,232,0.45)',display:'block',marginBottom:5 }}>Occupation</label>
            <select className="input" style={{ cursor:'pointer' }} value={occupation} onChange={e => setOccupation(e.target.value)}>
              <option value="">Select occupation (optional)</option>
              {['Student','Private Employee','Government Employee','Self-Employed','Farmer','Daily Wage Worker','Lawyer','Doctor','Homemaker','Retired','Other'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom:20,padding:'10px 14px',background:'rgba(19,136,8,0.06)',border:'1px solid rgba(19,136,8,0.14)',borderRadius:9,fontSize:11,color:'rgba(240,237,232,0.4)',lineHeight:1.6 }}>
          🔒 Your personal details are stored locally. Protected under DPDP Act 2023.
        </div>

        <button onClick={handle} className="btn btn-primary btn-lg" style={{ width:'100%' }}>💾 Save Profile</button>
      </div>
    </div>
  );
}
