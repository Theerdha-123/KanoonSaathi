/**
 * Offline banner — shows when the user loses internet connection.
 * Also shows an install prompt and update notification.
 */
export function OfflineBanner({ isOnline }) {
  if (isOnline) return null;

  return (
    <div style={{
      position: 'fixed', top: 58, left: 0, right: 0, zIndex: 150,
      padding: '9px 20px',
      background: 'linear-gradient(135deg, rgba(192,57,43,0.95), rgba(155,29,32,0.95))',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      animation: 'fadeUp 0.3s ease',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E74C3C', animation: 'pulse 1.5s infinite' }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
        📡 You're offline — browsing cached content. AI chat requires internet.
      </span>
    </div>
  );
}

export function InstallBanner({ onInstall, onDismiss }) {
  return (
    <div style={{
      position: 'fixed', bottom: 90, left: 16, right: 16, zIndex: 150,
      padding: '14px 18px',
      background: 'rgba(7,7,15,0.97)',
      border: '1px solid rgba(255,107,0,0.3)',
      borderRadius: 16,
      backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', gap: 14,
      animation: 'fadeUp 0.4s ease',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      maxWidth: 500,
      margin: '0 auto',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 11,
        background: 'linear-gradient(135deg, #FF6B00, #FF9500)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>⚖️</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#F0EDE8', marginBottom: 2 }}>
          Install KanoonSaathi
        </div>
        <div style={{ fontSize: 11, color: 'rgba(240,237,232,0.5)', lineHeight: 1.5 }}>
          Add to home screen for instant access, even offline. No app store needed.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
        <button onClick={onInstall} style={{
          padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #FF6B00, #FF9500)', color: '#fff',
          fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
        }}>Install</button>
        <button onClick={onDismiss} style={{
          padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
          background: 'transparent', color: 'rgba(240,237,232,0.35)', cursor: 'pointer',
          fontSize: 9, fontFamily: 'inherit',
        }}>Later</button>
      </div>
    </div>
  );
}

export function UpdateBanner({ onUpdate }) {
  return (
    <div style={{
      position: 'fixed', top: 58, left: 0, right: 0, zIndex: 150,
      padding: '9px 20px',
      background: 'linear-gradient(135deg, rgba(76,175,80,0.95), rgba(39,174,96,0.95))',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      animation: 'fadeUp 0.3s ease',
    }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
        ✨ A new version of KanoonSaathi is available
      </span>
      <button onClick={onUpdate} style={{
        padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.4)',
        background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer',
        fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
      }}>Update Now</button>
    </div>
  );
}
