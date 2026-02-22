import React from 'react';
import styles from './InnovatorPortal.module.css';

const ledgerRows = [
  { item: 'Cement', cost: '$2,400', status: 'Sourcing' },
  { item: 'Solar Panels', cost: '$4,800', status: 'Quoting' },
  { item: 'Tablets', cost: '$1,500', status: 'Planning' },
];

const InnovatorPortal = () => (
  <section className={styles.portal}>
    <div className={styles.header}>
      <h2>Innovator Portal</h2>
      <p>
        Restricted access: Live visibility into the Morn Chandelle Restoration Fund.
      </p>
    </div>
    <div className={styles.content}>
      <div className={styles.gallery}>
        <div className={styles.galleryItem}>Physical Soil Feed</div>
        <div className={styles.galleryItem}>Gressier Field Notes</div>
        <div className={styles.galleryItem}>On-site Progress</div>
      </div>
      <div className={styles.ledger}>
        <h3>Architect&apos;s Ledger</h3>
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
              <tr key={row.item}>
                <td>{row.item}</td>
                <td>{row.cost}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default InnovatorPortal;
