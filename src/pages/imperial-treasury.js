import React, { useEffect, useState, useContext, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Treasury.module.css';
import landingStyles from '../styles/SovereignHome.module.css';
import InnovatorPortal from '../components/InnovatorPortal';
import MarketplaceCard from '../components/Marketplace/MarketplaceCard';
import FounderActivationAnimation from '../components/FounderActivationAnimation';
import { MarketplaceContext } from '../context/MarketplaceContext';
import ToggleButton from '../components/ToggleButton';

const treasuryAssets = [
  {
    id: 'sovereign-sigil',
    title: 'Sovereign Sigil (Digital License)',
    detail:
      'High-resolution Crowned Hare seal for verified citizens and innovators.',
    actionText: 'Download Sigil License',
    href: '/crowned-hare.svg',
    download: 'Sovereign-Sigil-License.svg',
  },
  {
    id: 'registry-tiers',
    title: 'Imperial Registry Tiers',
    detail: 'Citizen, Innovator, and Sovereign Founder access pathways.',
    actionText: 'Open Registry Tiers',
    href: '/landing#registry',
  },
  {
    id: 'physical-regalia',
    title: 'Physical Regalia (Pre-Order)',
    detail: 'Crowned Hare and Rooster apparel for ceremonial activation.',
    actionText: 'Start Pre-Order',
    href: '/signin',
  },
  {
    id: 'protector-manual',
    title: 'Protector Manual',
    detail: 'Economic fortification doctrine for digital guardians.',
    actionText: 'Download Protector Manual',
    href: '/treasury/protector-manual.txt',
    download: 'Protector-Manual.txt',
  },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function calculateTreasuryFrequency({
  foundersCount,
  unlockCount,
  visitsCount,
  founderAccessGranted,
  ceremonyCount,
}) {
  const base = 18;
  const foundersScore = Math.min(45, foundersCount * 5);
  const unlockScore = Math.min(18, unlockCount * 2);
  const visitsScore = Math.min(7, visitsCount);
  const accessScore = founderAccessGranted ? 8 : 0;
  const ceremonyScore = Math.min(4, ceremonyCount * 2);
  return clamp(
    Math.round(base + foundersScore + unlockScore + visitsScore + accessScore + ceremonyScore),
    5,
    100
  );
}

const ImperialTreasury = () => {
  const heroTitle = 'Vault of Sovereign Intelligence';
  const [showDecree, setShowDecree] = useState(false);
  const [showFounderMoment, setShowFounderMoment] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [vaultPercent, setVaultPercent] = useState(33);
  const [foundersCount, setFoundersCount] = useState(0);
  const [heroTitleIndex, setHeroTitleIndex] = useState(0);
  const [heroTitleDeleting, setHeroTitleDeleting] = useState(false);
  const { products } = useContext(MarketplaceContext);
  const treasuryProducts = useMemo(
    () =>
      products
        .filter(
          (product) =>
            !(
              (product.title === 'Bridal Dress (Heavy Embroidery)' &&
                product.price === 10000 &&
                product.location === 'Manshera') ||
              (product.title === 'Samsung Galaxy S22 Ultra' &&
                product.price === 175000 &&
                product.location === 'Nawabshah')
            )
        )
        .slice(0, 4),
    [products]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const authenticated =
      window.localStorage.getItem('gcs-treasury-authenticated') === '1';
    if (authenticated) {
      setIsAuthenticated(true);
    }
    const seen = window.localStorage.getItem('gcs-treasury-decree');
    if (!seen) {
      setShowDecree(true);
      window.localStorage.setItem('gcs-treasury-decree', '1');
    }
  }, []);

  useEffect(() => {
    const holdFullMs = 1200;
    const holdEmptyMs = 320;
    const typeMs = 58;
    const deleteMs = 34;

    let delay = heroTitleDeleting ? deleteMs : typeMs;
    if (!heroTitleDeleting && heroTitleIndex === heroTitle.length) delay = holdFullMs;
    if (heroTitleDeleting && heroTitleIndex === 0) delay = holdEmptyMs;

    const timer = window.setTimeout(() => {
      if (!heroTitleDeleting && heroTitleIndex === heroTitle.length) {
        setHeroTitleDeleting(true);
        return;
      }
      if (heroTitleDeleting && heroTitleIndex === 0) {
        setHeroTitleDeleting(false);
        return;
      }
      setHeroTitleIndex((prev) => prev + (heroTitleDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [heroTitleDeleting, heroTitleIndex, heroTitle.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateLocalFrequency = (latestFoundersCount = foundersCount) => {
      const visitsCount = Number(window.localStorage.getItem('gcs-treasury-visits') || 0);
      const unlockCount = Number(window.localStorage.getItem('gcs-treasury-unlocks') || 0);
      const ceremonyCount = Number(window.localStorage.getItem('gcs-founder-ceremonies') || 0);
      const founderAccessGranted =
        window.localStorage.getItem('imperialFounderAccess') === 'granted';

      const next = calculateTreasuryFrequency({
        foundersCount: latestFoundersCount,
        unlockCount,
        visitsCount,
        founderAccessGranted,
        ceremonyCount,
      });
      setVaultPercent(next);
    };

    const markVisit = () => {
      const previous = Number(window.localStorage.getItem('gcs-treasury-visits') || 0);
      window.localStorage.setItem('gcs-treasury-visits', String(previous + 1));
    };

    const fetchFounders = async () => {
      try {
        const response = await fetch('/api/imperial-founders');
        if (!response.ok) return;
        const result = await response.json();
        const count = Array.isArray(result.founders) ? result.founders.length : 0;
        setFoundersCount(count);
        updateLocalFrequency(count);
      } catch {
        updateLocalFrequency(foundersCount);
      }
    };

    markVisit();
    updateLocalFrequency(foundersCount);
    fetchFounders();

    const interval = window.setInterval(fetchFounders, 15000);
    const onStorage = () => updateLocalFrequency(foundersCount);
    window.addEventListener('storage', onStorage);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleAuthenticate = () => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      const previous = Number(window.localStorage.getItem('gcs-treasury-unlocks') || 0);
      window.localStorage.setItem('gcs-treasury-unlocks', String(previous + 1));
      window.localStorage.setItem('gcs-treasury-authenticated', '1');
      const visitsCount = Number(window.localStorage.getItem('gcs-treasury-visits') || 0);
      const ceremonyCount = Number(window.localStorage.getItem('gcs-founder-ceremonies') || 0);
      const founderAccessGranted =
        window.localStorage.getItem('imperialFounderAccess') === 'granted';
      setVaultPercent(
        calculateTreasuryFrequency({
          foundersCount,
          unlockCount: previous + 1,
          visitsCount,
          founderAccessGranted,
          ceremonyCount,
        })
      );
    }
    setIsAuthenticated(true);
  };

  const handleFounderActivation = () => {
    if (typeof window !== 'undefined') {
      const previous = Number(window.localStorage.getItem('gcs-founder-ceremonies') || 0);
      window.localStorage.setItem('gcs-founder-ceremonies', String(previous + 1));
      const visitsCount = Number(window.localStorage.getItem('gcs-treasury-visits') || 0);
      const unlockCount = Number(window.localStorage.getItem('gcs-treasury-unlocks') || 0);
      const founderAccessGranted =
        window.localStorage.getItem('imperialFounderAccess') === 'granted';
      setVaultPercent(
        calculateTreasuryFrequency({
          foundersCount,
          unlockCount,
          visitsCount,
          founderAccessGranted,
          ceremonyCount: previous + 1,
        })
      );
    }
    setShowFounderMoment(true);
  };

  const frequencyHz = useMemo(() => 520 + vaultPercent * 6, [vaultPercent]);
  const stabilityLabel = useMemo(() => {
    if (vaultPercent >= 75) return 'High Stability';
    if (vaultPercent >= 50) return 'Stable';
    if (vaultPercent >= 30) return 'Calibrating';
    return 'Boot Sequence';
  }, [vaultPercent]);

  return (
    <>
      <Head>
        <title>House of Dorvilus | Imperial Treasury</title>
        <meta
          name="description"
          content="Imperial Treasury of the House of Dorvilus. Tools for the Restoration."
        />
        <meta property="og:image" content="/imperial-seal.svg" />
        <link rel="icon" href="/crowned-hare.svg" />
      </Head>
      <main className={styles.page}>
        <nav className={landingStyles.nav}>
          <div className={landingStyles.navInner}>
            <div className={landingStyles.navLeft}>
              <div className={landingStyles.brandWrap}>
                <img src="/GCS.png" alt="GCS" className={landingStyles.brandLogo} />
              </div>
            </div>
            <div className={landingStyles.navCenter}>
              <div className={landingStyles.navLinks}>
                <a href="/landing">Home</a>
                <a href="/imperial-treasury">Imperial Treasury</a>
                <a href="/landing#nexus">Nexus</a>
                <a href="/landing#registry">Registry</a>
                <a href="/landing#roadmap">Roadmap</a>
              </div>
            </div>
            <div className={landingStyles.navRight}>
              <a href="/signin" className={landingStyles.navCta}>
                Sign in
              </a>
            </div>
          </div>
        </nav>
        <ToggleButton
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          label="Toggle navigation"
          style={{ top: '55px', zIndex: 1301 }}
        />
        {isSidebarOpen && (
          <button
            type="button"
            className={landingStyles.landingSidebarBackdrop}
            aria-label="Close navigation"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <aside
          className={`${landingStyles.landingSidebarWrap} ${
            isSidebarOpen ? landingStyles.landingSidebarWrapOpen : ''
          }`}
          aria-hidden={!isSidebarOpen}
        >
          <div className={landingStyles.landingSidebar}>
            <a href="/landing" onClick={() => setIsSidebarOpen(false)}>
              Home
            </a>
            <a href="/imperial-treasury" onClick={() => setIsSidebarOpen(false)}>
              Imperial Treasury
            </a>
            <a href="/landing#nexus" onClick={() => setIsSidebarOpen(false)}>
              Nexus
            </a>
            <a href="/landing#registry" onClick={() => setIsSidebarOpen(false)}>
              Registry
            </a>
            <a href="/landing#roadmap" onClick={() => setIsSidebarOpen(false)}>
              Roadmap
            </a>
            <a href="/signin" onClick={() => setIsSidebarOpen(false)}>
              Sign in
            </a>
          </div>
        </aside>

        <div className={styles.contentWrap}>
          <section className={styles.hero}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <p className={styles.eyebrow}>Imperial Treasury</p>
                <h1 className={styles.heroTypewriter} data-fulltext={heroTitle}>
                  <span className={styles.heroTypewriterLive}>
                    {heroTitle.slice(0, heroTitleIndex)}
                    <span className={styles.typeCursor} aria-hidden="true">
                      |
                    </span>
                  </span>
                </h1>
                <p className={styles.subhead}>
                  The vault is not empty. It is a strategic call to action.
                </p>
                <p className={styles.subhead}>
                  Access is free. Items within the Imperial Treasury carry their own cost.
                </p>
                <div className={styles.heroTags}>
                  <span>Treasury Channel</span>
                  <span>Citizen Access</span>
                  <span>Founder Protocol</span>
                </div>
                <div className={styles.heroActions}>
                  <a href="#treasury-assets" className={styles.heroPrimary}>
                    View Treasury Assets
                  </a>
                  <a href="/imperial-founders" className={styles.heroSecondary}>
                    Founders Wall
                  </a>
                </div>
              </div>

              <aside className={styles.heroSignal}>
                <img
                  src="/sacred-antique-key.svg"
                  alt="Sacred Key icon"
                  className={styles.heroKey}
                />
                <div className={styles.heroStats}>
                  <div>
                    <span>Frequency</span>
                    <strong>{vaultPercent}%</strong>
                  </div>
                  <div>
                    <span>Founders</span>
                    <strong>{foundersCount}</strong>
                  </div>
                  <div>
                    <span>Level</span>
                    <strong>{frequencyHz}Hz</strong>
                  </div>
                </div>
              </aside>
            </div>
            <div className={styles.heroFooterLine}>
              <p>
                Frequency Level: {frequencyHz}Hz - {stabilityLabel}
              </p>
              <p>Signal updates every 15 seconds from founder activity and unlock events.</p>
            </div>
          </section>

          <section className={styles.vaultBar}>
            <p className={styles.vaultMeta}>
              Treasury Frequency Activated
            </p>
            <div className={styles.vaultTrack}>
              <div className={styles.vaultFill} style={{ width: `${vaultPercent}%` }}>
                {vaultPercent}%
              </div>
            </div>
          </section>

          <section className={styles.keySection}>
            <div>
              <h2>Sacred Key Access</h2>
              <p>
                The Sacred Antique Key signals entry into the Imperial Treasury. Every
                contribution unlocks new tools for restoration.
              </p>
            </div>
            <img
              src="/sacred-antique-key.svg"
              alt="Sacred Key icon"
              className={styles.keyIcon}
            />
          </section>

          <section className={styles.grid}>
            {treasuryAssets.map((item) => (
              <article key={item.title} className={styles.card}>
                <h2>{item.title}</h2>
                <p>{item.detail}</p>
                {isAuthenticated ? (
                  <a
                    href={item.href}
                    className={`${styles.cardLink} ${styles.cardActive}`}
                    aria-label={`Access ${item.title}`}
                    download={item.download || undefined}
                  >
                    {item.actionText}
                  </a>
                ) : (
                  <button
                    type="button"
                    aria-label={`Authenticate to unlock ${item.title}`}
                    className={styles.cardLocked}
                    onClick={handleAuthenticate}
                  >
                    Authenticate to Unlock
                  </button>
                )}
              </article>
            ))}
          </section>

          <section id="treasury-assets" className={styles.marketplaceSection}>
            <div className={styles.marketplaceHeader}>
              <div>
                <h2>Imperial Treasury Assets</h2>
                <p>Curated marketplace items presented as sovereign offerings.</p>
              </div>
              <Link href="/signin" className={styles.marketplaceLink}>
                See all
              </Link>
            </div>
            <div className={styles.marketplaceSlider} role="region" aria-label="Treasury items">
              {treasuryProducts.map((product) => (
                <div key={product.id} className={styles.marketplaceSlide}>
                  <MarketplaceCard product={product} />
                </div>
              ))}
            </div>
          </section>

          <section className={styles.founderCallout}>
            <div>
              <h3>Sovereign Founder Activation</h3>
              <p>
                The $1,849 covenant triggers a sovereign ceremony and unlocks the Founders
                Wall.
              </p>
            </div>
            <button type="button" onClick={handleFounderActivation}>
              Activate Founder Ceremony
            </button>
          </section>

          <InnovatorPortal />

          <section className={styles.transparency}>
            <h3>Local Governance & Transparency</h3>
            <p>
              Administrative Oversight: Office of the DAIC. Local Foundation: Overseen
              by the CASEC of Morn Chandelle, Gressier. Built upon the Soulouque Legacy
              (1849).
            </p>
          </section>
        </div>

        {showDecree && (
          <div className={styles.decreeOverlay} role="dialog" aria-modal="true">
            <div className={styles.decreeCard}>
              <h3>Sovereign Decree of the Treasury</h3>
              <p>
                The gold of the past has been liquidated into the tools of the future.
                Every enrollment is a digital spark.
              </p>
              <p>
                By decree, access to the vault is granted only to verified contributors
                who uphold the restoration mandate and protect the registry.
              </p>
              <button type="button" onClick={() => setShowDecree(false)}>
                Enter the Vault
              </button>
            </div>
          </div>
        )}

        <FounderActivationAnimation
          show={showFounderMoment}
          onComplete={() => setShowFounderMoment(false)}
        />
      </main>
    </>
  );
};

export default ImperialTreasury;
