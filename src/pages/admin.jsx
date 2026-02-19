import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ToggleButton from '../components/ToggleButton';
import AdminPanel from '../components/admin/AdminPanel';
import {
  statsSeed,
  reportsSeed,
  usersSeed,
  auditSeed,
  securitySeed,
  flagsSeed,
  announcementsSeed,
  alertsSeed,
  policiesSeed,
  paymentsSeed,
  usageSeriesSeed,
} from '../components/admin/adminData';

const loadLocal = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
};

const saveLocal = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const AdminPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [panel, setPanel] = useState(null);
  const [broadcastDraft, setBroadcastDraft] = useState({ title: '', message: '' });
  const [filters, setFilters] = useState({ query: '', role: 'All', status: 'All' });
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = useMemo(() => statsSeed, []);
  const payments = useMemo(() => paymentsSeed, []);
  const usageSeries = useMemo(() => usageSeriesSeed, []);
  const securityEvents = useMemo(() => securitySeed, []);

  const [reportItems, setReportItems] = useState(() => loadLocal('admin-reports', reportsSeed));
  const [userItems, setUserItems] = useState(() => loadLocal('admin-users', usersSeed));
  const [flagItems, setFlagItems] = useState(() => loadLocal('admin-flags', flagsSeed));
  const [announcementItems, setAnnouncementItems] = useState(() => loadLocal('admin-announcements', announcementsSeed));
  const [alerts, setAlerts] = useState(() => loadLocal('admin-alerts', alertsSeed));
  const [policies, setPolicies] = useState(() => loadLocal('admin-policies', policiesSeed));
  const [incidents, setIncidents] = useState(() => loadLocal('admin-incidents', [
    { id: 'INC-1', title: 'Login outage', severity: 'High', status: 'Open' },
  ]));
  const [broadcasts, setBroadcasts] = useState(() => loadLocal('admin-broadcasts', []));
  const [auditItems, setAuditItems] = useState(() => loadLocal('admin-audit', auditSeed));

  useEffect(() => saveLocal('admin-reports', reportItems), [reportItems]);
  useEffect(() => saveLocal('admin-users', userItems), [userItems]);
  useEffect(() => saveLocal('admin-flags', flagItems), [flagItems]);
  useEffect(() => saveLocal('admin-announcements', announcementItems), [announcementItems]);
  useEffect(() => saveLocal('admin-alerts', alerts), [alerts]);
  useEffect(() => saveLocal('admin-policies', policies), [policies]);
  useEffect(() => saveLocal('admin-incidents', incidents), [incidents]);
  useEffect(() => saveLocal('admin-broadcasts', broadcasts), [broadcasts]);
  useEffect(() => saveLocal('admin-audit', auditItems), [auditItems]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const authed = window.localStorage.getItem('admin-auth') === 'true';
    if (!authed) {
      router.replace('/admin/login');
      return;
    }
    setIsReady(true);
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      if (mobile) setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredUsers = useMemo(() => {
    return userItems.filter((user) => {
      const matchQuery =
        !filters.query ||
        user.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        user.id.toLowerCase().includes(filters.query.toLowerCase());
      const matchRole = filters.role === 'All' || user.role === filters.role;
      const matchStatus = filters.status === 'All' || user.status === filters.status;
      return matchQuery && matchRole && matchStatus;
    });
  }, [userItems, filters]);

  if (!isReady) {
    return null;
  }

  const addAudit = (action) => {
    const entry = {
      id: `A-${Date.now()}`,
      actor: 'Admin - Kaif',
      action,
      time: 'Just now',
    };
    setAuditItems((prev) => [entry, ...prev]);
  };

  const handleSavePanel = () => {
    if (!panel) return;
    if (panel.type === 'create-alert') {
      const next = {
        id: `AL-${Date.now()}`,
        title: panel.title || 'Untitled alert',
        severity: panel.severity || 'Low',
        message: panel.message || '',
      };
      setAlerts((prev) => [next, ...prev]);
      addAudit(`Created alert: ${next.title}`);
    }
    if (panel.type === 'new-policy') {
      const next = {
        id: `P-${Date.now()}`,
        title: panel.title || 'Untitled policy',
        category: panel.category || 'Safety',
        summary: panel.summary || '',
      };
      setPolicies((prev) => [next, ...prev]);
      addAudit(`Created policy: ${next.title}`);
    }
    if (panel.type === 'new-announcement') {
      const next = {
        id: `N-${Date.now()}`,
        title: panel.title || 'Announcement',
        detail: panel.detail || '',
      };
      setAnnouncementItems((prev) => [next, ...prev]);
      addAudit(`Published announcement: ${next.title}`);
    }
    if (panel.type === 'incident-room' && panel.incidentTitle) {
      const next = {
        id: `INC-${Date.now()}`,
        title: panel.incidentTitle,
        severity: panel.incidentSeverity || 'Low',
        status: 'Open',
      };
      setIncidents((prev) => [next, ...prev]);
      addAudit(`Opened incident: ${next.title}`);
    }
    if (panel.type === 'suspend-user') {
      setUserItems((prev) =>
        prev.map((item) =>
          item.id === panel.userId ? { ...item, status: 'Suspended' } : item
        )
      );
      addAudit(`Suspended user ${panel.userId}`);
    }
    if (panel.type === 'block-user') {
      setUserItems((prev) =>
        prev.map((item) =>
          item.name === panel.userName ? { ...item, status: 'Suspended' } : item
        )
      );
      addAudit(`Blocked user ${panel.userName}`);
    }
    if (panel.type === 'send-broadcast') {
      if (broadcastDraft.title || broadcastDraft.message) {
        const next = {
          id: `B-${Date.now()}`,
          title: broadcastDraft.title || 'Broadcast',
          message: broadcastDraft.message || '',
          time: 'Just now',
        };
        setBroadcasts((prev) => [next, ...prev]);
        setBroadcastDraft({ title: '', message: '' });
        addAudit(`Sent broadcast: ${next.title}`);
      }
    }
    if (panel.type === 'assign-reports' && panel.owner) {
      setReportItems((prev) =>
        prev.map((item) =>
          item.status === 'Open' ? { ...item, owner: panel.owner } : item
        )
      );
      addAudit(`Assigned open reports to ${panel.owner}`);
    }
    setPanel(null);
  };

  return (
    <div className="admin-shell">
      {isMobile && (
        <ToggleButton
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          label="Toggle admin sidebar"
        />
      )}
      <div className={`admin-sidebar-wrap ${isSidebarOpen ? 'open' : ''}`}>
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <div className="admin-brand__badge">ADM</div>
            <div>
              <div className="admin-brand__title">Control Room</div>
              <div className="admin-brand__meta">Local mode</div>
            </div>
          </div>

          <nav className="admin-nav">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'moderation', label: 'Moderation' },
              { id: 'users', label: 'Users' },
              { id: 'reports', label: 'Reports' },
              { id: 'security', label: 'Security' },
              { id: 'payments', label: 'Payments' },
              { id: 'settings', label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={`admin-nav__item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setIsSidebarOpen(false);
                }}
              >
                <span>{item.label}</span>
                {item.id === 'reports' && <span className="admin-pill">4</span>}
              </button>
            ))}
          </nav>

          <div className="admin-sidebar__cta">
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => setPanel({ type: 'create-alert' })}
            >
              Create alert
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.localStorage.removeItem('admin-auth');
                }
                router.replace('/admin/login');
              }}
            >
              Log out
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => router.push('/')}>
              Back to site
            </button>
          </div>
        </aside>
      </div>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <div className="admin-header__eyebrow">Admin dashboard</div>
            <h1>{activeTab === 'overview' ? 'Operational overview' : `${activeTab.charAt(0).toUpperCase()}${activeTab.slice(1)} center`}</h1>
          </div>
          <div className="admin-header__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'export' })}>
              Export
            </button>
            <button type="button" className="admin-btn admin-btn--primary" onClick={() => setPanel({ type: 'new-policy' })}>
              New policy
            </button>
          </div>
        </header>

        {(activeTab === 'overview' || activeTab === 'moderation') && (
          <section className="admin-grid admin-grid--stats">
            {stats.map((item) => (
              <div key={item.label} className="admin-card admin-stat">
                <div className="admin-stat__label">{item.label}</div>
                <div className="admin-stat__value">{item.value}</div>
                <div className={`admin-stat__delta ${item.trend}`}>
                  <span>{item.delta}</span>
                  <span>{item.trend === 'up' ? 'up' : 'down'}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {(activeTab === 'overview' || activeTab === 'moderation') && (
          <section className="admin-grid admin-grid--two">
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>Moderation queue</h2>
                  <p>Newest items requiring review</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setActiveTab('reports')}>
                  View all
                </button>
              </div>
              <div className="admin-list">
                {reportItems.map((report) => (
                  <div key={report.id} className="admin-list__item">
                    <div>
                      <div className="admin-list__title">{report.content}</div>
                      <div className="admin-list__meta">
                        {report.user} - {report.reason}
                      </div>
                    </div>
                    <div className="admin-list__time">{report.time}</div>
                    <div className="admin-list__actions">
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'review-report', reportId: report.id })}>
                        Review
                      </button>
                      <button type="button" className="admin-btn admin-btn--danger" onClick={() => setPanel({ type: 'block-user', userName: report.user })}>
                        Block
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>System status</h2>
                  <p>Live service health checks</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setActiveTab('security')}>
                  Details
                </button>
              </div>
              <div className="admin-status">
                <div className="admin-status__row"><span>API latency</span><strong>120ms</strong></div>
                <div className="admin-status__row"><span>Realtime events</span><strong>Normal</strong></div>
                <div className="admin-status__row"><span>Storage</span><strong>74% used</strong></div>
                <div className="admin-status__row"><span>Security alerts</span><strong>2 active</strong></div>
              </div>
              <div className="admin-card__footer">
                <button type="button" className="admin-btn admin-btn--primary" onClick={() => setPanel({ type: 'incident-room' })}>
                  Open incident room
                </button>
              </div>
            </div>
          </section>
        )}

        {(activeTab === 'overview' || activeTab === 'security') && (
          <section className="admin-grid admin-grid--three admin-mt">
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>Weekly activity</h2>
                  <p>Daily active users</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'trends' })}>
                  View trends
                </button>
              </div>
              <div className="admin-chart">
                {usageSeries.map((item) => (
                  <div key={item.label} className="admin-chart__bar">
                    <div style={{ height: `${item.value}%` }} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>Security center</h2>
                  <p>Threats and authentication</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setActiveTab('security')}>
                  Open
                </button>
              </div>
              <div className="admin-list">
                {securityEvents.map((item) => (
                  <div key={item.id} className="admin-list__item admin-list__item--tight">
                    <div>
                      <div className="admin-list__title">{item.item}</div>
                      <div className="admin-list__meta">{item.detail}</div>
                    </div>
                    <span className={`admin-severity ${item.severity}`}>{item.severity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>Announcements</h2>
                  <p>Global admin messages</p>
                </div>
                <button type="button" className="admin-btn admin-btn--primary" onClick={() => setPanel({ type: 'new-announcement' })}>
                  New announcement
                </button>
              </div>
              <div className="admin-list">
                {announcementItems.map((item) => (
                  <div key={item.id} className="admin-list__item admin-list__item--tight">
                    <div>
                      <div className="admin-list__title">{item.title}</div>
                      <div className="admin-list__meta">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {(activeTab === 'overview' || activeTab === 'users') && (
          <section className="admin-card admin-table">
            <div className="admin-card__header">
              <div>
                <h2>Users</h2>
                <p>Manage access and flags</p>
              </div>
              <div className="admin-table__actions">
                <input className="admin-input" placeholder="Search user or ID" value={filters.query} onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))} />
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'user-filters' })}>
                  Filters
                </button>
              </div>
            </div>
            <div className="admin-table__head">
              <span>User</span>
              <span>Role</span>
              <span>Status</span>
              <span>Joined</span>
              <span>Actions</span>
            </div>
            {filteredUsers.map((user) => (
              <div key={user.id} className="admin-table__row">
                <div className="admin-table__user">
                  <div className="admin-avatar">{user.name.slice(0, 1)}</div>
                  <div>
                    <div className="admin-table__name">{user.name}</div>
                    <div className="admin-table__id">{user.id}</div>
                  </div>
                </div>
                <span>{user.role}</span>
                <span className={`admin-status-pill ${user.status.toLowerCase()}`}>{user.status}</span>
                <span>{user.joined}</span>
                <div className="admin-table__buttons">
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'user-profile', userId: user.id })}>
                    View
                  </button>
                  <button type="button" className="admin-btn admin-btn--danger" onClick={() => setPanel({ type: 'suspend-user', userId: user.id })}>
                    Suspend
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {(activeTab === 'overview' || activeTab === 'reports') && (
          <section className="admin-grid admin-grid--two admin-mt">
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>Reports center</h2>
                  <p>Cases, status, and SLA</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'assign-reports' })}>
                  Assign
                </button>
              </div>
              <div className="admin-table__head admin-table__head--compact">
                <span>ID</span>
                <span>Reason</span>
                <span>Status</span>
                <span>Owner</span>
              </div>
              {reportItems.map((report) => (
                <div key={report.id} className="admin-table__row admin-table__row--compact">
                  <span>{report.id}</span>
                  <span>{report.reason}</span>
                  <span className="admin-status-pill flagged">{report.status}</span>
                  <span>{report.owner}</span>
                </div>
              ))}
            </div>

            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>Feature flags</h2>
                  <p>Rollouts and experiments</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'manage-flags' })}>
                  Manage
                </button>
              </div>
              <div className="admin-flags">
                {flagItems.map((flag) => (
                  <div key={flag.id} className="admin-flag">
                    <div>
                      <div className="admin-flag__name">{flag.name}</div>
                      <div className="admin-flag__meta">Rollout {flag.rollout}</div>
                    </div>
                    <button
                      type="button"
                      className={`admin-toggle ${flag.status === 'On' ? 'on' : ''}`}
                      onClick={() =>
                        setFlagItems((prev) =>
                          prev.map((item) =>
                            item.id === flag.id ? { ...item, status: item.status === 'On' ? 'Off' : 'On' } : item
                          )
                        )
                      }
                    >
                      {flag.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {(activeTab === 'overview' || activeTab === 'settings' || activeTab === 'payments') && (
          <section className="admin-grid admin-grid--two admin-mt">
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>Broadcast tools</h2>
                  <p>Send alerts or notifications</p>
                </div>
              </div>
              <div className="admin-form">
                <input className="admin-input" placeholder="Title" value={broadcastDraft.title} onChange={(e) => setBroadcastDraft((prev) => ({ ...prev, title: e.target.value }))} />
                <textarea className="admin-textarea" rows={4} placeholder="Message" value={broadcastDraft.message} onChange={(e) => setBroadcastDraft((prev) => ({ ...prev, message: e.target.value }))} />
                <div className="admin-form__row">
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'preview-broadcast' })}>
                    Preview
                  </button>
                  <button type="button" className="admin-btn admin-btn--primary" onClick={() => setPanel({ type: 'send-broadcast' })}>
                    Send broadcast
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>Payments</h2>
                  <p>Revenue and billing snapshot</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setActiveTab('payments')}>
                  Ledger
                </button>
              </div>
              <div className="admin-payments">
                {payments.map((item) => (
                  <div key={item.id} className="admin-payment">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {(activeTab === 'overview' || activeTab === 'moderation') && (
          <section className="admin-card admin-mt">
            <div className="admin-card__header">
              <div>
                <h2>Audit log</h2>
                <p>Admin actions history</p>
              </div>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'download-audit' })}>
                Download
              </button>
            </div>
            <div className="admin-list">
              {auditItems.map((item) => (
                <div key={item.id} className="admin-list__item admin-list__item--tight">
                  <div>
                    <div className="admin-list__title">{item.action}</div>
                    <div className="admin-list__meta">{item.actor}</div>
                  </div>
                  <div className="admin-list__time">{item.time}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <AdminPanel
        panel={panel}
        onClose={() => setPanel(null)}
        onSave={handleSavePanel}
        reportItems={reportItems}
        setReportItems={setReportItems}
        userItems={userItems}
        setUserItems={setUserItems}
        flagItems={flagItems}
        setFlagItems={setFlagItems}
        incidents={incidents}
        broadcastDraft={broadcastDraft}
        broadcasts={broadcasts}
        setPanel={setPanel}
        filters={filters}
        setFilters={setFilters}
        usageSeries={usageSeries}
      />
    </div>
  );
};

export default AdminPage;
