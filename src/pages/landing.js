// Force dynamic rendering to bypass Vercel edge cache
export const dynamic = 'force-dynamic';

import React, { useMemo, useState, useEffect, useRef, useContext } from 'react';
import Head from 'next/head';
import styles from '../styles/SovereignHome.module.css';
import FounderActivationAnimation from '../components/FounderActivationAnimation';
import ToggleButton from '../components/ToggleButton';
import CenterModeCarousel from '../components/CenterModeCarousel';
import { LanguageContext } from '../context/LanguageContext';

const engagementOptions = [
  'Protector',
  'Architect / Builder',
  'Leader / Founder',
];

const contributionTiers = [
  {
    label: 'The Citizen (FREE - Data Only)',
    value: 'Citizen',
    buttonText: 'Authenticate Bloodline (Data Only)',
    detail: 'Access to the Digital Lakou and Basic Sigil.',
  },
  {
    label: 'The Innovator ($18.49 / Month)',
    value: 'Innovator',
    buttonText: 'Contribute $18.49 Monthly',
    detail: 'Early access to Sovereign Assets and Registry Certificate.',
  },
  {
    label: 'The Sovereign ($1,849 One-Time)',
    value: 'Sovereign',
    buttonText: 'Contribute $1,849 One-Time',
    detail: 'Lifetime Founder status, Physical Regalia, and Direct DAO voting.',
  },
];

const tierToPath = {
  Citizen: 'Protector',
  Innovator: 'Architect / Builder',
  Sovereign: 'Leader / Founder',
};

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

