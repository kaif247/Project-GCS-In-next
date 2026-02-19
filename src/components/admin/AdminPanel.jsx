import React from 'react';

const titleMap = {
  'create-alert': 'Create alert',
  'export': 'Export data',
  'new-policy': 'New policy',
  'review-report': 'Review report',
  'block-user': 'Block user',
  'incident-room': 'Incident room',
  'trends': 'Usage trends',
  'new-announcement': 'New announcement',
  'user-profile': 'User profile',
  'suspend-user': 'Suspend user',
  'preview-broadcast': 'Broadcast preview',
  'send-broadcast': 'Send broadcast',
  'download-audit': 'Download audit log',
  'assign-reports': 'Assign reports',
  'manage-flags': 'Manage flags',
  'user-filters': 'User filters',
};

const AdminPanel = ({
  panel,
  onClose,
  onSave,
  reportItems,
  setReportItems,
  userItems,
  setUserItems,
  flagItems,
  setFlagItems,
  incidents,
  broadcastDraft,
  broadcasts,
  setPanel,
  setFilters,
  filters,
  usageSeries,
}) => {
  if (!panel) return null;

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__backdrop" onClick={onClose} />
      <div className="admin-modal__card">
        <div className="admin-modal__header">
          <h3>{titleMap[panel.type] || 'Panel'}</h3>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="admin-modal__body admin-panel">
          {panel.type === 'create-alert' && (
            <div className="admin-panel__section">
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                placeholder="Alert title"
                onChange={(e) => setPanel((prev) => ({ ...prev, title: e.target.value }))}
              />
              <label className="admin-label">Severity</label>
              <select
                className="admin-select"
                onChange={(e) => setPanel((prev) => ({ ...prev, severity: e.target.value }))}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <label className="admin-label">Message</label>
              <textarea
                className="admin-textarea"
                rows={4}
                placeholder="Describe the alert"
                onChange={(e) => setPanel((prev) => ({ ...prev, message: e.target.value }))}
              />
            </div>
          )}

          {panel.type === 'export' && (
            <div className="admin-panel__section">
              <label className="admin-label">Export range</label>
              <div className="admin-grid admin-grid--two">
                <input className="admin-input" placeholder="From (YYYY-MM-DD)" />
                <input className="admin-input" placeholder="To (YYYY-MM-DD)" />
              </div>
              <label className="admin-label">Data type</label>
              <div className="admin-chips">
                <span className="admin-chip">Reports</span>
                <span className="admin-chip">Users</span>
                <span className="admin-chip">Audit logs</span>
              </div>
            </div>
          )}

          {panel.type === 'new-policy' && (
            <div className="admin-panel__section">
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                placeholder="Policy title"
                onChange={(e) => setPanel((prev) => ({ ...prev, title: e.target.value }))}
              />
              <label className="admin-label">Category</label>
              <select
                className="admin-select"
                onChange={(e) => setPanel((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option>Safety</option>
                <option>Integrity</option>
                <option>Privacy</option>
              </select>
              <label className="admin-label">Summary</label>
              <textarea
                className="admin-textarea"
                rows={4}
                placeholder="Short summary"
                onChange={(e) => setPanel((prev) => ({ ...prev, summary: e.target.value }))}
              />
            </div>
          )}

          {panel.type === 'review-report' && (() => {
            const report = reportItems.find((item) => item.id === panel.reportId);
            if (!report) return null;
            return (
              <div className="admin-panel__section">
                <div className="admin-kv">
                  <div>
                    <div className="admin-label">Report</div>
                    <strong>{report.id}</strong>
                  </div>
                  <div>
                    <div className="admin-label">User</div>
                    <strong>{report.user}</strong>
                  </div>
                </div>
                <label className="admin-label">Status</label>
                <select
                  className="admin-select"
                  value={report.status}
                  onChange={(e) =>
                    setReportItems((prev) =>
                      prev.map((item) =>
                        item.id === report.id ? { ...item, status: e.target.value } : item
                      )
                    )
                  }
                >
                  <option>Open</option>
                  <option>In review</option>
                  <option>Resolved</option>
                </select>
                <label className="admin-label">Owner</label>
                <select
                  className="admin-select"
                  value={report.owner}
                  onChange={(e) =>
                    setReportItems((prev) =>
                      prev.map((item) =>
                        item.id === report.id ? { ...item, owner: e.target.value } : item
                      )
                    )
                  }
                >
                  <option>Unassigned</option>
                  <option>Kaif Islam</option>
                  <option>Mariam L.</option>
                </select>
              </div>
            );
          })()}

          {panel.type === 'block-user' && (
            <div className="admin-panel__section">
              <div className="admin-label">User</div>
              <strong>{panel.userName}</strong>
              <label className="admin-label">Reason</label>
              <select className="admin-select">
                <option>Spam</option>
                <option>Harassment</option>
                <option>Hate speech</option>
              </select>
              <label className="admin-label">Duration</label>
              <select className="admin-select">
                <option>7 days</option>
                <option>30 days</option>
                <option>Permanent</option>
              </select>
            </div>
          )}

          {panel.type === 'incident-room' && (
            <div className="admin-panel__section">
              <div className="admin-label">Active incidents</div>
              <div className="admin-list">
                {incidents.map((item) => (
                  <div key={item.id} className="admin-list__item admin-list__item--tight">
                    <div>
                      <div className="admin-list__title">{item.title}</div>
                      <div className="admin-list__meta">{item.severity} - {item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
              <label className="admin-label">Create new incident</label>
              <input
                className="admin-input"
                placeholder="Incident title"
                onChange={(e) => setPanel((prev) => ({ ...prev, incidentTitle: e.target.value }))}
              />
              <select
                className="admin-select"
                onChange={(e) => setPanel((prev) => ({ ...prev, incidentSeverity: e.target.value }))}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          )}

          {panel.type === 'trends' && (
            <div className="admin-panel__section">
              <div className="admin-label">Trend ranges</div>
              <div className="admin-chips">
                <span className="admin-chip">7 days</span>
                <span className="admin-chip">30 days</span>
                <span className="admin-chip">90 days</span>
              </div>
              <div className="admin-chart admin-chart--modal">
                {usageSeries.map((item) => (
                  <div key={item.label} className="admin-chart__bar">
                    <div style={{ height: `${item.value}%` }} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {panel.type === 'new-announcement' && (
            <div className="admin-panel__section">
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                placeholder="Announcement title"
                onChange={(e) => setPanel((prev) => ({ ...prev, title: e.target.value }))}
              />
              <label className="admin-label">Detail</label>
              <textarea
                className="admin-textarea"
                rows={3}
                placeholder="Announcement detail"
                onChange={(e) => setPanel((prev) => ({ ...prev, detail: e.target.value }))}
              />
            </div>
          )}

          {panel.type === 'user-profile' && (() => {
            const user = userItems.find((item) => item.id === panel.userId);
            if (!user) return null;
            return (
              <div className="admin-panel__section">
                <div className="admin-kv">
                  <div>
                    <div className="admin-label">Name</div>
                    <strong>{user.name}</strong>
                  </div>
                  <div>
                    <div className="admin-label">Role</div>
                    <strong>{user.role}</strong>
                  </div>
                  <div>
                    <div className="admin-label">Status</div>
                    <strong>{user.status}</strong>
                  </div>
                </div>
                <div className="admin-panel__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={() =>
                      setUserItems((prev) =>
                        prev.map((item) =>
                          item.id === user.id ? { ...item, status: 'Flagged' } : item
                        )
                      )
                    }
                  >
                    Flag user
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger"
                    onClick={() =>
                      setUserItems((prev) =>
                        prev.map((item) =>
                          item.id === user.id ? { ...item, status: 'Suspended' } : item
                        )
                      )
                    }
                  >
                    Suspend
                  </button>
                </div>
              </div>
            );
          })()}

          {panel.type === 'suspend-user' && (() => {
            const user = userItems.find((item) => item.id === panel.userId);
            if (!user) return null;
            return (
              <div className="admin-panel__section">
                <div className="admin-label">User</div>
                <strong>{user.name}</strong>
                <label className="admin-label">Duration</label>
                <select className="admin-select">
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>Permanent</option>
                </select>
              </div>
            );
          })()}

          {panel.type === 'preview-broadcast' && (
            <div className="admin-panel__section">
              <div className="admin-preview">
                <div className="admin-preview__title">{broadcastDraft.title || 'Broadcast preview'}</div>
                <div className="admin-preview__body">{broadcastDraft.message || 'No message yet.'}</div>
              </div>
            </div>
          )}

          {panel.type === 'send-broadcast' && (
            <div className="admin-panel__section">
              <div className="admin-label">Broadcast queue</div>
              <div className="admin-list">
                {broadcasts.length === 0 && <div className="admin-list__meta">No broadcasts sent yet.</div>}
                {broadcasts.map((item) => (
                  <div key={item.id} className="admin-list__item admin-list__item--tight">
                    <div>
                      <div className="admin-list__title">{item.title}</div>
                      <div className="admin-list__meta">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {panel.type === 'download-audit' && (
            <div className="admin-panel__section">
              <label className="admin-label">Format</label>
              <select className="admin-select">
                <option>CSV</option>
                <option>JSON</option>
              </select>
              <label className="admin-label">Range</label>
              <div className="admin-grid admin-grid--two">
                <input className="admin-input" placeholder="From" />
                <input className="admin-input" placeholder="To" />
              </div>
            </div>
          )}

          {panel.type === 'assign-reports' && (
            <div className="admin-panel__section">
              <label className="admin-label">Assign all open reports to</label>
              <select className="admin-select" onChange={(e) => setPanel((prev) => ({ ...prev, owner: e.target.value }))}>
                <option>Kaif Islam</option>
                <option>Mariam L.</option>
              </select>
            </div>
          )}

          {panel.type === 'manage-flags' && (
            <div className="admin-panel__section">
              <div className="admin-list">
                {flagItems.map((flag) => (
                  <div key={flag.id} className="admin-list__item admin-list__item--tight">
                    <div>
                      <div className="admin-list__title">{flag.name}</div>
                      <div className="admin-list__meta">Rollout {flag.rollout}</div>
                    </div>
                    <button
                      type="button"
                      className={`admin-toggle ${flag.status === 'On' ? 'on' : ''}`}
                      onClick={() =>
                        setFlagItems((prev) =>
                          prev.map((item) =>
                            item.id === flag.id
                              ? { ...item, status: item.status === 'On' ? 'Off' : 'On' }
                              : item
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
          )}

          {panel.type === 'user-filters' && (
            <div className="admin-panel__section">
              <label className="admin-label">Role</label>
              <select
                className="admin-select"
                value={filters.role}
                onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
              >
                <option>All</option>
                <option>Admin</option>
                <option>Moderator</option>
                <option>User</option>
              </select>
              <label className="admin-label">Status</label>
              <select
                className="admin-select"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option>All</option>
                <option>Active</option>
                <option>Flagged</option>
                <option>Suspended</option>
              </select>
            </div>
          )}
        </div>

        <div className="admin-modal__footer">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
