import { useState, useRef, useEffect } from 'react';

export default function VoiceOnlyPage({ lang, speech, onHome }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, listening, thinking, speaking
  const hasInit = useRef(false);

  const { listening, speaking, transcript, hasStt, hasTts, startListening, stopListening, speak, stopSpeaking } = speech;

  useEffect(() => {
    if (listening) setStatus('listening');
    else if (loading) setStatus('thinking');
    else if (speaking) setStatus('speaking');
    else setStatus('idle');
  }, [listening, loading, speaking]);

  const ask = async (text) => {
    if (!text?.trim()) return;
    const userMsg = { role: 'user', content: text.trim() };
    const msgs = [...messages, userMsg];
    setMessages(msgs);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: msgs,
          system: `You are KanoonSaathi, India's AI legal assistant. The user is using VOICE-ONLY mode — they may be illiterate or visually impaired. Give SHORT, CLEAR responses meant to be read aloud. Use simple language. Keep each section to 1-2 sentences max. Still use the standard format with ⚖️ Laws, 📖 Simple Words, ✅ Steps, and 📞 Helplines.`,
          language: lang,
        }),
      });
      const data = await res.json();
      const reply = data.reply || 'Sorry, I could not understand. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch {
      const errMsg = 'Sorry, could not connect to the server. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
      speak(errMsg);
    }
    setLoading(false);
  };

  const handleMicPress = () => {
    if (speaking) { stopSpeaking(); return; }
    if (listening) { stopListening(); return; }
    startListening((text) => { if (text?.trim()) ask(text.trim()); });
  };

  const colors = {
    idle: { bg: '#FF6B00', ring: 'rgba(255,107,0,0.3)', text: 'Tap to Speak', icon: '🎙️' },
    listening: { bg: '#E74C3C', ring: 'rgba(231,76,60,0.4)', text: 'Listening…', icon: '🔴' },
    thinking: { bg: '#FF9500', ring: 'rgba(255,149,0,0.3)', text: 'Thinking…', icon: '🧠' },
    speaking: { bg: '#4CAF50', ring: 'rgba(76,175,80,0.3)', text: 'Speaking…', icon: '🔊' },
  };
  const c = colors[status];

  return (
    <div style={{ height: '100vh', background: '#07070F', color: '#F0EDE8', fontFamily: 'Georgia,serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Orbits */}
      {[400, 280, 160].map((sz, i) => (
        <div key={i} className="orbit-ring" style={{ width: sz, height: sz, border: `1px solid ${c.ring}`, animation: `orbit ${18 + i * 6}s linear infinite` }} />
      ))}

      {/* Back button */}
      <button onClick={onHome} style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,237,232,0.5)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', zIndex: 10 }}>
        ← Back
      </button>

      {/* Logo */}
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', alignItems: 'center', gap: 8, zIndex: 10 }}>
        <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#FF6B00,#FF9500)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚖️</div>
        <span style={{ fontSize: 14, fontWeight: 700, background: 'linear-gradient(90deg,#FF6B00,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KanoonSaathi</span>
      </div>

      {/* Title */}
      <div style={{ position: 'absolute', top: 28, textAlign: 'center', zIndex: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Voice Mode</div>
        <div style={{ fontSize: 11, color: 'rgba(240,237,232,0.3)' }}>No typing needed — just speak</div>
      </div>

      {/* Main Mic Button */}
      <button onClick={handleMicPress} disabled={loading}
        style={{
          width: 160, height: 160, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: c.bg, color: '#fff', fontSize: 56, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 10,
          boxShadow: `0 0 0 4px ${c.ring}, 0 0 60px ${c.ring}`,
          animation: status === 'listening' ? 'micPulse 1.2s infinite' : status === 'speaking' ? 'speakPulse 1s infinite' : 'glow 3s infinite',
          transition: 'all 0.3s ease', opacity: loading ? 0.7 : 1,
        }}>
        <span>{c.icon}</span>
      </button>

      {/* Status Text */}
      <div style={{ marginTop: 24, textAlign: 'center', zIndex: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: c.bg, marginBottom: 6 }}>{c.text}</div>
        {transcript && status === 'listening' && (
          <div style={{ fontSize: 14, color: 'rgba(240,237,232,0.7)', maxWidth: 400, lineHeight: 1.6, animation: 'fadeIn 0.2s ease' }}>"{transcript}"</div>
        )}
        {status === 'idle' && messages.length === 0 && (
          <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.35)', maxWidth: 320, lineHeight: 1.7 }}>
            Tap the button and say your legal problem. I'll explain the law and tell you what to do.
          </div>
        )}
      </div>

      {/* Wave animation */}
      {status === 'listening' && (
        <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 30, marginTop: 20, zIndex: 10 }}>
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ width: 4, borderRadius: 3, background: '#E74C3C', animation: `wave 0.9s ${i * 0.1}s ease-in-out infinite` }} />
          ))}
        </div>
      )}

      {/* Last response preview (minimal) */}
      {messages.length > 0 && status === 'idle' && (
        <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20, textAlign: 'center', zIndex: 10 }}>
          <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.25)', marginBottom: 6 }}>Last response:</div>
          <div style={{ fontSize: 12, color: 'rgba(240,237,232,0.45)', lineHeight: 1.5, maxHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {messages[messages.length - 1]?.content?.slice(0, 150)}…
          </div>
          <button onClick={() => speak(messages[messages.length - 1]?.content || '')}
            style={{ marginTop: 8, padding: '6px 16px', borderRadius: 16, background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)', color: '#4CAF50', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
            🔊 Hear Again
          </button>
        </div>
      )}

      {/* Emergency SOS */}
      <a href="tel:112" style={{ position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%', background: '#C0392B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, textDecoration: 'none', boxShadow: '0 0 20px rgba(192,57,43,0.5)', zIndex: 10, animation: 'glow 3s infinite' }}>
        🆘
      </a>
    </div>
  );
}
