// Force dynamic rendering to bypass Vercel edge cache
export const dynamic = 'force-dynamic';

import React, { useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/SovereignHome.module.css';
import TreasuryFrequencyCounter from '../components/TreasuryFrequencyCounter';

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

          {/* ===== PARALLAX BACKGROUND MAP ===== */}
        <div
          className={styles.parallaxMapLayer}
          style={{ transform: `translateY(${mapOffset}px)` }}
        >
          <img
            src="/haiti-gressier-map.svg"
            alt="Map of Haiti - Gressier Region"
            className={styles.parallaxMapImage}
          />
          <div className={styles.parallaxMapOverlay} />
        </div>
const LandingPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    path: engagementOptions[0],
    tier: contributionTiers[0].value,
  });
    // ===== REGISTRY SUBMISSION HANDLER =====
  const handleRegistrySubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
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
      setStatus({ state: 'success', message: 'Registry received. Welcome to the House of Dorvilus.' });
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
  
  // Onboarding email template for auto-responder
  const onboardingEmail = useMemo(() => {
    return {
      subject: 'AUTHENTICATION SUCCESSFUL: Welcome to the Digital Lakou',
      from: 'Office of DAIC | House of Dorvilus',
      priority: 'Imperial / High-Frequency',
      html: `
        <div style="background:#000;color:#FFD700;padding:2rem;font-family:sans-serif;">
          <h1 style="color:#FFD700;">CÈLÈBRE CITIZEN,</h1>
          <p>Your signal has been received and verified. By enrolling in the Registry of Blood, you have moved beyond the noise of the digital world and grounded your frequency in the Third Empire.</p>
          <p><strong>Your Status:</strong> PENDING INITIALIZATION</p>
          <p><strong>Assigned Path:</strong> [Path Selected: ${form.path}]</p>
          <hr style="border-color:#FFD700;" />
          <h2 style="color:#FFD700;">THE SOVEREIGN MANDATE:</h2>
          <p>You are now a pillar of the Digital Lakou. The House of Dorvilus does not ask for followers; we activate Sovereign Intelligence. Your participation is the "Gold" that fills our Treasury and restores the legacy of Morn Chandelle.</p>
          <h3 style="color:#FFD700;">YOUR IMMEDIATE OBJECTIVES:</h3>
          <ol>
            <li>Claim Your Coordinate: <a href="/imperial-treasury" style="background:#00F5FF;color:#000;padding:0.5rem 1rem;border-radius:4px;text-decoration:none;">Return to Treasury</a></li>
            <li>Study the Frequency: Review the Sovereignty of Local Governments.</li>
            <li>Ground the Connection: Follow the work of the CASEC of Morn Chandelle.</li>
          </ol>
          <blockquote style="color:#FFD700;">"The vault is not empty; it is waiting for your energy to fill it."</blockquote>
          <p>In service to the Crown and the Community,<br/>The Office of the Digital AI Chancellor (DAIC)<br/>Under the Authority of H.S.H. Prince Jean J. H. Dorvilus</p>
        </div>
      `,
    };
  }, [form.path]);

  // Payment integration hooks
  const handlePayment = async (tier) => {
    // Placeholder for payment logic
    if (tier === 'Innovator') {
      // Stripe/PayPal integration for $18.49
      alert('Redirecting to payment gateway for Innovator tier ($18.49)...');
    } else if (tier === 'Sovereign') {
      // Stripe/PayPal integration for $1,849 or Web3
      alert('Redirecting to payment gateway for Sovereign Founder tier ($1,849)...');
    } else {
      // Free tier
      alert('Authenticated as Citizen (Free).');
    }
  };


