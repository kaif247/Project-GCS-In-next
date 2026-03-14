import React, { forwardRef } from 'react';
import styles from './HomeHero.module.css';
import CenterModeCarousel from './CenterModeCarousel';

const trinity = [
  {
    name: 'H.S.H. Prince Jean II',
    title: 'Sovereign Architect',
    image: '/H.S.H. Prince Jean II.svg',
  },
  {
    name: 'H.I.H. Prince Thierry',
    title: 'Imperial Steward',
    image: '/H.I.H. Prince Thierry.svg',
  },
  {
    name: 'Cousin Wilson Joseph',
    title: 'Local Foundation',
    image: '/Cousin Wilson Joseph.svg',
  },
];

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
            <a
              href="/landing#registry"
              className={styles.ctaPrimary}
              style={{ color: '#111111', background: 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' }}
            >
              Authenticate Bloodline
            </a>
            

            <a
              href="/imperial-treasury"
              className={styles.ctaGhost}
            >
              Enter the Treasury
            </a>
          </div>
          <div className={styles.vaultBar}>
            <p className={styles.vaultMeta}>Treasury Frequency Activated</p>
            <div className={styles.vaultTrack}>
              <div className={styles.vaultFill} style={{ width: `${vaultPercent}%` }}>
                {vaultPercent}%
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroTriptychDesktop}>
          {trinity.map((member) => (
            <div key={member.name} className={styles.triptychCard}>
              <img src={member.image} alt={member.name} />
              <div>
                <span>{member.name}</span>
                <strong>{member.title}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.heroTriptychMobile}>
          <CenterModeCarousel
            items={trinity}
            ariaLabel="Imperial Trinity"
            className={styles.heroTriptychCarousel}
            slideClassName={styles.heroTriptychCarouselSlide}
            itemWidth={196}
            gap={10}
            initialIndex={1}
            showNav={true}
            getKey={(member) => member.name}
            renderItem={(member) => (
              <div className={styles.triptychCardMobile}>
                <div className={styles.triptychFrame}>
                  <img src={member.image} alt={member.name} className={styles.triptychImage} />
                  <div className={styles.triptychGlow} aria-hidden="true" />
                </div>
                <div className={styles.triptychMeta}>
                  <span>{member.title}</span>
                  <strong>{member.name}</strong>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
});

HomeHero.displayName = 'HomeHero';

export default HomeHero;
