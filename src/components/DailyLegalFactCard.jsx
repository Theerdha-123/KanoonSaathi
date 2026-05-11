import { useState, useEffect } from 'react';
import { DAILY_FACTS } from '../data/dailyFacts';

const STORAGE_KEY = 'ks_daily_fact';

/**
 * Get today's fact using a 24-hour localStorage timer.
 * A new random fact is selected once every 24 hours.
 */
function getTodaysFact() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored && stored.factId && stored.expiresAt) {
      if (Date.now() < stored.expiresAt) {
        const fact = DAILY_FACTS.find(f => f.id === stored.factId);
        if (fact) return fact;
      }
    }
  } catch {}

  // Pick a new random fact (avoid repeating last one)
  let lastId = null;
  try { lastId = JSON.parse(localStorage.getItem(STORAGE_KEY))?.factId; } catch {}
  let candidates = DAILY_FACTS.filter(f => f.id !== lastId);
  if (candidates.length === 0) candidates = DAILY_FACTS;
  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  // Store with 24-hour expiry
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ factId: picked.id, expiresAt })); } catch {}
  return picked;
}

/**
 * DailyLegalFactCard — Premium glassmorphism card with 24-hour rotation.
 *
 * Props:
 *   onShare  — optional callback when user clicks share
 *   speech   — optional { speak, speaking, stopSpeaking, supported } object for TTS
 *   compact  — optional boolean for a smaller version
 */
export default function DailyLegalFactCard({ onShare, speech, compact = false }) {
  const [fact, setFact] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    setFact(getTodaysFact());
  }, []);

  // Countdown timer to next fact
  useEffect(() => {
    if (!fact) return;
    const update = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (stored?.expiresAt) {
          const diff = stored.expiresAt - Date.now();
          if (diff <= 0) {
            setFact(getTodaysFact());
            return;
          }
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          setTimeLeft(`${h}h ${m}m`);
        }
      } catch {}
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [fact]);

  if (!fact) return null;

  const handleShare = () => {
    const text = `⚖️ Daily Legal Fact\n\n${fact.icon} ${fact.title}\n${fact.description}\n📖 ${fact.legalReference}\n\n— KanoonSaathi App`;
    if (onShare) {
      onShare(text);
    } else if (navigator.share) {
      navigator.share({ title: 'Daily Legal Fact — KanoonSaathi', text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  const handleSpeak = () => {
    if (!speech?.supported?.tts) return;
    if (speech.speaking) { speech.stopSpeaking(); return; }
    speech.speak(`Today's legal fact: ${fact.title}. ${fact.description}. Legal reference: ${fact.legalReference}`);
  };

  return (
    <div
      onClick={() => setShowFull(!showFull)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius: compact ? 16 : 20,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        animation: 'fadeUp 0.4s ease',
      }}
    >
      {/* Theme-aware Gradient Background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'var(--accent-bg)',
        opacity: 0.6
      }} />

      {/* Animated Accent Orb */}
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', zIndex: 0,
        background: 'radial-gradient(circle, var(--accent-border) 0%, transparent 70%)',
        animation: 'pulse 4s infinite',
        opacity: 0.4
      }} />

      {/* Glass Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: compact ? '16px 18px' : '22px 24px',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${isHovered ? 'var(--accent-border)' : 'var(--border-light)'}`,
        borderRadius: compact ? 16 : 20,
        transition: 'all 0.3s',
      }}>
        {/* Top Row: Badge + Timer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: compact ? 10 : 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              padding: '3px 10px', borderRadius: 20,
              background: 'var(--accent-bg)',
              border: '1px solid var(--accent-border)',
              fontSize: 10, fontWeight: 700, color: 'var(--accent)', letterSpacing: 0.8,
            }}>
              ⚡ DAILY LEGAL FACT
            </div>
            <span style={{
              padding: '2px 8px', borderRadius: 12,
              background: 'var(--green-bg)', border: '1px solid var(--green-border)',
              fontSize: 9, fontWeight: 600, color: 'var(--green)',
            }}>
              {fact.category}
            </span>
          </div>
          {timeLeft && (
            <div style={{ fontSize: 9, color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Next in {timeLeft}
            </div>
          )}
        </div>

        {/* Fact Content */}
        <div style={{ display: 'flex', gap: compact ? 12 : 16, alignItems: 'flex-start' }}>
          <div style={{
            fontSize: compact ? 28 : 36, flexShrink: 0,
            width: compact ? 44 : 56, height: compact ? 44 : 56,
            borderRadius: compact ? 12 : 16,
            background: 'var(--accent-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--accent-border)',
          }}>
            {fact.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: compact ? 14 : 16, fontWeight: 700, color: 'var(--text-primary)',
              marginBottom: 6, lineHeight: 1.4,
            }}>
              {fact.title}
            </div>
            <div style={{
              fontSize: compact ? 12 : 13,
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: 8,
              maxHeight: showFull ? 'none' : (compact ? 40 : 48),
              overflow: 'hidden',
              transition: 'max-height 0.3s',
            }}>
              {fact.description}
            </div>
            {/* Legal Reference Tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 8,
              background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
              fontSize: 10, color: 'var(--accent)', fontWeight: 600,
            }}>
              📖 {fact.legalReference}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: compact ? 10 : 14, paddingTop: compact ? 10 : 12,
          borderTop: '1px solid var(--border-light)',
        }}>
          <div style={{ fontSize: 9, color: 'var(--text-faint)' }}>
            {showFull ? '▲ Tap to collapse' : '▼ Tap to read more'}
          </div>
          <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
            {speech?.supported?.tts && (
              <button onClick={handleSpeak} style={{
                padding: '5px 10px', borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                background: speech.speaking ? 'var(--red-bg)' : 'var(--bg-primary)',
                border: speech.speaking ? '1px solid var(--red-border)' : '1px solid var(--border-light)',
                color: speech.speaking ? 'var(--red)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}>
                {speech.speaking ? '⏹ Stop' : '🔊 Listen'}
              </button>
            )}
            <button onClick={handleShare} style={{
              padding: '5px 10px', borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
              color: 'var(--accent)', transition: 'all 0.2s',
            }}>
              📤 Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
