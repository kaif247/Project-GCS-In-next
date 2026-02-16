import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/SovereignHome.module.css';

const engagementOptions = [
  'Community Architect',
  'Digital Protector',
  'Historical Educator',
  'Sovereign Innovator',
];

const timeline = [
  { year: '1791', label: 'Spark of Sovereignty ignites across the Grand’Anse.' },
  { year: '1804', label: 'Imperial frequency consolidates into the House of Dorvilus.' },
  { year: '2026', label: 'Sovereign signal rebroadcasts in the Digital Lakou.' },
];

const sctivactionFeed = [
  {
    tag: '#PRINS_NAN_SAN',
    title: 'Sovereign Signal Dispatch',
    excerpt: 'Live transmissions from the restoration front: education, defense, and innovation nodes.',
  },
  {
    tag: 'Movement Update',
    title: 'Digital Lakou Mobilization',
    excerpt: 'Community architects map the new sovereign corridors with open councils.',
  },
  {
    tag: 'Cultural Pulse',
    title: 'Princess Célestine Remembrance',
    excerpt: 'Healing sessions and storytelling circles restore the ancestral cadence.',
  },
];

const LandingPage = () => {
  const [form, setForm] = useState({ name: '', email: '', path: engagementOptions[0] });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const canSubmit = useMemo(() => {
    return form.name.trim() && form.email.trim();
  }, [form]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const elements = document.querySelectorAll(`.${styles.animate}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.isVisible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setStatus({ state: 'error', message: 'Please complete all required fields.' });
      return;
    }

    setStatus({ state: 'loading', message: '' });
    try {
      const response = await fetch('/api/sovereign-registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setStatus({
        state: 'success',
        message: 'Thank you. Your sovereign registry submission has been received.',
      });
      setForm({ name: '', email: '', path: engagementOptions[0] });
    } catch (error) {
      setStatus({
        state: 'error',
        message: 'Submission failed. Please try again or reach out directly.',
      });
    }
  };

  return (
    <>
      <Head>
        <title>House of Dorvilus — Imperial Haiti Restoration</title>
        <meta
          name="description"
          content="Join the Sovereign Intelligence movement. Ground your frequency in the Digital Lakou."
        />
        <meta
          name="keywords"
          content="House of Dorvilus, Imperial Haiti Restoration, Sovereign Intelligence, Digital Lakou, Sovereign Authority"
        />
        <link rel="icon" href="/imperial-seal.svg" />
      </Head>
      <main className={styles.page}>
        <section className={styles.hero} id="hero">
          <div className={`${styles.heroContent} ${styles.animate}`}>
            <p className={styles.eyebrow}>Sovereign Restoration (V1.2)</p>
            <h1 className={styles.heroTitle}>The Evolution of the Flame: The House of Dorvilus.</h1>
            <p className={`${styles.subhead} ${styles.subheadGlow}`}>
              From the 1791 Spark to the 2026 Sovereign Frequency. Ground your Street Nobility
              in the Digital Lakou.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#registry" aria-label="Enter the registry">
                Enter the Sovereign Registry
              </a>
              <a className={styles.ghostButton} href="#frekans" aria-label="Explore the doctrine">
                Explore the Doctrine
              </a>
            </div>
            <div className={styles.heroMeta}>
              <span>Imperial Gold</span>
              <span>Crimson Oaths</span>
              <span>Electric Boukman Blue</span>
            </div>
          </div>
          <div className={`${styles.heroVisual} ${styles.animate}`}>
            <div className={styles.mirrorGrid}>
              <div className={`${styles.mirrorTile} ${styles.mirrorTileLeftTop}`}>
                <span>Frekans Grand’Anse</span>
              </div>
              <div className={`${styles.mirrorTile} ${styles.mirrorTileRightTop}`}>
                <span>Enperval Sovereignité</span>
              </div>
              <div className={`${styles.mirrorTile} ${styles.mirrorTileLeftBottom}`}>
                <span>San Manman, San Istwa</span>
              </div>
              <div className={`${styles.mirrorTile} ${styles.mirrorTileRightBottom}`}>
                <span>Sctivaction</span>
              </div>
              <div className={styles.mirrorCenter}>
                <img
                  src="/reactivated-boukman.svg"
                  alt="Reactivated Boukman portrait"
                  className={styles.mirrorHero}
                />
                <div className={styles.mirrorCaption}>Free Haiti Movement</div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.registry} ${styles.animate}`} id="registry">
          <div className={styles.sectionHeader}>
            <h2>THE REGISTRY OF BLOOD</h2>
            <p>Ground your frequency into Sovereign Reality.</p>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label htmlFor="registry-name">Full Name</label>
              <input
                id="registry-name"
                type="text"
                placeholder="Your Sovereign Title"
                value={form.name}
                onChange={handleChange('name')}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="registry-email">Email Address</label>
              <input
                id="registry-email"
                type="email"
                placeholder="you@sovereignlakou.com"
                value={form.email}
                onChange={handleChange('email')}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="registry-path">Engagement Path</label>
              <select
                id="registry-path"
                value={form.path}
                onChange={handleChange('path')}
              >
                {engagementOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className={styles.primaryButton}
              aria-label="Register with the Bloodline"
              disabled={status.state === 'loading'}
            >
              {status.state === 'loading' ? 'Submitting...' : 'Register with the Bloodline'}
            </button>
          </form>
          {status.message && (
            <div className={`${styles.toast} ${styles[`toast${status.state}`]}`} role="status">
              {status.message}
            </div>
          )}
        </section>

        <section className={`${styles.section} ${styles.animate}`} id="frekans">
          <div className={styles.sectionHeader}>
            <h2>Frekans Grand’Anse</h2>
            <p>High-frequency ancestral timeline anchoring the restoration.</p>
          </div>
          <div className={styles.timeline}>
            {timeline.map((item) => (
              <div key={item.year} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineLine} />
                <div className={styles.timelineContent}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.animate}`} id="san-manman">
          <div className={styles.sectionHeader}>
            <h2>San Manman, San Istwa</h2>
            <p>Princess Célestine’s legacy of healing, cultural restoration, and lineage care.</p>
          </div>
          <div className={styles.cards}>
            <article className={styles.card}>
              <h3>Healing Cadence</h3>
              <p>
                Guided rites reawaken community health, focusing on intergenerational repair and
                spiritual continuity.
              </p>
            </article>
            <article className={styles.card}>
              <h3>Cultural Storytelling</h3>
              <p>
                Archives of memory preserve the ceremonies, songs, and sovereign records entrusted
                to the House.
              </p>
            </article>
          </div>
        </section>

        <section className={`${styles.section} ${styles.animate}`} id="enperval">
          <div className={styles.sectionHeader}>
            <h2>Enperval Sovereignité</h2>
            <p>Administrative mission statements and the House of Dorvilus creed.</p>
          </div>
          <div className={styles.creed}>
            <div>
              <h3>Imperial Mission</h3>
              <p>
                Restore sovereign authority through disciplined intelligence, protection of the
                Digital Lakou, and ceremonial governance.
              </p>
            </div>
            <div>
              <h3>House of Dorvilus Creed</h3>
              <p>
                “We carry the flame with integrity. We protect the lineage. We elevate the
                frequency.”
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.animate}`} id="sctivaction">
          <div className={styles.sectionHeader}>
            <h2>Sctivaction</h2>
            <p>Dynamic feed for #PRINS_NAN_SAN and current digital movements.</p>
          </div>
          <div className={styles.feed}>
            {sctivactionFeed.map((item) => (
              <article key={item.title} className={styles.feedItem}>
                <span className={styles.feedTag}>{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;
