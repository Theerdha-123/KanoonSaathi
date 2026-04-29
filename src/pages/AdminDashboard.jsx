import { useState, useEffect, useCallback } from 'react';

const API = '/api/admin';

function StatCard({ icon, label, value, color = '#FF9500', sub }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 10, right: 14, fontSize: 28, opacity: 0.15 }}>{icon}</div>
      <div style={{ fontSize: 11, color: 'rgba(240,237,232,0.4)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1.1 }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {sub && <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function DataTable({ title, icon, headers, rows, emptyMsg = 'No data yet' }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span> {title}
      </div>
      {rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(240,237,232,0.25)', fontSize: 12 }}>{emptyMsg}</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,237,232,0.4)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,0,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '9px 10px', color: j === 0 ? '#F0EDE8' : 'rgba(240,237,232,0.55)' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BarChart({ data, labelKey, valueKey, color = '#FF6B00', maxBars = 10 }) {
  const items = data.slice(0, maxBars);
  const max = Math.max(...items.map(d => d[valueKey]), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 80, fontSize: 11, color: 'rgba(240,237,232,0.6)', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {d[labelKey]}
          </div>
          <div style={{ flex: 1, height: 22, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${(d[valueKey] / max) * 100}%`, height: '100%', background: `${color}${i === 0 ? '' : '99'}`, borderRadius: 4, transition: 'width 0.5s ease', minWidth: 2 }} />
            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'rgba(240,237,232,0.5)', fontWeight: 600 }}>{d[valueKey]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineChart({ data }) {
  if (!data || data.length === 0) return <div style={{ textAlign: 'center', color: 'rgba(240,237,232,0.25)', padding: 20, fontSize: 12 }}>No data yet</div>;
  const max = Math.max(...data.map(d => d.count), 1);
  const barW = Math.max(4, Math.min(20, Math.floor(600 / data.length) - 2));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 120, padding: '10px 0' }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }} title={`${d.day}: ${d.count} queries`}>
          <div style={{ width: barW, height: `${Math.max(2, (d.count / max) * 100)}%`, background: 'linear-gradient(180deg, #FF6B00, #FF9500)', borderRadius: 3, transition: 'height 0.3s ease' }} />
          {data.length <= 14 && <div style={{ fontSize: 8, color: 'rgba(240,237,232,0.25)', marginTop: 4, whiteSpace: 'nowrap' }}>{d.day.slice(5)}</div>}
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard({ token, onBack }) {
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (endpoint) => {
    const res = await fetch(`${API}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      if (res.status === 403) throw new Error('Admin access required');
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    return res.json();
  }, [token]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [overview, topQueries, topLaws, byLang, byState, byFeature, drafts, pageViews, timeline, recentQueries, users] = await Promise.all([
          fetchData('overview'),
          fetchData('top-queries'),
          fetchData('top-law-searches'),
          fetchData('usage-by-language'),
          fetchData('usage-by-state'),
          fetchData('usage-by-feature'),
          fetchData('draft-usage'),
          fetchData('page-views'),
          fetchData('query-timeline?days=30'),
          fetchData('recent-queries?limit=30'),
          fetchData('users?limit=50'),
        ]);
        setData({ overview, topQueries, topLaws, byLang, byState, byFeature, drafts, pageViews, timeline, recentQueries, users });
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    };
    load();
  }, [fetchData]);

  const LANG_NAMES = { en: 'English', hi: 'Hindi', bn: 'Bengali', ta: 'Tamil', te: 'Telugu', mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi', or: 'Odia', as: 'Assamese', ur: 'Urdu', sd: 'Sindhi', ne: 'Nepali', sa: 'Sanskrit', ks: 'Kashmiri', mni: 'Manipuri', doi: 'Dogri', kok: 'Konkani', sat: 'Santali', mai: 'Maithili', bo: 'Bodo' };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'queries', label: '💬 Queries', icon: '💬' },
    { id: 'laws', label: '⚖️ Laws', icon: '⚖️' },
    { id: 'analytics', label: '📈 Analytics', icon: '📈' },
    { id: 'users', label: '👥 Users', icon: '👥' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#07070F', color: '#F0EDE8', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Admin Navbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,7,15,0.97)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,107,0,0.2)', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '6px 12px', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>← Back</button>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #FF6B00, #FF9500)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚖️</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, background: 'linear-gradient(90deg, #FF6B00, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Dashboard</div>
            <div style={{ fontSize: 9, color: 'rgba(240,237,232,0.3)' }}>KanoonSaathi Analytics</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => window.location.reload()} style={{ background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.25)', borderRadius: 7, padding: '6px 14px', color: '#FF9500', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: 600 }}>🔄 Refresh</button>
          <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)' }}>🔴 Live</div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ margin: '20px auto', maxWidth: 600, padding: '16px 20px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#E74C3C', marginBottom: 4 }}>{error}</div>
          <div style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)' }}>Login with an admin account to access the dashboard.</div>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 36, animation: 'speakPulse 1s infinite' }}>📊</div>
          <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)', marginTop: 12 }}>Loading analytics data...</div>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && !error && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
          {/* Tab Bar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: '9px 16px', borderRadius: 8, border: tab === t.id ? 'none' : '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: tab === t.id ? 700 : 400, background: tab === t.id ? 'linear-gradient(135deg, #FF6B00, #FF9500)' : 'rgba(255,255,255,0.04)', color: tab === t.id ? '#fff' : 'rgba(240,237,232,0.55)', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {tab === 'overview' && data.overview && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
                <StatCard icon="👥" label="Total Users" value={data.overview.totalUsers} color="#1A8FBF" />
                <StatCard icon="💬" label="Total Queries" value={data.overview.totalQueries} color="#FF6B00" />
                <StatCard icon="👁️" label="Page Views" value={data.overview.totalPageViews} color="#9B59B6" />
                <StatCard icon="📝" label="Drafts Generated" value={data.overview.totalDrafts} color="#27AE60" />
                <StatCard icon="📅" label="Today's Queries" value={data.overview.todayQueries} color="#FF9500" sub="since midnight" />
                <StatCard icon="👤" label="Active Today" value={data.overview.todayUsers} color="#E74C3C" sub="unique logged-in" />
                <StatCard icon="📈" label="This Week" value={data.overview.weekQueries} color="#FFD700" sub="last 7 days" />
              </div>

              {/* Timeline */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📈 Query Volume (Last 30 Days)</div>
                <TimelineChart data={data.timeline} />
              </div>

              {/* Feature usage */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🛠️ Usage by Feature</div>
                  <BarChart data={data.byFeature || []} labelKey="feature" valueKey="count" color="#1A8FBF" />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📄 Page Views</div>
                  <BarChart data={data.pageViews || []} labelKey="page" valueKey="views" color="#9B59B6" />
                </div>
              </div>
            </>
          )}

          {/* Queries Tab */}
          {tab === 'queries' && (
            <>
              <DataTable
                title="Most Common Queries" icon="🔥"
                headers={['#', 'Query', 'Count', 'Last Asked']}
                rows={(data.topQueries || []).map((q, i) => [
                  i + 1,
                  q.query_text?.length > 80 ? q.query_text.slice(0, 80) + '…' : q.query_text,
                  q.count,
                  q.last_asked ? new Date(q.last_asked).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-',
                ])}
                emptyMsg="No queries recorded yet. Start using the chat!"
              />
              <DataTable
                title="Recent Queries" icon="💬"
                headers={['Time', 'User', 'Query', 'Feature', 'Lang', 'Response (ms)']}
                rows={(data.recentQueries || []).map(q => [
                  q.created_at ? new Date(q.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-',
                  q.user_name || 'Guest',
                  q.query_text?.length > 50 ? q.query_text.slice(0, 50) + '…' : q.query_text,
                  q.feature || 'chat',
                  q.language || 'en',
                  q.response_time_ms ? `${q.response_time_ms}ms` : '-',
                ])}
              />
            </>
          )}

          {/* Laws Tab */}
          {tab === 'laws' && (
            <>
              <DataTable
                title="Top Searched Laws" icon="⚖️"
                headers={['#', 'Search Term', 'Category', 'Count']}
                rows={(data.topLaws || []).map((l, i) => [i + 1, l.search_term, l.category || '-', l.count])}
                emptyMsg="No law searches recorded yet."
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📝 Draft Template Usage</div>
                  <BarChart data={data.drafts || []} labelKey="template_type" valueKey="count" color="#27AE60" />
                </div>
              </div>
            </>
          )}

          {/* Analytics Tab */}
          {tab === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🌐 Usage by Language</div>
                <BarChart
                  data={(data.byLang || []).map(d => ({ ...d, langName: LANG_NAMES[d.language] || d.language }))}
                  labelKey="langName" valueKey="query_count" color="#FF6B00"
                />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📍 Usage by State</div>
                <BarChart data={data.byState || []} labelKey="state" valueKey="query_count" color="#E74C3C" />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🛠️ Usage by Feature</div>
                <BarChart data={data.byFeature || []} labelKey="feature" valueKey="count" color="#1A8FBF" />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📈 Query Volume (30 Days)</div>
                <TimelineChart data={data.timeline} />
              </div>
            </div>
          )}

          {/* Users Tab */}
          {tab === 'users' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
                <StatCard icon="👥" label="Total Users" value={data.users?.total || 0} color="#1A8FBF" />
              </div>
              <DataTable
                title="Registered Users" icon="👤"
                headers={['Name', 'Email', 'Role', 'Language', 'State', 'Joined', 'Last Login']}
                rows={(data.users?.users || []).map(u => [
                  u.name,
                  u.email,
                  u.role === 'admin' ? '🔐 Admin' : 'User',
                  LANG_NAMES[u.language] || u.language || '-',
                  u.state || '-',
                  u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
                  u.last_login ? new Date(u.last_login).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Never',
                ])}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