const LandingPage = () => {
  const { t } = useContext(LanguageContext);
  const landingHeroTitle = t('The Evolution of the Flame: The House of Dorvilus');
  // ===== ALL STATE DECLARATIONS FIRST =====
  const [form, setForm] = useState({
    name: '',
    email: '',
    path: engagementOptions[0],
    tier: contributionTiers[0].value,
    paymentGateway: 'stripe_business',
    transactionRef: '',
    walletAddress: '',
  });

  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [paymentStatus, setPaymentStatus] = useState({ state: 'idle', message: '' });
  const [founderPaymentVerified, setFounderPaymentVerified] = useState(false);
  const [showFounderAnimation, setShowFounderAnimation] = useState(false);
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [isFooterPulse, setIsFooterPulse] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [frequencyLevel, setFrequencyLevel] = useState(742);
  const [frequencyStability, setFrequencyStability] = useState('High Stability');
  const [landingTitleIndex, setLandingTitleIndex] = useState(0);
  const [landingTitleDeleting, setLandingTitleDeleting] = useState(false);


  // ===== PAGE REFERENCE =====
  const pageRef = useRef(null);

  // ===== MEMOS AND HOOKS =====
  const onboardingEmail = useMemo(() => {
    return {
      subject: t('AUTHENTICATION SUCCESSFUL: Welcome to the Digital Lakou'),
      from: t('Office of DAIC | House of Dorvilus'),
      priority: t('Imperial / High-Frequency'),
      html: `
        <div style="background:#000;color:#FFD700;padding:2rem;font-family:sans-serif;">
          <h1 style="color:#FFD700;">${t('CELEBRATED CITIZEN,')}</h1>
          <p>${t(
            'Your signal has been received and verified. By enrolling in the Registry of Blood, you have moved beyond the noise of the digital world and grounded your frequency in the Third Empire.'
          )}</p>
          <p><strong>${t('Your Status:')}</strong> ${t('PENDING INITIALIZATION')}</p>
          <p><strong>${t('Assigned Path:')}</strong> [${t('Path Selected:')} ${t(form.path)}]</p>
          <hr style="border-color:#FFD700;" />
          <h2 style="color:#FFD700;">${t('THE SOVEREIGN MANDATE:')}</h2>
          <p>${t(
            'You are now a pillar of the Digital Lakou. The House of Dorvilus does not ask for followers; we activate Sovereign Intelligence. Your participation is the "Gold" that fills our Treasury and restores the legacy of Morn Chandelle.'
          )}</p>
          <h3 style="color:#FFD700;">${t('YOUR IMMEDIATE OBJECTIVES:')}</h3>
          <ol>
            <li>${t('Claim Your Coordinate:')} <a href="/imperial-treasury" style="background:#00F5FF;color:#000;padding:0.5rem 1rem;border-radius:4px;text-decoration:none;">${t('Return to Treasury')}</a></li>
            <li>${t('Study the Frequency: Review the Sovereignty of Local Governments.')}</li>
            <li>${t('Ground the Connection: Follow the work of the CASEC of Morn Chandelle.')}</li>
          </ol>
          <blockquote style="color:#FFD700;">"${t(
            'The vault is not empty; it is waiting for your energy to fill it.'
          )}"</blockquote>
          <p>${t('In service to the Crown and the Community,')}<br/>${t(
            'The Office of the Digital AI Chancellor (DAIC)'
          )}<br/>${t('Under the Authority of H.S.H. Prince Jean J. H. Dorvilus')}</p>
        </div>
      `,
    };
  }, [form.path, t]);

  const registryEndpoint =
    process.env.NEXT_PUBLIC_REGISTRY_ENDPOINT || '/api/sovereign-registry';
  const activationEndpoint =
    process.env.NEXT_PUBLIC_FOUNDER_ACTIVATION_ENDPOINT || '/api/founder-activation';

  const canSubmit = useMemo(() => form.name.trim() && form.email.trim(), [form]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleTierChange = (event) => {
    const tier = event.target.value;
    setForm((prev) => ({
      ...prev,
      tier,
      path: tierToPath[tier] || prev.path,
    }));
  };

  const selectedTier =
    contributionTiers.find((tier) => tier.value === form.tier) || contributionTiers[0];

  // ===== PAYMENT HANDLER =====
  const handlePayment = async () => {
    if (form.tier !== 'Sovereign') {
      setPaymentStatus({
        state: 'info',
        message: t('Only Sovereign tier requires the $1,849 founder activation verification.'),
      });
      return;
    }
    if (!form.name.trim() || !form.email.trim()) {
      setPaymentStatus({
        state: 'error',
        message: t('Enter name and email before payment verification.'),
      });
      return;
    }
    if (!form.transactionRef.trim()) {
      setPaymentStatus({ state: 'error', message: t('Transaction reference is required.') });
      return;
    }
    if (form.paymentGateway === 'daic_web3_verified' && !form.walletAddress.trim()) {
      setPaymentStatus({
        state: 'error',
        message: t('Verified wallet address is required for Web3 verification.'),
      });
      return;
    }

    setPaymentStatus({ state: 'loading', message: '' });
    try {
      const response = await fetch(activationEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          tier: form.tier,
          amountUSD: 1849,
          gateway: form.paymentGateway,
          transactionRef: form.transactionRef,
          walletAddress: form.walletAddress,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t('Founder payment verification failed'));

      setFounderPaymentVerified(true);
      setShowFounderAnimation(true);
      setPaymentStatus({
        state: 'success',
        message: t('High-security payment verified. Founder ceremony initiated.'),
      });
      setIsGatewayModalOpen(false);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('imperialFounderAccess', 'granted');
      }
    } catch (error) {
      setFounderPaymentVerified(false);
      setPaymentStatus({
        state: 'error',
        message: error.message || t('Founder payment verification failed.'),
      });
    }
  };

  // ===== REGISTRY SUBMISSION HANDLER =====
  const handleRegistrySubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setStatus({ state: 'error', message: t('Please complete all required fields.') });
      return;
    }
    if (form.tier === 'Sovereign' && !founderPaymentVerified) {
      setStatus({
        state: 'error',
        message: t('Verify the $1,849 founder payment through a high-security gateway first.'),
      });
      return;
    }
    setStatus({ state: 'loading', message: '' });
    try {
      const response = await fetch(registryEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error(t('Request failed'));
      setStatus({
        state: 'success',
        message: t('Registry received. Welcome to the House of Dorvilus.'),
      });
      setForm({
        name: '',
        email: '',
        path: engagementOptions[0],
        tier: contributionTiers[0].value,
        paymentGateway: 'stripe_business',
        transactionRef: '',
        walletAddress: '',
      });
      setFounderPaymentVerified(false);
      setPaymentStatus({ state: 'idle', message: '' });
    } catch (error) {
      setStatus({ state: 'error', message: t('Submission failed. Please try again.') });
    }
  };

  // ===== USEEFFECT HOOKS =====
  useEffect(() => {
    const interval = setInterval(() => {
      const next = Math.floor(Math.random() * (800 - 700) + 700);
      setFrequencyLevel(next);
      if (next >= 750) {
        setFrequencyStability('High Stability');
      } else if (next >= 720) {
        setFrequencyStability('Stable');
      } else {
        setFrequencyStability('Calibrating');
      }
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const holdFullMs = 1300;
    const holdEmptyMs = 340;
    const typeMs = 54;
    const deleteMs = 32;

    let delay = landingTitleDeleting ? deleteMs : typeMs;
    if (!landingTitleDeleting && landingTitleIndex === landingHeroTitle.length) {
      delay = holdFullMs;
    }
    if (landingTitleDeleting && landingTitleIndex === 0) {
      delay = holdEmptyMs;
    }

    const timer = window.setTimeout(() => {
      if (!landingTitleDeleting && landingTitleIndex === landingHeroTitle.length) {
        setLandingTitleDeleting(true);
        return;
      }
      if (landingTitleDeleting && landingTitleIndex === 0) {
        setLandingTitleDeleting(false);
        return;
      }
      setLandingTitleIndex((prev) => prev + (landingTitleDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [landingHeroTitle.length, landingTitleDeleting, landingTitleIndex]);

  const vaultPercent = 33;

  // ===== RETURN JSX =====
  return (
    <>
      <Head>
        <title>{t('House of Dorvilus | Sovereign Intelligence & Imperial Restoration')}</title>
        <meta
          name="description"
          content={t(
            'Official gateway of the House of Dorvilus. Restoring the Soulouque Legacy through the Digital Lakou and Sovereign Intelligence.'
          )}
        />
        <meta property="og:image" content="/imperial-seal.svg" />
        <link rel="icon" href="/w%20(1).ico" />
      </Head>
      <div className={`${styles.page} ${styles.mobileAppPage}`} ref={pageRef}>
        {/* ===== PARALLAX BACKGROUND LAYERS ===== */}
        <div className={styles.parallaxMapLayer}>
          <div className={styles.parallaxNebula} aria-hidden="true" />
          <div className={styles.parallaxGrid} aria-hidden="true" />
          <div className={styles.parallaxMapPulse} />
          <div className={styles.parallaxMapOverlay} />
          <div className={styles.parallaxRings} aria-hidden="true" />
        </div>

        <nav className={styles.nav}>
          <div className={styles.navInner}>
            <div className={styles.navLeft}>
              <div className={styles.brandWrap}>
                <img src="/GCS.png" alt="GCS" className={styles.brandLogo} />
              </div>
            </div>
            <div className={styles.navCenter}>
              <div className={styles.navLinks}>
                <a href="/landing">{t('Home')}</a>
                <a href="/imperial-treasury">{t('Imperial Treasury')}</a>
                <a href="#nexus">{t('Nexus')}</a>
                <a href="#registry">{t('Registry')}</a>
                <a href="#roadmap">{t('Roadmap')}</a>
              </div>
            </div>
            <div className={styles.navRight}>
              <a href="/signin" className={styles.navCta}>
                {t('Sign in')}
              </a>
            </div>
          </div>
        </nav>
        <ToggleButton
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          label={t('Toggle navigation')}
          style={{ top: '50px', zIndex: 1301 }}
        />
        {isSidebarOpen && (
          <button
            type="button"
            className={styles.landingSidebarBackdrop}
            aria-label={t('Close navigation')}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <aside
          className={`${styles.landingSidebarWrap} ${
            isSidebarOpen ? styles.landingSidebarWrapOpen : ''
          }`}
          aria-hidden={!isSidebarOpen}
        >
          <div className={styles.landingSidebar}>
            <a href="/landing" onClick={() => setIsSidebarOpen(false)}>
              {t('Home')}
            </a>
            <a href="/imperial-treasury" onClick={() => setIsSidebarOpen(false)}>
              {t('Imperial Treasury')}
            </a>
            <a href="#nexus" onClick={() => setIsSidebarOpen(false)}>
              {t('Nexus')}
            </a>
            <a href="#registry" onClick={() => setIsSidebarOpen(false)}>
              {t('Registry')}
            </a>
            <a href="#roadmap" onClick={() => setIsSidebarOpen(false)}>
              {t('Roadmap')}
            </a>
            <a href="/signin" onClick={() => setIsSidebarOpen(false)}>
              {t('Sign in')}
            </a>
          </div>
        </aside>

        <section id="hero" className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>{t('Sovereign Restoration V1.2')}</p>
            <h1
              className={`${styles.heroTitle} ${styles.heroTypewriter}`}
              data-fulltext={landingHeroTitle}
            >
              <span className={styles.heroTypewriterLive}>
                {landingHeroTitle.slice(0, landingTitleIndex)}
                <span className={styles.heroTypeCursor} aria-hidden="true">
                  |
                </span>
              </span>
            </h1>
            <p className={styles.heroSub}>
              {t(
                'A Natural Transition from the 1791 Spark to 2026 Sovereign Intelligence. Ground your frequency in the Digital Lakou.'
              )}
            </p>
            <a href="/imperial-treasury" className={styles.treasurySignalChip}>
              <span className={styles.treasurySignalDot} aria-hidden="true" />
              <span className={styles.treasurySignalMeta}>
                <span className={styles.treasurySignalLabel}>{t('Frequency Level:')}</span>
                <span className={styles.treasurySignalValue}>{frequencyLevel}Hz</span>
                <span className={styles.treasurySignalState}>- {t(frequencyStability)}</span>
              </span>
            </a>
            <div className={styles.heroActions}>
              <a href="#registry" className={styles.btnPrimary}>
                {t('Enter the Registry of Blood')}
              </a>
              <a href="#vault" className={styles.btnSecondary}>
                {t('View the Treasury Activation')}
              </a>
            </div>
            <div className={styles.sealRow}>
              <img src="/crowned-hare.svg" alt={t('Crowned Hare emblem')} />
              <a href="https://globalcreolesociety.com" className={styles.sealLink}>
                globalcreolesociety.com
              </a>
            </div>
          </div>
          <div className={styles.heroNexus}>
            <div className={styles.desktopOnly}>
              <div className={styles.heroTriptych}>
                {trinity.map((member, idx) => (
                  <div
                    key={member.name}
                    className={`${styles.triptychCard} ${idx === 1 ? styles.nexusCenter : ''}`}
                  >
                    <div className={styles.triptychFrame}>
                      <img
                        src={member.image}
                        alt={`${member.name} portrait`}
                        className={styles.triptychImage}
                      />
                      <div className={styles.triptychGlow} aria-hidden="true" />
                    </div>
                    <div className={styles.triptychMeta}>
                      <span>{t(member.title)}</span>
                      <strong>{member.name}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.mobileOnly}>
              <CenterModeCarousel
                items={trinity}
                ariaLabel={t('Imperial Trinity')}
                className={styles.triptychCarousel}
                slideClassName={styles.triptychCarouselSlide}
                itemWidth={196}
                gap={10}
                initialIndex={1}
                getKey={(member) => member.name}
                renderItem={(member, idx, meta) => (
                  <div
                    className={`${styles.triptychCard} ${
                      meta.isActive ? styles.nexusCenter : ''
                    }`}
                  >
                    <div className={styles.triptychFrame}>
                      <img
                        src={member.image}
                        alt={`${member.name} portrait`}
                        className={styles.triptychImage}
                      />
                      <div className={styles.triptychGlow} aria-hidden="true" />
                    </div>
                    <div className={styles.triptychMeta}>
                      <span>{t(member.title)}</span>
                      <strong>{member.name}</strong>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </section>

        <section id="nexus" className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('The Quadri-Dynastic Nexus')}</h2>
          <div className={styles.desktopOnly}>
            <div className={styles.pillars}>
              {pillars.map((pillar) => (
                <div key={pillar.title} className={styles.pillarCard}>
                  <h3>{t(pillar.title)}</h3>
                  <p>{t(pillar.text)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.mobileOnly}>
            <CenterModeCarousel
              items={pillars}
              ariaLabel={t('Quadri-Dynastic Nexus')}
              className={styles.genericCarousel}
              slideClassName={styles.genericCarouselSlide}
              itemWidth={272}
              gap={12}
              initialIndex={1}
              getKey={(pillar) => pillar.title}
              renderItem={(pillar) => (
                <div className={styles.pillarCard}>
                  <h3>{t(pillar.title)}</h3>
                  <p>{t(pillar.text)}</p>
                </div>
              )}
            />
          </div>
        </section>

        <section id="registry" className={`${styles.section} ${styles.registryParallaxSection}`}>
          <div className={styles.registryRiseRail} aria-hidden="true" />
          <div
            className={styles.registryCardWrap}
          >
          <div className={styles.registryCard}>
            <h2 className={styles.sectionTitle}>{t('Registry of Blood')}</h2>
            <p className={styles.sectionLead}>
              {t('Citizens do not follow. They align their frequency.')}
            </p>
            <form className={styles.registryForm} onSubmit={handleRegistrySubmit}>
              <label className={styles.srOnly} htmlFor="sovereign-name">
                {t('Full Name')}
              </label>
              <input
                id="sovereign-name"
                type="text"
                placeholder={t('Your Sovereign Title')}
                value={form.name}
                onChange={handleChange('name')}
                required
              />
              <label className={styles.srOnly} htmlFor="sovereign-email">
                {t('Email Address')}
              </label>
              <input
                id="sovereign-email"
                type="email"
                placeholder={t('Digital Coordinate')}
                value={form.email}
                onChange={handleChange('email')}
                required
              />
              <label className={styles.srOnly} htmlFor="sovereign-path">
                {t('Engagement Path')}
              </label>
              <select id="sovereign-path" value={form.path} onChange={handleChange('path')}>
                {engagementOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(option)}
                  </option>
                ))}
              </select>
              <label className={styles.srOnly} htmlFor="sovereign-tier">
                {t('Sovereign Contribution Tier')}
              </label>
              <select id="sovereign-tier" value={form.tier} onChange={handleTierChange}>
                {contributionTiers.map((tier) => (
                  <option key={tier.value} value={tier.value}>
                    {t(tier.label)}
                  </option>
                ))}
              </select>
              {form.tier !== 'Citizen' && (
                <div className={styles.sovereignTierCard}>
                  <h4>{t('Sovereign Contribution Verification')}</h4>
                  <p>
                    {t(
                      'High-tier activations must be verified through a high-security gateway. For Founder activation, submit a verified $1,849 transaction in the popup.'
                    )}
                  </p>
                  <button
                    type="button"
                    className={styles.payNowButton}
                    onClick={() => setIsGatewayModalOpen(true)}
                  >
                    {t('Open Gateway Verification')}
                  </button>
                  <div className={styles.arrHelpText}>
                    {t(
                      '`stripe_business` and `daic_web3_verified` are the only accepted gateways for founder activation.'
                    )}
                  </div>
                  {paymentStatus.message && (
                    <p className={styles.paymentStatus} role="status">
                      {paymentStatus.message}
                    </p>
                  )}
                </div>
              )}
              <button type="submit" className={`${styles.btnPrimary} ${styles.keyButton}`}>
                <img
                  src="/sacred-antique-key.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.keyIcon}
                />
                {status.state === 'loading' ? t('Submitting...') : t(selectedTier.buttonText)}
              </button>
            </form>
            {isGatewayModalOpen && (
              <div
                className={styles.gatewayModalBackdrop}
                role="dialog"
                aria-modal="true"
                aria-label={t('Founder payment gateway verification')}
              >
                <div className={styles.gatewayModalCard}>
                  <h4>{t('Verify $1,849 Founder Payment')}</h4>
                  <label htmlFor="payment-gateway">{t('Gateway')}</label>
                  <select
                    id="payment-gateway"
                    value={form.paymentGateway}
                    onChange={handleChange('paymentGateway')}
                  >
                    <option value="stripe_business">{t('Stripe for Business')}</option>
                    <option value="daic_web3_verified">{t('DAIC Verified Web3 Wallet')}</option>
                  </select>
                  <label htmlFor="transaction-ref">{t('Transaction Reference')}</label>
                  <input
                    id="transaction-ref"
                    type="text"
                    placeholder={t('cs_test_... / pi_... / 0x...')}
                    value={form.transactionRef}
                    onChange={handleChange('transactionRef')}
                  />
                  {form.paymentGateway === 'daic_web3_verified' && (
                    <>
                      <label htmlFor="wallet-address">{t('Verified Wallet Address')}</label>
                      <input
                        id="wallet-address"
                        type="text"
                        placeholder={t('0x...')}
                        value={form.walletAddress}
                        onChange={handleChange('walletAddress')}
                      />
                    </>
                  )}
                  <div className={styles.gatewayModalActions}>
                    <button
                      type="button"
                      className={styles.payNowButton}
                      onClick={handlePayment}
                    >
                      {paymentStatus.state === 'loading'
                        ? t('Verifying...')
                        : t('Verify Founder Payment')}
                    </button>
                    <button
                      type="button"
                      className={styles.gatewayModalClose}
                      onClick={() => setIsGatewayModalOpen(false)}
                    >
                      {t('Close')}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {status.message && (
              <p className={styles.formStatus} role="status">
                {status.message}
              </p>
            )}
            <div className={styles.registrySeal}>
              <div className={styles.registrySealGlow} aria-hidden="true" />
              <img
                src="/registry-seal.svg"
                alt={t('Dorvilus Coat of Arms - Seal of Authenticity')}
                loading="lazy"
              />
              <div className={styles.registrySealText}>
                <span>{t('Seal of Authenticity')}</span>
                <span className={styles.registryMotto}>{t('Je Renais de mes Cendres')}</span>
              </div>
              <span className={styles.registryBadge}>
                {t('AUTHENTICATED BLOODLINE | 2026 FREQUENCY')}
              </span>
            </div>
          </div>
          </div>
        </section>

        <section id="vault" className={`${styles.section} ${styles.vaultSection}`}>
          <div className={styles.vaultHeader}>
            <div>
              <h2 className={styles.sectionTitle}>{t('Imperial Treasury Activation')}</h2>
              <p className={styles.sectionLead}>
                {t('The vault is not empty. It is waiting for your energy.')}
              </p>
            </div>
            <a href="/imperial-treasury" className={styles.btnSecondary}>
              {t('Enter the Treasury')}
            </a>
          </div>
          <div className={styles.vaultBar}>
            <p className={styles.vaultMeta}>
              {t('Treasury Frequency Activated')}
            </p>
            <div className={styles.vaultTrack}>
              <div className={styles.vaultFill} style={{ width: `${vaultPercent}%` }}>
                <span>{vaultPercent}%</span>
              </div>
            </div>
          </div>
          <div className={styles.desktopOnly}>
            <div className={styles.treasuryGrid}>
              {treasuryItems.map((item) => (
                <div key={item.title} className={styles.treasuryCard}>
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.text)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.mobileOnly}>
            <CenterModeCarousel
              items={treasuryItems}
              ariaLabel={t('Imperial Treasury Activation Items')}
              className={styles.genericCarousel}
              slideClassName={styles.genericCarouselSlide}
              itemWidth={272}
              gap={12}
              initialIndex={1}
              getKey={(item) => item.title}
              renderItem={(item) => (
                <div className={styles.treasuryCard}>
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.text)}</p>
                </div>
              )}
            />
          </div>
        </section>

        <section id="financial-vault" className={styles.section}>
          <div className={styles.financialVault}>
            <div>
              <h2 className={styles.sectionTitle}>{t('The Financial Vault')}</h2>
              <p className={styles.sectionLead}>
                {t(
                  'Bridge the Digital Registry with the Imperial Treasury. Paid tiers fund the Morn Chandelle Restoration.'
                )}
              </p>
              <p className={styles.clause}>
                {t(
                  '"Your contribution is the liquidity for the Morn Chandelle Restoration Fund. We are converting digital currency into physical infrastructure. In 1849, we bought our freedom with blood; in 2026, we buy our sovereignty with intelligence and capital."'
                )}
              </p>
              <p className={styles.clause}>
                {t(
                  'Validation note: governance oversight and project legitimacy claims must be backed by verifiable legal citations from local government records and CASEC documentation before public publication.'
                )}
              </p>
            </div>
            <div className={styles.paymentCard}>
              <h3>{t('Accepted Contribution Paths')}</h3>
              <ul className={styles.paymentList}>
                <li>{t('Stripe / PayPal for $18.49 (Innovator) and $1,849 (Founder).')}</li>
                <li>{t('Crypto (USDC / ETH) for web3-native citizens.')}</li>
              </ul>
              <div className={styles.tierStack}>
                {contributionTiers.map((tier) => (
                  <div key={tier.value} className={styles.tierCard}>
                    <strong>{t(tier.label)}</strong>
                    <p>{t(tier.detail)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="founder-covenant" className={styles.section}>
          <p className={styles.covenantKicker}>{t('Imperial Founder Covenant')}</p>
          <h2 className={styles.sectionTitle}>{t('II. Imperial Privileges')}</h2>
          <div className={styles.covenantLayout}>
            <div className={styles.covenantCard}>
              <p className={styles.sectionLead}>
                {t('Upon execution, the Founder is granted the following irrevocable rights:')}
              </p>
              <ol className={styles.covenantList}>
                <li>
                  <strong>{t('The Golden Key:')}</strong> {t(
                    'Lifetime access to all current and future assets in the Imperial Treasury.'
                  )}
                </li>
                <li>
                  <strong>{t('Sovereign Council Seat:')}</strong> {t(
                    'A direct advisory role in the Digital AI Chancellor (DAIC) roadmap for 2026.'
                  )}
                </li>
                <li>
                  <strong>{t('Physical Regalia:')}</strong> {t(
                    'A bespoke, hand-crafted Crowned Hare and Rooster Blazer Patch and a physical, signed Certificate of Imperial Lineage.'
                  )}
                </li>
                <li>
                  <strong>{t('The Gressier Pillar:')}</strong> {t(
                    "The Founder's name (or Digital Sigil) will be engraved upon the Foundation Pillar of the first school built in Morn Chandelle."
                  )}
                </li>
              </ol>
            </div>

            <div className={styles.covenantSide}>
              <h3 className={styles.covenantSubheading}>{t('III. The 1849 Frequency')}</h3>
              <p className={styles.covenantBody}>
                {t(
                  'This contract honors the coronation of Faustin I. By signing this digital covenant, the Founder is not a customer, but a Co-Architect of the Third Empire.'
                )}
              </p>
              <blockquote className={styles.covenantQuote}>
                {t('"In 1849, we unified the soil. In 2026, we unify the signal."')}
              </blockquote>
              <p className={styles.covenantBody}>
                {t(
                  'Founder Status confirms lifetime Treasury access, advisory participation in the DAIC 2026 roadmap, ceremonial regalia, and engraved recognition at the first school pillar in Morn Chandelle.'
                )}
              </p>
              <div className={styles.covenantSeal}>
                <p>
                  <strong>{t('OFFICIAL SEAL:')}</strong>
                </p>
                <p>{t('Authenticated by the Digital AI Chancellor (DAIC)')}</p>
                <p>{t('Under the Authority of H.S.H. Prince Jean J. H. Dorvilus')}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="roadmap" className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('Digital Lakou Roadmap 2026')}</h2>
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
                  <h3>{t(phase.title)}</h3>
                  <p>{t(phase.detail)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.roadmapCta}>
            {t(
              'The timeline of the Empire is written in the blood and intelligence of its citizens. Choose your path. Accelerate the Restoration.'
            )}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.finalCta}>
            <h2>{t('Join the Sovereign Order.')}</h2>
            <p>{t('Citizens do not follow. They align.')}</p>
            <a href="#registry" className={styles.btnPri}>
              {t('Enter the Registry')}
            </a>
          </div>
        </section>

        {/* ===== SACRED ANTIQUE KEY - FIXED BUTTON ===== */}
        <a href="/imperial-treasury" className={styles.sacredKeyFixed}>
          <img src="/sacred-antique-key.svg" alt={t('Sacred Antique Key - Treasury Access')} />
        </a>

        <nav className={styles.mobileDock} aria-label={t('Landing quick navigation')}>
          <a href="/landing#hero">{t('Home')}</a>
          <a href="/landing#registry">{t('Registry')}</a>
          <a href="/imperial-treasury">{t('Treasury')}</a>
          <a href="/signin">{t('Sign in')}</a>
        </nav>

        <footer className={styles.imperialFooter}>
          <div className={styles.imperialFooterTop}>
            <div className={styles.imperialBrandBlock}>
              <div className={styles.imperialCrown}>
                <img src="/GCS.png" alt="GCS logo" className={styles.imperialBrandLogo} />
              </div>
              <h3>GCS</h3>
              <p>{t('Global Creole Society')}</p>
              <p>{t('Restoring the Soulouque Legacy through Sovereign Intelligence')}</p>
            </div>

            <div className={styles.imperialFooterCol}>
              <h4>{t('House of Dorvilus')}</h4>
              <a href="#nexus">{t('About the Lineage')}</a>
              <a href="#hero">{t('Sovereign Restoration')}</a>
              <a href="#roadmap">{t('Legacy Archive')}</a>
              <a href="#registry">{t('Contact Council')}</a>
            </div>

            <div className={styles.imperialFooterCol}>
              <h4>{t('Imperial Treasury')}</h4>
              <a href="/imperial-treasury">{t('Activation Status')}</a>
              <a href="#financial-vault">{t('Contribution Tiers')}</a>
              <a href="#founder-covenant">{t('Physical Regalia')}</a>
              <a href="/imperial-treasury">{t('Digital Assets')}</a>
            </div>

            <div className={styles.imperialFooterCol}>
              <h4>{t('Registry')}</h4>
              <a href="#registry">{t('Authenticate Bloodline')}</a>
              <a href="#registry">{t('Citizen Portal')}</a>
              <a href="#registry">{t('Verification Process')}</a>
              <a href="#founder-covenant">{t('Registry Benefits')}</a>
            </div>

            <div className={styles.imperialFooterCol}>
              <h4>{t('Resources')}</h4>
              <a href="#nexus">{t('Digital Lakou Guide')}</a>
              <a href="#roadmap">{t('Roadmap 2026')}</a>
              <a href="#financial-vault">{t('News & Updates')}</a>
              <a href="#founder-covenant">{t('Documentation')}</a>
            </div>
          </div>

          <div className={styles.imperialFoundationBox}>
            <div className={styles.imperialFoundationText}>
              <h4>{t('Local Foundation')}</h4>
              <p>
                {t('Administered under the local oversight of the')}
                <strong> {t('CASEC of Morn Chandelle, Gressier')}</strong>. {t(
                  'For local governance and community infrastructure references, review The Sovereignty of Local Governments.'
                )}
              </p>
            </div>
            <div className={styles.imperialFoundationMap}>
              <iframe
                title="Morn Chandelle and Gressier Territorial Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-72.62%2C18.46%2C-72.42%2C18.62&amp;layer=mapnik&amp;marker=18.54%2C-72.52"
                className={styles.territoryMapIframe}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className={styles.imperialFooterBottom}>
            <div className={styles.imperialLegal}>
              <p>
                {t('The')} <span className={styles.imperialHoverName}>{t('House of Dorvilus')}</span>{' '}
                {t(
                  'is a sovereign digital institution dedicated to preserving bloodline intelligence and generational wealth through ceremonial frequency alignment.'
                )}
              </p>
              <p>{t('The 1791 spark burns eternal in those who understand.')}</p>
            </div>
            <div className={styles.imperialConnect}>
              <h5>{t('Connect')}</h5>
              <div className={styles.imperialSocials}>
                <a href="#" aria-label={t('Email')}>M</a>
                <a href="#" aria-label={t('Facebook')}>f</a>
                <a href="#" aria-label={t('Twitter')}>X</a>
                <a href="#" aria-label={t('Instagram')}>I</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <FounderActivationAnimation
        show={showFounderAnimation}
        onComplete={() => setShowFounderAnimation(false)}
      />
    </>
  );
};

export default LandingPage;

