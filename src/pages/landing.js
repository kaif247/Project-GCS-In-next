import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/SovereignHome.module.css';

const engagementOptions = [
  'Educator',
  'Protector',
  'Innovator',
  'Community Architect',
];

const pillars = [
  {
    title: "Frekans Grand'Anse",
    text: 'Ancestral memory and high-frequency origins.',
  },
  {
    title: 'San Manman, San Istwa',
    text: 'Restoration of Princess Célestine’s legacy.',
  },
  {
    title: 'Enperval Sovereignité',
    text: 'Mission and administrative doctrine.',
  },
  {
    title: 'Sctivaction',
    text: 'Live digital movements and sovereign dispatches.',
  },
];

const treasuryItems = [
  {
    title: 'Regalia',
    text: 'Ceremonial Regalia — Tools for the Restoration.',
  },
  {
    title: 'Sacred Texts',
    text: 'Sacred Texts — Tools for the Restoration.',
  },
  {
    title: 'Sovereign Tools',
    text: 'Sovereign Tools — Tools for the Restoration.',
  },
];

const LandingPage = () => {
  const [form, setForm] = useState({ name: '', email: '', path: engagementOptions[0] });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const canSubmit = useMemo(() => form.name.trim() && form.email.trim(), [form]);

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
      if (!response.ok) throw new Error('Request failed');
      setStatus({ state: 'success', message: 'Registry received. Welcome.' });
      setForm({ name: '', email: '', path: engagementOptions[0] });
    } catch (error) {
      setStatus({ state: 'error', message: 'Submission failed. Please try again.' });
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
        <link rel="icon" href="/imperial-seal.svg" />
      </Head>
      <div className={styles.page}>
        <nav className={styles.nav}>
          <div className={styles.navInner}>
            <div className={styles.brand}>House of Dorvilus</div>
            <div className={styles.navLinks}>
              <a href="/">Home</a>
              <a href="/imperial-treasury">Imperial Treasury</a>
              <a href="#nexus">Nexus</a>
              <a href="#registry">Registry</a>
              <a href="#signin">Sign In</a>
            </div>
          </div>
        </nav>

        <section id="hero" className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Sovereign Restoration V1.2</p>
            <h1 className={styles.heroTitle}>
              The Evolution of the <span className={styles.heroFlame}>Flame</span>: The House of Dorvilus
            </h1>
            <p className={styles.heroSub}>
              From the 1791 Spark to the 2026 Sovereign Frequency.
              Ground your Street Nobility in the Digital Lakou.
            </p>
            <div className={styles.heroActions}>
              <a
                href="#registry"
                className={styles.btnPrimary}
                aria-label="Enter the Sovereign Registry"
              >
                Enter the Sovereign Registry
              </a>
              <a
                href="#nexus"
                className={styles.btnSecondary}
                aria-label="Explore the Quadri-Dynastic Nexus"
              >
                Explore the Quadri-Dynastic Nexus
              </a>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroFrame}>
              <div className={styles.heroCircuit} aria-hidden="true" />
              <img
                className={styles.heroImage}
                src="/neutral-priest.svg"
                alt="Digital High Priest iconography"
              />
            </div>
          </div>
        </section>

        <section id="nexus" className={styles.section}>
          <h2 className={styles.sectionTitle}>The Quadri-Dynastic Nexus</h2>
          <div className={styles.pillars}>
            {pillars.map((pillar) => (
              <div key={pillar.title} className={styles.pillarCard}>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="registry" className={styles.section}>
          <div className={styles.registryCard}>
            <h2 className={styles.sectionTitle}>Enter the Sovereign Registry</h2>
            <p className={styles.sectionLead}>Citizens do not follow. They align.</p>
            <form className={styles.registryForm} onSubmit={handleSubmit}>
              <label className={styles.srOnly} htmlFor="sovereign-name">
                Full Name
              </label>
              <input
                id="sovereign-name"
                type="text"
                placeholder="Your Sovereign Title"
                value={form.name}
                onChange={handleChange('name')}
                required
              />
              <label className={styles.srOnly} htmlFor="sovereign-email">
                Email Address
              </label>
              <input
                id="sovereign-email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange('email')}
                required
              />
              <label className={styles.srOnly} htmlFor="sovereign-path">
                Engagement Path
              </label>
              <select id="sovereign-path" value={form.path} onChange={handleChange('path')}>
                {engagementOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button type="submit" className={styles.btnPrimary} aria-label="Declare Sovereignty">
                {status.state === 'loading' ? 'Submitting...' : 'Declare Sovereignty'}
              </button>
            </form>
            {status.message && (
              <p className={styles.formStatus} role="status">
                {status.message}
              </p>
            )}
          </div>
        </section>

        <section id="frequency" className={styles.section}>
          <h2 className={styles.sectionTitle}>The Imperial Frequency Expands</h2>
          <div className={styles.imperialSplit}>
            <div className={styles.imperialPanel}>
              <p>
                From the ashes of revolution to the dawn of digital sovereignty, the Flame endures.
                The Imperial Frequency reawakens the power of Lakou, forging street nobility into
                exalted sovereigns.
              </p>
            </div>
            <div className={styles.sigilPanel}>
              <div className={styles.sigil} aria-hidden="true" />
              <p className={styles.sigilCaption}>Imperial signal array — circuit resonance active.</p>
            </div>
          </div>
        </section>

        <section id="enperval" className={styles.section}>
          <h2 className={styles.sectionTitle}>Enperval Sovereignité</h2>
          <div className={styles.dividerGold} />
          <div className={styles.imperialPanel}>
            <p>
              Administrative doctrine, long-term governance vision, and digital sovereignty strategy.
              The House of Dorvilus aligns policy, culture, and restoration into one sovereign continuum.
            </p>
          </div>
        </section>

        <section id="treasury" className={styles.section}>
          <h2 className={styles.sectionTitle}>Imperial Treasury</h2>
          <p className={styles.sectionLead}>Citizens do not follow. They align.</p>
          <div className={styles.treasuryGrid}>
            {treasuryItems.map((item) => (
              <div key={item.title} className={styles.treasuryCard}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.finalCta}>
            <h2>Join the Sovereign Order.</h2>
            <p>Citizens do not follow. They align.</p>
            <a
              href="#registry"
              className={styles.btnPrimary}
              aria-label="Enter the Registry"
            >
              Enter the Registry
            </a>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerGrid}>
            <div>
              <h4>House of Dorvilus</h4>
              <a href="#hero">Home</a>
            </div>
            <div>
              <h4>Quadri-Dynastic Nexus</h4>
              <a href="#nexus">Nexus</a>
            </div>
            <div>
              <h4>Imperial Treasury</h4>
              <a href="/imperial-treasury">Treasury</a>
            </div>
            <div>
              <h4>Sovereign Registry</h4>
              <a href="#registry">Registry</a>
            </div>
            <div>
              <h4>Sctivaction Dispatch</h4>
              <a href="#frequency">Dispatch</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
