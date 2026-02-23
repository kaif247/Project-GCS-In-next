import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/SovereignHome.module.css';

const engagementOptions = [
  'Educator',
  'Protector',
  'Innovator',
  'Community Architect',
];

const contributionTiers = [
  {
    label: 'Citizen (Free)',
    value: 'Citizen',
    buttonText: 'Authenticate Bloodline (Free)',
    detail: 'Access to the Digital Lakou & basic Sovereign Sigil.',
  },
  {
    label: 'Innovator ($18.49 / mo)',
    value: 'Innovator',
    buttonText: 'Contribute $18.49 & Activate',
    detail: 'Early access to sovereign assets & registry certificate.',
  },
  {
    label: 'Sovereign Founder ($1,849)',
    value: 'Sovereign',
    buttonText: 'Invest $1,849 & Rule',
    detail: 'Founder status, regalia, and council seat.',
  },
];

const pillars = [
  {
    title: "Frekans Grand'Anse",
    text: 'Ancestral memory and high-frequency origins.',
  },
  {
    title: 'San Manman, San Istwa',
    text: "Restoration of Princess Celestine's legacy.",
  },
  {
    title: 'Enperval Sovereignité',
    text: 'Mission and administrative doctrine.',
  },
  {
    title: 'Sctivaction',
    text: 'A dynamic feed for the #PRINS_NAN_SAN movement.',
  },
];

const treasuryItems = [
  {
    title: 'Sovereign Sigil (License)',
    text: 'Digital seal access for verified citizens and innovators.',
  },
  {
    title: 'Imperial Registry Tiers',
    text: 'Citizen, Innovator, and Sovereign Founder pathways.',
  },
  {
    title: 'Physical Regalia (Pre-Order)',
    text: 'Crowned Hare and Rooster ceremonial apparel.',
  },
];

const trinity = [
  {
    name: 'H.S.H. Prince Jean II',
    title: 'Sovereign Architect',
    image: '/reactivated-boukman.svg',
  },
  {
    name: 'H.I.H. Prince Thierry',
    title: 'Imperial Steward',
    image: '/neutral-priest.svg',
  },
  {
    name: 'Cousin Wilson Joseph',
    title: 'Local Foundation',
    image: '/imperial-seal.svg',
  },
];

const roadmapPhases = [
  {
    phase: 'Q1 2026',
    title: 'Registry Activation & Signal Recruitment',
    detail: 'Launch the Registry of Blood and sovereign onboarding.',
    status: 'active',
  },
  {
    phase: 'Q2 2026',
    title: 'Treasury Expansion & DAIC Integration',
    detail: 'Expand sovereign assets and treasury reporting.',
  },
  {
    phase: 'Q3 2026',
    title: 'Groundbreaking: Morn Chandelle Hub',
    detail: 'Begin physical restoration under local governance.',
  },
  {
    phase: 'Q4 2026',
    title: 'Global Node Expansion',
    detail: 'Activate diaspora nodes and annual restoration recap.',
  },
];

const LandingPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    path: engagementOptions[0],
    tier: contributionTiers[0].value,
  });
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [isFooterPulse, setIsFooterPulse] = useState(false);

  const registryEndpoint =
    process.env.NEXT_PUBLIC_REGISTRY_ENDPOINT || '/api/sovereign-registry';

  const canSubmit = useMemo(() => form.name.trim() && form.email.trim(), [form]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const selectedTier =
    contributionTiers.find((tier) => tier.value === form.tier) || contributionTiers[0];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setStatus({ state: 'error', message: 'Please complete all required fields.' });
      return;
    }
    setStatus({ state: 'loading', message: '' });
    try {
      const response = await fetch(registryEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Request failed');
      setStatus({ state: 'success', message: 'Registry received. Welcome.' });
      setForm({
        name: '',
        email: '',
        path: engagementOptions[0],
        tier: contributionTiers[0].value,
      });
    } catch (error) {
      setStatus({ state: 'error', message: 'Submission failed. Please try again.' });
    }
  };

  const vaultPercent = 33;

  return (
    <>
      <Head>
        <title>House of Dorvilus | Sovereign Intelligence & Imperial Restoration</title>
        <meta
          name="description"
          content="Official gateway of the House of Dorvilus. Restoring the Soulouque Legacy through the Digital Lakou and Sovereign Intelligence."
        />
        <meta property="og:image" content="/imperial-seal.svg" />
        <link rel="icon" href="/w%20(1).ico" />
      </Head>
      <div className={styles.page}>
        <nav className={styles.nav}>
          <div className={styles.navInner}>
            <div className={styles.brand}>Global Creole Society</div>
            <div className={styles.navLinks}>
              <a href="/">Home</a>
              <a href="/imperial-treasury">Imperial Treasury</a>
              <a href="#nexus">Nexus</a>
              <a href="#registry">Registry</a>
              <a href="#roadmap">Roadmap</a>
            </div>
          </div>
        </nav>

        <section id="hero" className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Sovereign Restoration V1.2</p>
            <h1 className={styles.heroTitle}>
              The Evolution of the Flame: The House of Dorvilus
            </h1>
            <p className={styles.heroSub}>
              A Natural Transition from the 1791 Spark to 2026 Sovereign
              Intelligence. Ground your frequency in the Digital Lakou.
            </p>
            <div className={styles.heroActions}>
              <a href="#registry" className={styles.btnPrimary}>
                Enter the Registry of Blood
              </a>
              <a href="#vault" className={styles.btnSecondary}>
                View the Treasury Activation
              </a>
            </div>
            <div className={styles.sealRow}>
              <img src="/crowned-hare.svg" alt="Crowned Hare emblem" />
              <span>globalcreolesociety.com</span>
            </div>
          </div>
          <div className={styles.heroSeal}>
            <img
              src="/registry-seal.svg"
              alt="Reactivated Double-Headed Eagle"
              fetchpriority="high"
            />
          </div>
          <div className={styles.heroTriptych}>
            {trinity.map((member) => (
              <div key={member.name} className={styles.triptychCard}>
                <div className={styles.triptychFrame}>
                  <img
                    src={member.image}
                    alt={`${member.name} portrait`}
                    className={styles.triptychImage}
                  />
                  <div className={styles.triptychGlow} aria-hidden="true" />
                </div>
                <div className={styles.triptychMeta}>
                  <span>{member.title}</span>
                  <strong>{member.name}</strong>
                </div>
              </div>
            ))}
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
            <h2 className={styles.sectionTitle}>Registry of Blood</h2>
            <p className={styles.sectionLead}>
              Citizens do not follow. They align their frequency.
            </p>
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
                placeholder="Digital Coordinate"
                value={form.email}
                onChange={handleChange('email')}
                required
              />
              <label className={styles.srOnly} htmlFor="sovereign-path">
                Engagement Path
              </label>
              <select id="sovereign-path" value={form.path} onChange={handleChange('path')}>
                {engagementOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <label className={styles.srOnly} htmlFor="sovereign-tier">
                Sovereign Contribution Tier
              </label>
              <select id="sovereign-tier" value={form.tier} onChange={handleChange('tier')}>
                {contributionTiers.map((tier) => (
                  <option key={tier.value} value={tier.value}>
                    {tier.label}
                  </option>
                ))}
              </select>
              <button type="submit" className={styles.btnPrimary}>
                {status.state === 'loading' ? 'Submitting...' : selectedTier.buttonText}
              </button>
            </form>
            {status.message && (
              <p className={styles.formStatus} role="status">
                {status.message}
              </p>
            )}
            <div className={styles.registrySeal}>
              <div className={styles.registrySealGlow} aria-hidden="true" />
              <img
                src="/registry-seal.svg"
                alt="Dorvilus Coat of Arms - Seal of Authenticity"
                loading="lazy"
              />
              <div className={styles.registrySealText}>
                <span>Seal of Authenticity</span>
                <span className={styles.registryMotto}>Je Renais de mes Cendres</span>
              </div>
              <span className={styles.registryBadge}>
                AUTHENTICATED BLOODLINE | 2026 FREQUENCY
              </span>
            </div>
          </div>
        </section>

        <section id="vault" className={styles.section}>
          <div className={styles.vaultHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Imperial Treasury Activation</h2>
              <p className={styles.sectionLead}>
                The vault is not empty. It is waiting for your energy.
              </p>
            </div>
            <a href="/imperial-treasury" className={styles.btnSecondary}>
              Enter the Treasury
            </a>
          </div>
          <div className={styles.vaultBar}>
            <div className={styles.vaultTrack}>
              <div className={styles.vaultFill} style={{ width: `${vaultPercent}%` }}>
                <span>Treasury Frequency: {vaultPercent}% Activated</span>
              </div>
            </div>
          </div>
          <div className={styles.treasuryGrid}>
            {treasuryItems.map((item) => (
              <div key={item.title} className={styles.treasuryCard}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="financial-vault" className={styles.section}>
          <div className={styles.financialVault}>
            <div>
              <h2 className={styles.sectionTitle}>The Financial Vault</h2>
              <p className={styles.sectionLead}>
                Bridge the Digital Registry with the Imperial Treasury. Paid tiers fund
                the Morn Chandelle Restoration.
              </p>
              <p className={styles.clause}>
                "Your contribution is the liquidity for the Morn Chandelle Restoration
                Fund. We are converting digital currency into physical infrastructure.
                In 1849, we bought our freedom with blood; in 2026, we buy our sovereignty
                with intelligence and capital."
              </p>
            </div>
            <div className={styles.paymentCard}>
              <h3>Accepted Contribution Paths</h3>
              <ul className={styles.paymentList}>
                <li>Stripe / PayPal for $18.49 (Innovator) and $1,849 (Founder).</li>
                <li>Crypto (USDC / ETH) for web3-native citizens.</li>
              </ul>
              <div className={styles.tierStack}>
                {contributionTiers.map((tier) => (
                  <div key={tier.value} className={styles.tierCard}>
                    <strong>{tier.label}</strong>
                    <p>{tier.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="roadmap" className={styles.section}>
          <h2 className={styles.sectionTitle}>Digital Lakou Roadmap 2026</h2>
          <div className={styles.roadmap}>
            {roadmapPhases.map((phase) => (
              <div
                key={phase.phase}
                className={`${styles.roadmapItem} ${
                  phase.status === 'active' ? styles.roadmapActive : ''
                }`}
              >
                <div className={styles.roadmapMarker} />
                <div>
                  <p className={styles.roadmapPhase}>{phase.phase}</p>
                  <h3>{phase.title}</h3>
                  <p>{phase.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.roadmapCta}>
            The timeline of the Empire is written in the blood and intelligence of its
            citizens. Choose your path. Accelerate the Restoration.
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.finalCta}>
            <h2>Join the Sovereign Order.</h2>
            <p>Citizens do not follow. They align.</p>
            <a href="#registry" className={styles.btnPrimary}>
              Enter the Registry
            </a>
          </div>
        </section>

        <footer className={`${styles.footer} ${isFooterPulse ? styles.footerPulse : ''}`}>
          <div className={styles.footerGrid}>
            <div>
              <h4>
                House of{' '}
                <span
                  className={styles.footerName}
                  onMouseEnter={() => setIsFooterPulse(true)}
                  onMouseLeave={() => setIsFooterPulse(false)}
                >
                  Dorvilus
                </span>
              </h4>
              <a href="#hero">Home</a>
              <a href="https://globalcreolesociety.com">globalcreolesociety.com</a>
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
              <h4>Morn Chandelle</h4>
              <p className={styles.footerNote}>
                Administered under the local oversight of the CASEC of Morn Chandelle,
                Gressier.
              </p>
            </div>
          </div>
          <p className={styles.disclaimer}>
            [Financial and legal disclaimer: This analysis is for informational purposes only
            and does not constitute financial, legal, or professional advice. Participation
            in the Registry is a voluntary contribution to a social movement.]
          </p>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
