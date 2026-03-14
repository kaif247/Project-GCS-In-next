import React, { useMemo, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import ToggleButton from '../components/ToggleButton';
import AdminPanel from '../components/admin/AdminPanel';
import { LanguageContext } from '../context/LanguageContext';

const API_URL = 'http://localhost:3001';

const fetchData = async (endpoint, method = 'GET', body = null) => {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
};

const AdminPage = () => {
  const { t } = useContext(LanguageContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [panel, setPanel] = useState(null);
  const [broadcastDraft, setBroadcastDraft] = useState({ title: '', message: '' });
  const [filters, setFilters] = useState({ query: '', role: 'All', status: 'All' });
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [stats, setStats] = useState([]);
  const [payments, setPayments] = useState([]);
  const [usageSeries, setUsageSeries] = useState([]);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [reportItems, setReportItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [flagItems, setFlagItems] = useState([]);
  const [announcementItems, setAnnouncementItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [auditItems, setAuditItems] = useState([]);

  useEffect(() => {
    fetchData('users').then(setUserItems);
    fetchData('reports').then(setReportItems);
    fetchData('flags').then(setFlagItems);
    fetchData('announcements').then(setAnnouncementItems);
    fetchData('alerts').then(setAlerts);
    fetchData('policies').then(setPolicies);
    fetchData('incidents').then(setIncidents);
    fetchData('audit').then(setAuditItems);
    fetchData('payments').then(setPayments);
    fetchData('usage-series').then(setUsageSeries);
    // Add securityEvents fetch if backend endpoint exists
  }, []);

  useEffect(() => {
    // Simple auth check (replace with real backend call if needed)
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

  const addAudit = async (action) => {
    const entry = {
      id: `A-${Date.now()}`,
      actor: 'Admin - Kaif',
      action,
      time: 'Just now',
    };
    await fetchData('audit', 'POST', entry);
    fetchData('audit').then(setAuditItems);
  };

  const handleSavePanel = async () => {
    if (!panel) return;
    if (panel.type === 'create-alert') {
      const next = {
        id: `AL-${Date.now()}`,
        title: panel.title || 'Untitled alert',
        severity: panel.severity || 'Low',
        message: panel.message || '',
      };
      await fetchData('alerts', 'POST', next);
      fetchData('alerts').then(setAlerts);
      addAudit(`Created alert: ${next.title}`);
    }
    if (panel.type === 'new-policy') {
      const next = {
        id: `P-${Date.now()}`,
        title: panel.title || 'Untitled policy',
        category: panel.category || 'Safety',
        summary: panel.summary || '',
      };
      await fetchData('policies', 'POST', next);
      fetchData('policies').then(setPolicies);
      addAudit(`Created policy: ${next.title}`);
    }
    if (panel.type === 'new-announcement') {
      const next = {
        id: `N-${Date.now()}`,
        title: panel.title || 'Announcement',
        detail: panel.detail || '',
      };
      await fetchData('announcements', 'POST', next);
      fetchData('announcements').then(setAnnouncementItems);
      addAudit(`Published announcement: ${next.title}`);
    }
    if (panel.type === 'incident-room' && panel.incidentTitle) {
      const next = {
        id: `INC-${Date.now()}`,
        title: panel.incidentTitle,
        severity: panel.incidentSeverity || 'Low',
        status: 'Open',
      };
      await fetchData('incidents', 'POST', next);
      fetchData('incidents').then(setIncidents);
      addAudit(`Opened incident: ${next.title}`);
    }
    if (panel.type === 'suspend-user') {
      await fetchData(`users/${panel.userId}`, 'PUT', { status: 'Suspended' });
      fetchData('users').then(setUserItems);
      addAudit(`Suspended user ${panel.userId}`);
    }
    if (panel.type === 'block-user') {
      const user = userItems.find(u => u.name === panel.userName);
      if (user) {
        await fetchData(`users/${user.id}`, 'PUT', { status: 'Suspended' });
        fetchData('users').then(setUserItems);
        addAudit(`Blocked user ${panel.userName}`);
      }
    }
    if (panel.type === 'send-broadcast') {
      if (broadcastDraft.title || broadcastDraft.message) {
        const next = {
          id: `B-${Date.now()}`,
          title: broadcastDraft.title || 'Broadcast',
          message: broadcastDraft.message || '',
          time: 'Just now',
        };
        setBroadcasts((prev) => [next, ...prev]); // Local only, backend endpoint can be added
        setBroadcastDraft({ title: '', message: '' });
        addAudit(`Sent broadcast: ${next.title}`);
      }
    }
    if (panel.type === 'assign-reports' && panel.owner) {
      const openReports = reportItems.filter(item => item.status === 'Open');
      for (const report of openReports) {
        await fetchData(`reports/${report.id}`, 'PUT', { owner: panel.owner });
      }
      fetchData('reports').then(setReportItems);
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
          label={t('Toggle admin sidebar')}
        />
      )}
      <div className={`admin-sidebar-wrap ${isSidebarOpen ? 'open' : ''}`}>
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <div className="admin-brand__badge">ADM</div>
            <div>
              <div className="admin-brand__title">{t('Control Room')}</div>
              <div className="admin-brand__meta">{t('Local mode')}</div>
            </div>
          </div>

          <nav className="admin-nav">
            {[
              { id: 'overview', label: t('Overview') },
              { id: 'moderation', label: t('Moderation') },
              { id: 'users', label: t('Users') },
              { id: 'reports', label: t('Reports') },
              { id: 'security', label: t('Security') },
              { id: 'payments', label: t('Payments') },
              { id: 'settings', label: t('Settings') },
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
              {t('Create alert')}
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
              {t('Log out')}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => router.push('/')}>
              {t('Back to site')}
            </button>
          </div>
        </aside>
      </div>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <div className="admin-header__eyebrow">{t('Admin dashboard')}</div>
            <h1>
              {activeTab === 'overview'
                ? t('Operational overview')
                : `${t(activeTab.charAt(0).toUpperCase() + activeTab.slice(1))} ${t('center')}`}
            </h1>
          </div>
          <div className="admin-header__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'export' })}>
              {t('Export')}
            </button>
            <button type="button" className="admin-btn admin-btn--primary" onClick={() => setPanel({ type: 'new-policy' })}>
              {t('New policy')}
            </button>
          </div>
        </header>

        {(activeTab === 'overview' || activeTab === 'moderation') && (
          <section className="admin-grid admin-grid--stats">
            {stats.map((item) => (
                <div key={item.label} className="admin-card admin-stat">
                <div className="admin-stat__label">{t(item.label)}</div>
                <div className="admin-stat__value">{item.value}</div>
                <div className={`admin-stat__delta ${item.trend}`}>
                  <span>{item.delta}</span>
                  <span>{item.trend === 'up' ? t('up') : t('down')}</span>
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
                  <h2>{t('Moderation queue')}</h2>
                  <p>{t('Newest items requiring review')}</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setActiveTab('reports')}>
                  {t('View all')}
                </button>
              </div>
              <div className="admin-list">
                {reportItems.map((report) => (
                  <div key={report.id} className="admin-list__item">
                    <div>
                      <div className="admin-list__title">{report.content}</div>
                      <div className="admin-list__meta">
                        {report.user} - {t(report.reason)}
                      </div>
                    </div>
                    <div className="admin-list__time">{report.time}</div>
                    <div className="admin-list__actions">
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'review-report', reportId: report.id })}>
                        {t('Review')}
                      </button>
                      <button type="button" className="admin-btn admin-btn--danger" onClick={() => setPanel({ type: 'block-user', userName: report.user })}>
                        {t('Block')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>{t('System status')}</h2>
                  <p>{t('Live service health checks')}</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setActiveTab('security')}>
                  {t('Details')}
                </button>
              </div>
              <div className="admin-status">
                <div className="admin-status__row"><span>{t('API latency')}</span><strong>120ms</strong></div>
                <div className="admin-status__row"><span>{t('Realtime events')}</span><strong>{t('Normal')}</strong></div>
                <div className="admin-status__row"><span>{t('Storage')}</span><strong>{t('74% used')}</strong></div>
                <div className="admin-status__row"><span>{t('Security alerts')}</span><strong>{t('2 active')}</strong></div>
              </div>
              <div className="admin-card__footer">
                <button type="button" className="admin-btn admin-btn--primary" onClick={() => setPanel({ type: 'incident-room' })}>
                  {t('Open incident room')}
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
                  <h2>{t('Weekly activity')}</h2>
                  <p>{t('Daily active users')}</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'trends' })}>
                  {t('View trends')}
                </button>
              </div>
              <div className="admin-chart">
                {usageSeries.map((item) => (
                  <div key={item.label} className="admin-chart__bar">
                    <div style={{ height: `${item.value}%` }} />
                    <span>{t(item.label)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>{t('Security center')}</h2>
                  <p>{t('Threats and authentication')}</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setActiveTab('security')}>
                  {t('Open')}
                </button>
              </div>
              <div className="admin-list">
                {securityEvents.map((item) => (
                  <div key={item.id} className="admin-list__item admin-list__item--tight">
                    <div>
                      <div className="admin-list__title">{t(item.item)}</div>
                      <div className="admin-list__meta">{t(item.detail)}</div>
                    </div>
                    <span className={`admin-severity ${item.severity}`}>{t(item.severity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>{t('Announcements')}</h2>
                  <p>{t('Global admin messages')}</p>
                </div>
                <button type="button" className="admin-btn admin-btn--primary" onClick={() => setPanel({ type: 'new-announcement' })}>
                  {t('New announcement')}
                </button>
              </div>
              <div className="admin-list">
                {announcementItems.map((item) => (
                  <div key={item.id} className="admin-list__item admin-list__item--tight">
                    <div>
                      <div className="admin-list__title">{t(item.title)}</div>
                      <div className="admin-list__meta">{t(item.detail)}</div>
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
                <h2>{t('Users')}</h2>
                <p>{t('Manage access and flags')}</p>
              </div>
              <div className="admin-table__actions">
                <input
                  className="admin-input"
                  placeholder={t('Search user or ID')}
                  value={filters.query}
                  onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                />
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'user-filters' })}>
                  {t('Filters')}
                </button>
              </div>
            </div>
            <div className="admin-table__head">
              <span>{t('User')}</span>
              <span>{t('Role')}</span>
              <span>{t('Status')}</span>
              <span>{t('Joined')}</span>
              <span>{t('Actions')}</span>
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
                <span>{t(user.role)}</span>
                <span className={`admin-status-pill ${user.status.toLowerCase()}`}>{t(user.status)}</span>
                <span>{user.joined}</span>
                <div className="admin-table__buttons">
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'user-profile', userId: user.id })}>
                    {t('View')}
                  </button>
                  <button type="button" className="admin-btn admin-btn--danger" onClick={() => setPanel({ type: 'suspend-user', userId: user.id })}>
                    {t('Suspend')}
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
                  <h2>{t('Reports center')}</h2>
                  <p>{t('Cases, status, and SLA')}</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'assign-reports' })}>
                  {t('Assign')}
                </button>
              </div>
              <div className="admin-table__head admin-table__head--compact">
                <span>{t('ID')}</span>
                <span>{t('Reason')}</span>
                <span>{t('Status')}</span>
                <span>{t('Owner')}</span>
              </div>
              {reportItems.map((report) => (
                <div key={report.id} className="admin-table__row admin-table__row--compact">
                  <span>{report.id}</span>
                  <span>{t(report.reason)}</span>
                  <span className="admin-status-pill flagged">{t(report.status)}</span>
                  <span>{t(report.owner)}</span>
                </div>
              ))}
            </div>

            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>{t('Feature flags')}</h2>
                  <p>{t('Rollouts and experiments')}</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'manage-flags' })}>
                  {t('Manage')}
                </button>
              </div>
              <div className="admin-flags">
                {flagItems.map((flag) => (
                  <div key={flag.id} className="admin-flag">
                    <div>
                      <div className="admin-flag__name">{t(flag.name)}</div>
                      <div className="admin-flag__meta">{t('Rollout')} {flag.rollout}</div>
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
                      {t(flag.status)}
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
                  <h2>{t('Broadcast tools')}</h2>
                  <p>{t('Send alerts or notifications')}</p>
                </div>
              </div>
              <div className="admin-form">
                <input
                  className="admin-input"
                  placeholder={t('Title')}
                  value={broadcastDraft.title}
                  onChange={(e) => setBroadcastDraft((prev) => ({ ...prev, title: e.target.value }))}
                />
                <textarea
                  className="admin-textarea"
                  rows={4}
                  placeholder={t('Message')}
                  value={broadcastDraft.message}
                  onChange={(e) => setBroadcastDraft((prev) => ({ ...prev, message: e.target.value }))}
                />
                <div className="admin-form__row">
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'preview-broadcast' })}>
                    {t('Preview')}
                  </button>
                  <button type="button" className="admin-btn admin-btn--primary" onClick={() => setPanel({ type: 'send-broadcast' })}>
                    {t('Send broadcast')}
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>{t('Payments')}</h2>
                  <p>{t('Revenue and billing snapshot')}</p>
                </div>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setActiveTab('payments')}>
                  {t('Ledger')}
                </button>
              </div>
              <div className="admin-payments">
                {payments.map((item) => (
                  <div key={item.id} className="admin-payment">
                    <span>{t(item.label)}</span>
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
                <h2>{t('Audit log')}</h2>
                <p>{t('Admin actions history')}</p>
              </div>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPanel({ type: 'download-audit' })}>
                {t('Download')}
              </button>
            </div>
            <div className="admin-list">
              {auditItems.map((item) => (
                <div key={item.id} className="admin-list__item admin-list__item--tight">
                  <div>
                    <div className="admin-list__title">{t(item.action)}</div>
                    <div className="admin-list__meta">{t(item.actor)}</div>
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
