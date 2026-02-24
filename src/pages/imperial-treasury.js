import React, { useEffect, useState, useContext, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Treasury.module.css';
import InnovatorPortal from '../components/InnovatorPortal';
import MarketplaceGrid from '../components/Marketplace/MarketplaceGrid';
import MarketplaceCard from '../components/Marketplace/MarketplaceCard';
import { MarketplaceContext } from '../context/MarketplaceContext';

const treasuryAssets = [
  {
    title: 'Sovereign Sigil (Digital License)',
    detail:
      'High-resolution Crowned Hare seal for verified citizens and innovators.',
  },
  {
    title: 'Imperial Registry Tiers',
    detail: 'Citizen, Innovator, and Sovereign Founder access pathways.',
  },
  {
    title: 'Physical Regalia (Pre-Order)',
    detail: 'Crowned Hare and Rooster apparel for ceremonial activation.',
  },
  {
    title: 'Protector Manual',
    detail: 'Economic fortification doctrine for digital guardians.',
  },
];

const ImperialTreasury = () => {
  const [showDecree, setShowDecree] = useState(false);
  const [showFounderMoment, setShowFounderMoment] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { products } = useContext(MarketplaceContext);
  const vaultPercent = 33;
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
    const seen = window.localStorage.getItem('gcs-treasury-decree');
    if (!seen) {
      setShowDecree(true);
      window.localStorage.setItem('gcs-treasury-decree', '1');
    }
  }, []);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
  };

  const handleFounderActivation = () => {
    setShowFounderMoment(true);
    setTimeout(() => setShowFounderMoment(false), 3000);
  };

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
        <header className={styles.header}>
          <p className={styles.eyebrow}>Imperial Treasury</p>
          <h1>Vault of Sovereign Intelligence</h1>
          <p className={styles.subhead}>
            The vault is not empty. It is a strategic call to action.
          </p>
          <p className={styles.subhead}>
            Access is free. Items within the Imperial Treasury carry their own cost.
          </p>
        </header>

        <section className={styles.vaultBar}>
          <div className={styles.vaultTrack}>
            <div className={styles.vaultFill} style={{ width: `${vaultPercent}%` }}>
              TREASURY FREQUENCY: {vaultPercent}% ACTIVATED
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
              <button
                type="button"
                aria-label={`View ${item.title}`}
                className={isAuthenticated ? styles.cardActive : styles.cardLocked}
                onClick={handleAuthenticate}
              >
                {isAuthenticated ? `Download ${item.title}` : 'Authenticate to Unlock'}
              </button>
            </article>
          ))}
        </section>

        <section className={styles.marketplaceSection}>
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

        {showFounderMoment && (
          <div className={styles.founderOverlay} role="dialog" aria-modal="true">
            <div className={styles.founderCard}>
              <div className={styles.founderKey} aria-hidden="true" />
              <p>Sovereign Founder activation confirmed.</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ImperialTreasury;
