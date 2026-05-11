import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';

/* ─── Impact Badge ─────────────────────────────────────────────────────────── */
const impactStyle = {
  High: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', color: '#EF4444' },
  Medium: { bg: 'rgba(255,149,0,0.1)', border: 'rgba(255,149,0,0.2)', color: '#FF9500' },
  Low: { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', color: '#34D399' },
};

/* ─── News Card ────────────────────────────────────────────────────────────── */
function NewsCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const [shared, setShared] = useState(false);
  const is = impactStyle[item.impact] || impactStyle.Medium;

  const fmtDate = new Date(item.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const shareText = `⚖️ ${item.title}\n📅 ${fmtDate} · ${item.court}\n\n${item.summaryPoints.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}\n\n— via KanoonSaathi`;

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(shareText);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <article
      onClick={() => setExpanded(!expanded)}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18,
        padding: '22px 24px',
        cursor: 'pointer',
        transition: 'all 0.25s',
        animation: `fadeUp 0.35s ${index * 0.08}s ease both`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.25)'; e.currentTarget.style.background = 'rgba(255,107,0,0.03)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
    >
      {/* Accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${is.color}, transparent)`, borderRadius: '18px 18px 0 0' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        {/* Court icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: 'rgba(255,107,0,0.07)', border: '1px solid rgba(255,107,0,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          {item.court.includes('Supreme') ? '🏛️' : '⚖️'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F0EDE8', lineHeight: 1.45, margin: 0, marginBottom: 6 }}>
            {item.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)' }}>📅 {fmtDate}</span>
            <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)' }}>·</span>
            <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)' }}>{item.court}</span>
            <span style={{
              padding: '2px 8px', borderRadius: 8, fontSize: 9, fontWeight: 700,
              background: is.bg, border: `1px solid ${is.border}`, color: is.color,
            }}>
              {item.impact} Impact
            </span>
          </div>
        </div>
      </div>

      {/* Summary Bullets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        {item.summaryPoints.map((point, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            padding: '10px 14px', borderRadius: 12,
            background: i === 0 ? 'rgba(255,107,0,0.04)' : 'rgba(255,255,255,0.015)',
            border: `1px solid ${i === 0 ? 'rgba(255,107,0,0.1)' : 'rgba(255,255,255,0.04)'}`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
              background: i === 0 ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.05)',
              color: i === 0 ? '#FF9500' : 'rgba(240,237,232,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800,
            }}>
              {i + 1}
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(240,237,232,0.72)', lineHeight: 1.7, margin: 0 }}>
              {point}
            </p>
          </div>
        ))}
      </div>

      {/* Expanded: Case details + Tags */}
      {expanded && (
        <div style={{ animation: 'fadeUp 0.2s ease', marginBottom: 12 }}>
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: 'rgba(240,237,232,0.4)', marginBottom: 4 }}>
              <strong style={{ color: 'rgba(240,237,232,0.55)' }}>Case:</strong> {item.caseNo}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(240,237,232,0.4)' }}>
              <strong style={{ color: 'rgba(240,237,232,0.55)' }}>Bench:</strong> {item.bench}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {item.tags.map(tag => (
              <span key={tag} style={{
                padding: '3px 10px', borderRadius: 12, fontSize: 10, fontWeight: 600,
                background: 'rgba(232,168,56,0.06)', border: '1px solid rgba(232,168,56,0.12)',
                color: '#E8A838',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer: Expand + Share */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.2)' }}>
          {expanded ? '▲ Tap to collapse' : '▼ Tap for case details'}
        </span>
        <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
          <button onClick={handleCopy} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: shared ? '#34D399' : 'rgba(240,237,232,0.4)', transition: 'all 0.2s',
          }}>
            {shared ? '✅ Copied' : '📋 Copy'}
          </button>
          <button onClick={handleShare} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)',
            color: '#25D366', transition: 'all 0.2s',
          }}>
            📱 WhatsApp
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Main LegalNewsFeed ──────────────────────────────────────────────────── */
export default function LegalNewsFeed({ loggedIn, user, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogin, onSignup, onLogout, onHome, onProfile, onAdmin }) {
  const [filter, setFilter] = useState('All');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError('Unable to load latest news. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const categories = ['All', ...new Set(news.map(n => n.category))];
  const filtered = filter === 'All' ? news : news.filter(n => n.category === filter);

  const commonProps = { loggedIn, user, onLogin, onSignup, lang, theme, fontSize, setTheme, setFontSize, onLangPick, onLogout, onProfile, onHome, onAdmin, back: onHome, backLabel: '← Home' };

  return (
    <div style={{ minHeight: '100vh', background: '#07070F', color: '#F0EDE8', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <NavBar {...commonProps} />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 28, animation: 'fadeUp 0.3s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 10, filter: 'drop-shadow(0 0 14px rgba(255,107,0,0.3))' }}>📰</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, background: 'linear-gradient(90deg,#FF6B00,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            Legal News Feed
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.45)', lineHeight: 1.7, maxWidth: 500, margin: '8px auto 0' }}>
            Supreme Court & High Court judgments explained in 3 simple points. Stay informed — share with anyone on WhatsApp.
          </p>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              background: filter === cat ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)',
              border: filter === cat ? '1px solid rgba(255,107,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: filter === cat ? '#FF9500' : 'rgba(240,237,232,0.4)',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34D399', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.35)', fontWeight: 600 }}>
            {filtered.length} judgment{filtered.length !== 1 ? 's' : ''} · 
            {news.length > 0 ? (
              `Updated ${new Date(Math.max(...news.map(n => new Date(n.created_at || n.date)))).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
            ) : 'Updated May 2026'}
          </span>
        </div>

        {/* News Cards / Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(240,237,232,0.4)', animation: 'pulse 1.5s infinite' }}>
            Loading latest judgments...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#EF4444', background: 'rgba(239,68,68,0.1)', borderRadius: 12 }}>
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(240,237,232,0.4)' }}>
            No news available right now. Check back later.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((item, i) => (
              <NewsCard key={item.id || i} item={item} index={i} />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          marginTop: 28, padding: '16px 18px', borderRadius: 14, textAlign: 'center',
          background: 'rgba(255,149,0,0.04)', border: '1px solid rgba(255,149,0,0.12)',
        }}>
          <div style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)', lineHeight: 1.8 }}>
            <strong style={{ color: '#FF9500' }}>⚠️ Note:</strong> These summaries are simplified for general understanding. They are <em>not</em> legal advice and may not cover all nuances of the judgment. For the full order, visit the{' '}
            <a href="https://main.sci.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#FF9500', textDecoration: 'underline' }}>Supreme Court website</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
