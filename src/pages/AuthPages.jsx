import { useState } from 'react';

export function LoginPage({ auth, onLogin, onGoSignup, onGuest, onForgot }) {
  const [form, setForm] = useState({ email:'', password:'' });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    setErr('');
    if (!form.email.trim()) return setErr('Please enter your email address.');
    if (!form.email.includes('@')) return setErr('Enter a valid email address.');
    if (!form.password) return setErr('Please enter your password.');
    if (form.password.length < 6) return setErr('Password must be at least 6 characters.');
    setBusy(true);
    try {
      const user = await auth.login(form.email, form.password);
      setBusy(false);
      onLogin(user);
    } catch (e) {
      setBusy(false);
      setErr(e.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight:'100vh',background:'#07070F',color:'#F0EDE8',fontFamily:'Georgia,serif',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,position:'relative',overflow:'hidden' }}>
      {[380,250,140].map((sz,i) => (
        <div key={i} className="orbit-ring" style={{ width:sz,height:sz,border:`1px solid rgba(255,107,0,${0.04+i*0.02})`,animation:`orbit ${20+i*7}s linear infinite` }} />
      ))}
      <div style={{ display:'flex',alignItems:'center',gap:9,marginBottom:36,cursor:'pointer',animation:'fadeUp 0.4s ease' }} onClick={onGuest}>
        <div style={{ width:36,height:36,background:'linear-gradient(135deg,#FF6B00,#FF9500)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,animation:'glow 3s infinite' }}>⚖️</div>
        <span style={{ fontSize:20,fontWeight:700,background:'linear-gradient(90deg,#FF6B00,#FFD700)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>KanoonSaathi</span>
      </div>

      <div style={{ width:'100%',maxWidth:400,background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,107,0,0.18)',borderRadius:20,padding:'36px 32px',animation:'fadeUp 0.45s ease' }}>
        <div style={{ fontSize:24,fontWeight:700,marginBottom:4 }}>Welcome back 👋</div>
        <div style={{ fontSize:13,color:'rgba(240,237,232,0.4)',marginBottom:28 }}>Log in to your KanoonSaathi account</div>

        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12,color:'rgba(240,237,232,0.5)',display:'block',marginBottom:6 }}>Email Address</label>
          <input value={form.email} onChange={e => setForm(f => ({...f,email:e.target.value}))} onKeyDown={e => e.key === 'Enter' && handle()}
            className="input" type="email" placeholder="you@example.com" />
        </div>

        <div style={{ marginBottom:8 }}>
          <label style={{ fontSize:12,color:'rgba(240,237,232,0.5)',display:'block',marginBottom:6 }}>Password</label>
          <div style={{ position:'relative' }}>
            <input value={form.password} onChange={e => setForm(f => ({...f,password:e.target.value}))} onKeyDown={e => e.key === 'Enter' && handle()}
              className="input" style={{ paddingRight:44 }} type={show ? 'text' : 'password'} placeholder="Enter your password" />
            <button onClick={() => setShow(s => !s)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(240,237,232,0.4)',cursor:'pointer',fontSize:15,padding:0 }}>{show ? '🙈' : '👁️'}</button>
          </div>
        </div>

        <div style={{ textAlign:'right',marginBottom:20 }}>
          <span onClick={onForgot} style={{ fontSize:11,color:'rgba(255,149,0,0.6)',cursor:'pointer' }}>Forgot password? →</span>
        </div>

        {err && <div style={{ marginBottom:14,padding:'9px 12px',background:'rgba(231,76,60,0.08)',border:'1px solid rgba(231,76,60,0.25)',borderRadius:8,fontSize:12,color:'#E74C3C' }}>⚠️ {err}</div>}

        <button onClick={handle} disabled={busy} className="btn btn-primary btn-lg" style={{ width:'100%',marginBottom:16 }}>
          {busy ? 'Logging in…' : 'Login →'}
        </button>

        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:16 }}>
          <div style={{ flex:1,height:1,background:'rgba(255,255,255,0.07)' }} />
          <span style={{ fontSize:11,color:'rgba(240,237,232,0.25)' }}>OR</span>
          <div style={{ flex:1,height:1,background:'rgba(255,255,255,0.07)' }} />
        </div>

        <button onClick={onGuest} className="btn btn-secondary" style={{ width:'100%',padding:11,borderRadius:10,fontSize:13,marginBottom:20 }}>
          Continue as Guest (Limited Access)
        </button>

        <div style={{ textAlign:'center',fontSize:13,color:'rgba(240,237,232,0.4)' }}>
          Don't have an account?{' '}
          <span onClick={onGoSignup} style={{ color:'#FF9500',cursor:'pointer',fontWeight:600 }}>Sign up free →</span>
        </div>
      </div>

      <div style={{ marginTop:20,fontSize:11,color:'rgba(240,237,232,0.2)',textAlign:'center',lineHeight:1.7 }}>
        🔒 JWT secured · bcrypt passwords · IT Act 2000 compliant · Zero data selling
      </div>
    </div>
  );
}

export function SignupPage({ auth, onSignup, onGoLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!name.trim()) return 'Please enter your full name.';
    if (!email.includes('@')) return 'Enter a valid email address.';
    if (!/^\d{10}$/.test(phone)) return 'Enter a valid 10-digit mobile number.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    return '';
  };

  const handle = async () => {
    setErr('');
    const e = validate();
    if (e) return setErr(e);
    setBusy(true);
    try {
      const user = await auth.signup({ name: name.trim(), email, phone, password });
      setBusy(false);
      setSuccess(true);
      setTimeout(() => onSignup(user), 1800);
    } catch (e) {
      setBusy(false);
      setErr(e.message || 'Signup failed. Please try again.');
    }
  };

  const pwStrength = password.length >= 10 ? 'Strong' : password.length >= 6 ? 'Medium' : 'Weak';
  const pwColor = password.length >= 10 ? '#4CAF50' : password.length >= 6 ? '#FF9500' : '#E74C3C';

  return (
    <div style={{ minHeight:'100vh',background:'#07070F',color:'#F0EDE8',fontFamily:'Georgia,serif',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,position:'relative',overflow:'hidden' }}>
      {[380,250,140].map((sz,i) => (
        <div key={i} className="orbit-ring" style={{ width:sz,height:sz,border:`1px solid rgba(255,107,0,${0.04+i*0.02})`,animation:`orbit ${20+i*7}s linear infinite` }} />
      ))}

      <div style={{ display:'flex',alignItems:'center',gap:9,marginBottom:28,animation:'fadeUp 0.4s ease' }}>
        <div style={{ width:36,height:36,background:'linear-gradient(135deg,#FF6B00,#FF9500)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,animation:'glow 3s infinite' }}>⚖️</div>
        <span style={{ fontSize:20,fontWeight:700,background:'linear-gradient(90deg,#FF6B00,#FFD700)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>KanoonSaathi</span>
      </div>

      <div style={{ width:'100%',maxWidth:420,background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,107,0,0.18)',borderRadius:20,padding:'32px 28px',animation:'fadeUp 0.45s ease' }}>
        {success ? (
          <div style={{ textAlign:'center',padding:'20px 0',animation:'fadeUp 0.4s ease' }}>
            <div style={{ fontSize:52,marginBottom:16,animation:'glow 2s infinite',display:'inline-block' }}>✅</div>
            <div style={{ fontSize:20,fontWeight:700,marginBottom:8 }}>Account Created!</div>
            <div style={{ fontSize:13,color:'rgba(240,237,232,0.45)',lineHeight:1.7 }}>
              Welcome, <strong style={{ color:'#FF9500' }}>{name}</strong>! Logging you in…
            </div>
            <div style={{ marginTop:20,display:'flex',justifyContent:'center',gap:6 }}>
              {[0,1,2].map(i => <div key={i} style={{ width:8,height:8,borderRadius:'50%',background:'#FF6B00',animation:`pulse 1.2s ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize:24,fontWeight:700,marginBottom:4 }}>Create Account 🚀</div>
            <div style={{ fontSize:13,color:'rgba(240,237,232,0.4)',marginBottom:22 }}>Free access to India's legal knowledge base</div>

            {[
              ['Full Name','text',name,setName,'Your full name'],
              ['Email Address','email',email,setEmail,'you@example.com'],
            ].map(([label,type,val,setter,ph]) => (
              <div key={label} style={{ marginBottom:15 }}>
                <label style={{ fontSize:12,color:'rgba(240,237,232,0.5)',display:'block',marginBottom:6 }}>{label}</label>
                <input className="input" type={type} placeholder={ph} value={val} onChange={e => setter(e.target.value)} />
              </div>
            ))}

            <div style={{ marginBottom:15 }}>
              <label style={{ fontSize:12,color:'rgba(240,237,232,0.5)',display:'block',marginBottom:6 }}>Mobile Number</label>
              <input className="input" type="tel" placeholder="10-digit mobile number" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0,10))} />
            </div>

            <div style={{ marginBottom:15 }}>
              <label style={{ fontSize:12,color:'rgba(240,237,232,0.5)',display:'block',marginBottom:6 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input className="input" style={{ paddingRight:44 }} type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(240,237,232,0.4)',cursor:'pointer',fontSize:15,padding:0 }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {password.length > 0 && (
              <div style={{ marginTop:-8,marginBottom:14 }}>
                <div style={{ fontSize:11,color:'rgba(240,237,232,0.35)',marginBottom:4 }}>Strength: <span style={{ color:pwColor,fontWeight:600 }}>{pwStrength}</span></div>
                <div style={{ height:3,background:'rgba(255,255,255,0.07)',borderRadius:3,overflow:'hidden' }}>
                  <div style={{ height:'100%',width:`${Math.min(100, (password.length / 12) * 100)}%`,background:pwColor,borderRadius:3,transition:'width 0.3s ease' }} />
                </div>
              </div>
            )}

            <div style={{ marginBottom:15 }}>
              <label style={{ fontSize:12,color:'rgba(240,237,232,0.5)',display:'block',marginBottom:6 }}>Confirm Password</label>
              <div style={{ position:'relative' }}>
                <input className="input" style={{ paddingRight:44 }} type={showConf ? 'text' : 'password'} placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)} />
                <button type="button" onClick={() => setShowConf(s => !s)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(240,237,232,0.4)',cursor:'pointer',fontSize:15,padding:0 }}>{showConf ? '🙈' : '👁️'}</button>
              </div>
              {confirm.length > 0 && <div style={{ fontSize:11,marginTop:5,color: password === confirm ? '#4CAF50' : '#E74C3C' }}>{password === confirm ? '✅ Passwords match' : '❌ Passwords do not match'}</div>}
            </div>

            <div style={{ marginBottom:14,padding:'9px 12px',background:'rgba(255,107,0,0.05)',border:'1px solid rgba(255,107,0,0.12)',borderRadius:8,fontSize:11,color:'rgba(240,237,232,0.4)',lineHeight:1.6 }}>
              🇮🇳 By signing up, you agree to our Terms of Service. Data protected under IT Act 2000 & DPDP Act 2023.
            </div>

            {err && <div style={{ marginBottom:14,padding:'9px 12px',background:'rgba(231,76,60,0.08)',border:'1px solid rgba(231,76,60,0.25)',borderRadius:8,fontSize:12,color:'#E74C3C' }}>⚠️ {err}</div>}

            <button onClick={handle} disabled={busy} className="btn btn-primary btn-lg" style={{ width:'100%',marginBottom:16,opacity:busy?0.7:1 }}>
              {busy ? 'Creating Account…' : 'Create Free Account →'}
            </button>

            <div style={{ textAlign:'center',fontSize:13,color:'rgba(240,237,232,0.4)' }}>
              Already have an account?{' '}
              <span onClick={onGoLogin} style={{ color:'#FF9500',cursor:'pointer',fontWeight:600 }}>Log in →</span>
            </div>
          </>
        )}
      </div>
      <div style={{ marginTop:20,fontSize:11,color:'rgba(240,237,232,0.2)',textAlign:'center',lineHeight:1.7 }}>🔒 bcrypt · JWT · OTP ready · IT Act 2000 · DPDP Act 2023 compliant</div>
    </div>
  );
}

export function ForgotPasswordPage({ auth, onGoLogin }) {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newpass, 4=done
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const sendOtp = () => {
    setErr('');
    if (!email.includes('@')) return setErr('Enter a valid email address.');
    setBusy(true);
    // In production: send real OTP. For now, generate mock OTP for the flow.
    setTimeout(() => {
      const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(mockOtp);
      setBusy(false);
      setStep(2);
    }, 800);
  };

  const verifyOtp = () => {
    setErr('');
    if (otp.length !== 6) return setErr('Enter the 6-digit OTP.');
    if (otp !== generatedOtp) return setErr('Incorrect OTP. Please try again.');
    setStep(3);
  };

  const resetPassword = async () => {
    setErr('');
    if (newPass.length < 6) return setErr('Password must be at least 6 characters.');
    if (newPass !== confirmPass) return setErr('Passwords do not match.');
    setBusy(true);
    try {
      await auth.resetPassword(email, newPass);
      setBusy(false);
      setStep(4);
    } catch (e) {
      setBusy(false);
      setErr(e.message || 'Reset failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight:'100vh',background:'#07070F',color:'#F0EDE8',fontFamily:'Georgia,serif',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,position:'relative',overflow:'hidden' }}>
      {[380,250,140].map((sz,i) => (
        <div key={i} className="orbit-ring" style={{ width:sz,height:sz,border:`1px solid rgba(255,107,0,${0.04+i*0.02})`,animation:`orbit ${20+i*7}s linear infinite` }} />
      ))}

      <div style={{ display:'flex',alignItems:'center',gap:9,marginBottom:36,animation:'fadeUp 0.4s ease' }}>
        <div style={{ width:36,height:36,background:'linear-gradient(135deg,#FF6B00,#FF9500)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,animation:'glow 3s infinite' }}>⚖️</div>
        <span style={{ fontSize:20,fontWeight:700,background:'linear-gradient(90deg,#FF6B00,#FFD700)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>KanoonSaathi</span>
      </div>

      <div style={{ width:'100%',maxWidth:400,background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,107,0,0.18)',borderRadius:20,padding:'36px 32px',animation:'fadeUp 0.45s ease' }}>
        {step === 1 && (
          <>
            <div style={{ fontSize:24,fontWeight:700,marginBottom:4 }}>Reset Password 🔐</div>
            <div style={{ fontSize:13,color:'rgba(240,237,232,0.4)',marginBottom:24 }}>Enter your registered email. We'll send an OTP.</div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12,color:'rgba(240,237,232,0.5)',display:'block',marginBottom:6 }}>Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendOtp()} className="input" type="email" placeholder="you@example.com" />
            </div>
            {err && <div style={{ marginBottom:14,padding:'9px 12px',background:'rgba(231,76,60,0.08)',border:'1px solid rgba(231,76,60,0.25)',borderRadius:8,fontSize:12,color:'#E74C3C' }}>⚠️ {err}</div>}
            <button onClick={sendOtp} disabled={busy} className="btn btn-primary btn-lg" style={{ width:'100%',marginBottom:16 }}>{busy ? 'Sending OTP…' : 'Send OTP →'}</button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize:24,fontWeight:700,marginBottom:4 }}>Verify OTP ✉️</div>
            <div style={{ fontSize:13,color:'rgba(240,237,232,0.4)',marginBottom:12 }}>OTP sent to <strong style={{ color:'#FF9500' }}>{email}</strong></div>
            <div style={{ marginBottom:12,padding:'10px 14px',background:'rgba(76,175,80,0.08)',border:'1px solid rgba(76,175,80,0.2)',borderRadius:8,fontSize:12,color:'#4CAF50',lineHeight:1.6 }}>📱 <strong>Demo Mode:</strong> Your OTP is <strong style={{ fontFamily:'monospace',fontSize:18 }}>{generatedOtp}</strong><br/><span style={{ fontSize:10,color:'rgba(76,175,80,0.6)' }}>In production, this will be sent via SMS/Email.</span></div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12,color:'rgba(240,237,232,0.5)',display:'block',marginBottom:6 }}>Enter 6-Digit OTP</label>
              <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))} onKeyDown={e => e.key === 'Enter' && verifyOtp()} className="input" type="text" placeholder="000000" style={{ fontSize:24,letterSpacing:8,textAlign:'center',fontFamily:'monospace' }} />
            </div>
            {err && <div style={{ marginBottom:14,padding:'9px 12px',background:'rgba(231,76,60,0.08)',border:'1px solid rgba(231,76,60,0.25)',borderRadius:8,fontSize:12,color:'#E74C3C' }}>⚠️ {err}</div>}
            <button onClick={verifyOtp} className="btn btn-primary btn-lg" style={{ width:'100%',marginBottom:10 }}>Verify OTP →</button>
            <button onClick={() => { setStep(1); setOtp(''); setErr(''); }} className="btn btn-ghost" style={{ width:'100%',fontSize:12 }}>← Change Email</button>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontSize:24,fontWeight:700,marginBottom:4 }}>New Password 🔒</div>
            <div style={{ fontSize:13,color:'rgba(240,237,232,0.4)',marginBottom:24 }}>Create a new strong password for your account.</div>
            <div style={{ marginBottom:15 }}>
              <label style={{ fontSize:12,color:'rgba(240,237,232,0.5)',display:'block',marginBottom:6 }}>New Password</label>
              <div style={{ position:'relative' }}>
                <input value={newPass} onChange={e => setNewPass(e.target.value)} className="input" style={{ paddingRight:44 }} type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(240,237,232,0.4)',cursor:'pointer',fontSize:15,padding:0 }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>
            <div style={{ marginBottom:15 }}>
              <label style={{ fontSize:12,color:'rgba(240,237,232,0.5)',display:'block',marginBottom:6 }}>Confirm New Password</label>
              <input value={confirmPass} onChange={e => setConfirmPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && resetPassword()} className="input" type="password" placeholder="Re-enter new password" />
              {confirmPass.length > 0 && <div style={{ fontSize:11,marginTop:5,color: newPass === confirmPass ? '#4CAF50' : '#E74C3C' }}>{newPass === confirmPass ? '✅ Passwords match' : '❌ Passwords do not match'}</div>}
            </div>
            {err && <div style={{ marginBottom:14,padding:'9px 12px',background:'rgba(231,76,60,0.08)',border:'1px solid rgba(231,76,60,0.25)',borderRadius:8,fontSize:12,color:'#E74C3C' }}>⚠️ {err}</div>}
            <button onClick={resetPassword} disabled={busy} className="btn btn-primary btn-lg" style={{ width:'100%' }}>{busy ? 'Resetting…' : 'Reset Password →'}</button>
          </>
        )}

        {step === 4 && (
          <div style={{ textAlign:'center',padding:'20px 0',animation:'fadeUp 0.4s ease' }}>
            <div style={{ fontSize:52,marginBottom:16,animation:'glow 2s infinite',display:'inline-block' }}>✅</div>
            <div style={{ fontSize:20,fontWeight:700,marginBottom:8 }}>Password Reset!</div>
            <div style={{ fontSize:13,color:'rgba(240,237,232,0.45)',lineHeight:1.7,marginBottom:24 }}>Your password has been updated. You can now log in with your new password.</div>
            <button onClick={onGoLogin} className="btn btn-primary btn-lg" style={{ width:'100%' }}>← Back to Login</button>
          </div>
        )}

        {step < 4 && (
          <div style={{ textAlign:'center',fontSize:13,color:'rgba(240,237,232,0.4)',marginTop:16 }}>
            Remember your password?{' '}
            <span onClick={onGoLogin} style={{ color:'#FF9500',cursor:'pointer',fontWeight:600 }}>Log in →</span>
          </div>
        )}
      </div>
    </div>
  );
}
