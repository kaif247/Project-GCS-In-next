import React from 'react';
import styles from './SovereignHero.module.css';

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

const SovereignHero = ({ sticky = false }) => {
  const heroClass = sticky ? `${styles.hero} ${styles.heroSticky}` : styles.hero;

  return (
    <section className={heroClass} aria-label="Sovereign Hero">
      <div className={styles.heroInner}>
        <div className={styles.heroLead}>
          <p className={styles.kicker}>Sovereign Feed Protocol</p>
          <h1>Imperial Signal Active</h1>
          <p>
            Registry-first social feed for the Digital Lakou. Stories and posts remain
            visible below this command layer without overlap.
          </p>
        </div>

        <div className={styles.heroTrinity}>
          {trinity.map((member) => (
            <article key={member.name} className={styles.trinityCard}>
              <img src={member.image} alt={member.name} />
              <div>
                <span>{member.title}</span>
                <strong>{member.name}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SovereignHero;
