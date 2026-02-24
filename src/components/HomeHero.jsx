import React, { forwardRef } from 'react';
import styles from './HomeHero.module.css';

const HomeHero = forwardRef((props, ref) => {
  const vaultPercent = 33;

  return (
    <section ref={ref} className={styles.hero} id="home-hero">
      <div className={styles.heroBackdrop} aria-hidden="true" />
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Sovereign Command / Digital Lakou</p>
          <h1 className={styles.title}>
            The House of Dorvilus
            <span>Imperial Signal</span>
          </h1>
          <p className={styles.subhead}>
            Enter the feed under the Crowned Hare. Every visit begins with Imperial
            Authority and a living treasury.
          </p>
          <div className={styles.heroActions}>
            <a href="/landing#registry" className={styles.ctaPrimary}>
              Authenticate Bloodline
            </a>
            <a href="/imperial-treasury" className={styles.ctaGhost}>
              Enter the Treasury
            </a>
          </div>
          <div className={styles.vaultBar}>
            <div className={styles.vaultTrack}>
              <div className={styles.vaultFill} style={{ width: `${vaultPercent}%` }}>
                Treasury Frequency: {vaultPercent}% Activated
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroTriptych}>
          <div className={styles.triptychCard}>
            <img src="/H.S.H. Prince Jean II.svg" alt="H.S.H. Prince Jean II" />
            <div>
              <span>H.S.H. Prince Jean II</span>
              <strong>Sovereign Architect</strong>
            </div>
          </div>
          <div className={styles.triptychCard}>
            <img src="/H.I.H. Prince Thierry.svg" alt="H.I.H. Prince Thierry" />
            <div>
              <span>H.I.H. Prince Thierry</span>
              <strong>Imperial Steward</strong>
            </div>
          </div>
          <div className={styles.triptychCard}>
            <img src="/Cousin Wilson Joseph.svg" alt="Cousin Wilson Joseph" />
            <div>
              <span>Cousin Wilson Joseph</span>
              <strong>Local Foundation</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HomeHero.displayName = 'HomeHero';

export default HomeHero;
