import React, { useEffect, useMemo, useState } from 'react';
import styles from './InnovatorPortal.module.css';

const FEED_ITEMS = [
  {
    id: 'soil',
    label: 'Physical Soil Feed',
    note: 'Foundation trench scanning and soil compaction checkpoint active.',
    progress: 64,
  },
  {
    id: 'notes',
    label: 'Gressier Field Notes',
    note: 'Community route mapping and logistics notes synced from field team.',
    progress: 51,
  },
  {
    id: 'onsite',
    label: 'On-site Progress',
    note: 'Material staging lane prepared for first construction cycle.',
    progress: 37,
  },
];

const DEFAULT_LEDGER_ROWS = [
  { id: 'cement', item: 'Cement', cost: 2400, status: 'Sourcing' },
  { id: 'solar', item: 'Solar Panels', cost: 4800, status: 'Quoting' },
  { id: 'tablets', item: 'Tablets', cost: 1500, status: 'Planning' },
];

const STATUS_OPTIONS = ['Planning', 'Sourcing', 'Quoting', 'Procured'];

const statusToPercent = {
  Planning: 25,
  Sourcing: 50,
  Quoting: 70,
  Procured: 100,
};

const formatUSD = (amount) =>
  amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

const InnovatorPortal = () => {
  const [selectedFeedId, setSelectedFeedId] = useState(FEED_ITEMS[0].id);
  const [ledgerRows, setLedgerRows] = useState(DEFAULT_LEDGER_ROWS);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('gcs-innovator-ledger');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) {
        setLedgerRows(
          parsed.map((row) => ({
            id: row.id,
            item: row.item,
            cost: Number(row.cost),
            status: STATUS_OPTIONS.includes(row.status) ? row.status : 'Planning',
          }))
        );
      }
    } catch {
      // Ignore bad local data
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('gcs-innovator-ledger', JSON.stringify(ledgerRows));
  }, [ledgerRows]);

  useEffect(() => {
    setLastSync(new Date());
  }, []);

  const selectedFeed =
    FEED_ITEMS.find((feed) => feed.id === selectedFeedId) || FEED_ITEMS[0];

  const totalTargetCost = useMemo(
    () => ledgerRows.reduce((sum, row) => sum + row.cost, 0),
    [ledgerRows]
  );

  const completionPercent = useMemo(() => {
    if (!ledgerRows.length) return 0;
    const total = ledgerRows.reduce(
      (sum, row) => sum + (statusToPercent[row.status] || 0),
      0
    );
    return Math.round(total / ledgerRows.length);
  }, [ledgerRows]);

  const handleStatusChange = (rowId, nextStatus) => {
    setLedgerRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, status: nextStatus } : row))
    );
    setLastSync(new Date());
  };

  const handleRefresh = () => {
    setLastSync(new Date());
  };

  return (
    <section className={styles.portal}>
      <div className={styles.heroHeader}>
        <div className={styles.heroBadge}>Innovator Channel / Restricted</div>
        <h2>Innovator Portal</h2>
        <p>
          Live command access to the Morn Chandelle Restoration Fund and on-site
          execution signals.
        </p>
        <div className={styles.heroMeta}>
          <span>Digital Oversight</span>
          <span>Field Sync Active</span>
          <span>Architect Mode</span>
        </div>
      </div>

      <div className={styles.statusRow}>
        <div className={styles.liveChip}>
          <span className={styles.liveDot} aria-hidden="true" />
          Sync Live
        </div>
        <p>
          Last Sync: {lastSync ? lastSync.toLocaleTimeString() : '--:--:--'}
        </p>
        <button type="button" className={styles.refreshBtn} onClick={handleRefresh}>
          Refresh Feed
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.feedPanel}>
          <div className={styles.gallery}>
            {FEED_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.galleryItem} ${
                  selectedFeedId === item.id ? styles.galleryItemActive : ''
                }`}
                onClick={() => setSelectedFeedId(item.id)}
              >
                <strong>{item.label}</strong>
                <span>{item.progress}% active</span>
              </button>
            ))}
          </div>

          <div className={styles.feedDetail}>
            <h4>{selectedFeed.label}</h4>
            <p>{selectedFeed.note}</p>
            <div className={styles.progressMeta}>
              <span>Signal Strength</span>
              <span>{selectedFeed.progress}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${selectedFeed.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className={styles.ledger}>
          <h3>Architect&apos;s Ledger</h3>
          <div className={styles.ledgerSummary}>
            <p>Total Target Cost: {formatUSD(totalTargetCost)}</p>
            <p>On-site Completion: {completionPercent}%</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Target Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ledgerRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.item}</td>
                  <td>{formatUSD(row.cost)}</td>
                  <td>
                    <select
                      className={styles.statusSelect}
                      value={row.status}
                      onChange={(event) =>
                        handleStatusChange(row.id, event.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default InnovatorPortal;