// Inside the LandingPage component, add these state and effect hooks:
const [scrollY, setScrollY] = useState(0);
const [mapOffset, setMapOffset] = useState(0);
const [registryOffset, setRegistryOffset] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const y = window.scrollY;
    setScrollY(y);
    setMapOffset(y * 0.5);  // Map moves at 50% of scroll speed
    setRegistryOffset(Math.min(y * 0.3, 150));  // Registry rises up
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Then in the JSX, add this section (replace your existing registry section):
<>
  {/* Parallax Background Map */}
  <div
    className={styles.parallaxMapLayer}
    style={{ transform: `translateY(${mapOffset}px)` }}
  >
    <img
      src="/haiti-gressier-map.svg"
      alt="Map of Haiti - Gressier Region"
      className={styles.parallaxMapImage}
    />
    <div className={styles.parallaxMapOverlay} />
  </div>

  {/* Registry Section - Rising Effect */}
  <section
    className={styles.registryRisingSection}
    style={{ transform: `translateY(-${registryOffset}px)` }}
  >
    <div className={styles.registryRisingContent}>
      <h2>Registry of Blood</h2>
      <p>Authenticate your coordinate before entering the sacred space.</p>

      <form className={styles.registryForm} onSubmit={handleRegistrySubmit}>
        <input
          type="text"
          placeholder="Your Sovereign Title"
          className={styles.formInput}
          value={form.name}
          onChange={handleChange('name')}
          required
        />
        <input
          type="email"
          placeholder="Your Sacred Email"
          className={styles.formInput}
          value={form.email}
          onChange={handleChange('email')}
          required
        />
        <select
          className={styles.formSelect}
          value={form.path}
          onChange={handleChange('path')}
        >
          {engagementOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <select
          className={styles.formSelect}
          value={form.tier}
          onChange={handleChange('tier')}
        >
          {contributionTiers.map((tier) => (
            <option key={tier.value} value={tier.value}>
              {tier.label}
            </option>
          ))}
        </select>
        <button type="submit" className={styles.submitBtn}>
          Enter the Registry
        </button>
      </form>

      <div className={styles.registryFooter}>
        <img src="/registry-seal.svg" alt="Seal of Authenticity" />
        <p>Je Renais de mes Cendres</p>
      </div>
    </div>
  </section>


         {/* ===== SACRED ANTIQUE KEY - FIXED BUTTON ===== */}
        <a href="/imperial-treasury" className={styles.sacredKeyFixed}>
          <img src="/sacred-antique-key.svg" alt="Sacred Antique Key - Treasury Access" />
        </a>
</>
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [isFooterPulse, setIsFooterPulse] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);


  const registryEndpoint =
    process.env.NEXT_PUBLIC_REGISTRY_ENDPOINT || '/api/sovereign-registry';

  const canSubmit = useMemo(() => form.name.trim() && form.email.trim(), [form]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const selectedTier =
    contributionTiers.find((tier) => tier.value === form.tier) || contributionTiers[0];

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
            <div className={styles.navTop}>
              <div className={styles.brandWrap}>
                <img src="/GCS.png" alt="GCS" className={styles.brandLogo} />
              </div>
              {isMounted && (
                <button
                  type="button"
                  className={styles.navToggle}
                  aria-label="Toggle navigation"
                  aria-expanded={isNavOpen}
                  onClick={() => setIsNavOpen((prev) => !prev)}
                >
                  <span />
                  <span />
                  <span />
                </button>
              )}
            </div>
        <div
  className={`${styles.navLinks} ${
    isMounted && isNavOpen ? styles.navLinksOpen : ''
  }`}
>
  <a href="/landing">Home</a>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <a href="/imperial-treasury">Imperial Treasury</a>
    <TreasuryFrequencyCounter />
  </div>
  <a href="#nexus">Nexus</a>
  <a href="#registry">Registry</a>
  <a href="#roadmap">Roadmap</a>
  <a href="/signin">Sign in</a>
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
              <a href="https://globalcreolesociety.com" className={styles.sealLink}>
                globalcreolesociety.com
              </a>
            </div>
          </div>
          <div className={styles.heroSeal}>
            <img
              src="/landing page.svg"
              alt="Landing page emblem"
              fetchpriority="high"
            />
          </div>
        </section>

        <section className={styles.triptychSection}>
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
              <button type="submit" className={`${styles.btnPrimary} ${styles.keyButton}`}>
                <img
                  src="/sacred-antique-key.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.keyIcon}
                />
                {status.state === 'loading' ? 'Submitting...' : selectedTier.buttonText}
              </button>
              {/* Payment button for paid tiers */}
              {(form.tier === 'Innovator' || form.tier === 'Sovereign') && (
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => handlePayment(form.tier)}
                  style={{ background: form.tier === 'Sovereign' ? '#000' : '#00F5FF', color: form.tier === 'Sovereign' ? '#FFD700' : '#000' }}
                >
                  {form.tier === 'Innovator' ? 'Pay $18.49 (Stripe/PayPal/Crypto)' : 'Pay $1,849 (Stripe/PayPal/Crypto)'}
                </button>
              )}
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
            <a href="#registry" className={styles.btnPri}>
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
