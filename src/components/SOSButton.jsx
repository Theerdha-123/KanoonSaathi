import { useState } from 'react';

export default function SOSButton() {
  const [expanded, setExpanded] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const triggerSOS = () => {
    setSending(true);

    // 1. Initiate call to 112
    window.open('tel:112', '_self');

    // 2. Share GPS location via WhatsApp to emergency contacts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const mapsUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;
          const message = encodeURIComponent(
            `🆘 EMERGENCY SOS from KanoonSaathi!\n\n` +
            `I need immediate help. My current location:\n${mapsUrl}\n\n` +
            `Lat: ${latitude}, Lng: ${longitude}\n` +
            `Time: ${new Date().toLocaleString('en-IN')}\n\n` +
            `Please call 112 if you cannot reach me.`
          );
          // Open WhatsApp share
          window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
          setSending(false);
          setSent(true);
          setTimeout(() => { setSent(false); setExpanded(false); }, 5000);
        },
        () => {
          // Location denied — still share without location
          const message = encodeURIComponent(
            `🆘 EMERGENCY SOS from KanoonSaathi!\n\n` +
            `I need immediate help. Could not get GPS location.\n` +
            `Time: ${new Date().toLocaleString('en-IN')}\n\n` +
            `Please call 112.`
          );
          window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
          setSending(false);
          setSent(true);
          setTimeout(() => { setSent(false); setExpanded(false); }, 5000);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 200,
          width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: '#C0392B', color: '#fff', fontSize: 20, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 4px rgba(192,57,43,0.3), 0 4px 20px rgba(192,57,43,0.5)',
          animation: 'glow 3s infinite',
          transition: 'transform 0.2s',
          transform: expanded ? 'scale(1.1)' : 'scale(1)',
        }}
        title="Emergency SOS"
      >
        🆘
      </button>

      {/* Expanded Panel */}
      {expanded && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 200,
          width: 280, background: '#0E0E1A', border: '1px solid rgba(192,57,43,0.4)',
          borderRadius: 16, padding: '18px 16px', animation: 'fadeUp 0.2s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#E74C3C', marginBottom: 4 }}>🚨 Emergency SOS</div>
          <div style={{ fontSize: 11, color: 'rgba(240,237,232,0.4)', marginBottom: 14, lineHeight: 1.5 }}>
            This will call 112 and share your GPS location via WhatsApp.
          </div>

          {sent ? (
            <div style={{ padding: '12px', background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 10, textAlign: 'center', fontSize: 13, color: '#4CAF50' }}>
              ✅ SOS triggered! Help is on the way.
            </div>
          ) : (
            <>
              <button onClick={triggerSOS} disabled={sending}
                style={{
                  width: '100%', padding: '14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: '#C0392B', color: '#fff', fontSize: 15, fontWeight: 700,
                  fontFamily: 'inherit', marginBottom: 10, opacity: sending ? 0.7 : 1,
                  animation: 'micPulse 1.5s infinite',
                }}>
                {sending ? '📍 Getting location…' : '🆘 CALL 112 + SHARE LOCATION'}
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <a href="tel:100" style={{ padding: '10px 8px', borderRadius: 8, background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.25)', textAlign: 'center', textDecoration: 'none', color: '#E74C3C', fontSize: 11, fontWeight: 600, display: 'block' }}>
                  🚔 Police<br /><strong>100</strong>
                </a>
                <a href="tel:181" style={{ padding: '10px 8px', borderRadius: 8, background: 'rgba(155,29,32,0.1)', border: '1px solid rgba(155,29,32,0.25)', textAlign: 'center', textDecoration: 'none', color: '#E74C3C', fontSize: 11, fontWeight: 600, display: 'block' }}>
                  👩 Mahila<br /><strong>181</strong>
                </a>
                <a href="tel:108" style={{ padding: '10px 8px', borderRadius: 8, background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)', textAlign: 'center', textDecoration: 'none', color: '#E74C3C', fontSize: 11, fontWeight: 600, display: 'block' }}>
                  🚑 Ambulance<br /><strong>108</strong>
                </a>
                <a href="tel:1098" style={{ padding: '10px 8px', borderRadius: 8, background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.25)', textAlign: 'center', textDecoration: 'none', color: '#FF9500', fontSize: 11, fontWeight: 600, display: 'block' }}>
                  👶 Child<br /><strong>1098</strong>
                </a>
              </div>
            </>
          )}

          <button onClick={() => setExpanded(false)}
            style={{ width: '100%', marginTop: 10, padding: '8px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,237,232,0.4)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
            Close
          </button>
        </div>
      )}
    </>
  );
}
