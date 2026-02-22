import React, { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LanguageContext } from '../../context/LanguageContext';
import styles from '../../styles/CreateListing.module.css';

const CreateListingInfo = () => {
  const { t } = useContext(LanguageContext);

  return (
    <>
      <Head>
        <title>{t('Create a listing')}</title>
      </Head>
      <main className={styles.page}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{t('Marketplace')}</p>
            <h1>{t('Create a listing that sells')}</h1>
            <p className={styles.subhead}>
              {t('Show buyers exactly why your item is worth their time. Great photos, clear details, and honest pricing build trust fast.')}
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link className={styles.backLink} href="/marketplace">
              {t('Back to Marketplace')}
            </Link>
            <Link className={styles.primaryLink} href="/products">
              {t('Create listing')}
            </Link>
          </div>
        </header>

        <section className={styles.grid}>
          {[
            {
              title: t('Reach active buyers'),
              body: t('Your listing appears in Marketplace discovery, saved searches, and category feeds.'),
              tag: t('Visibility'),
            },
            {
              title: t('Sell with confidence'),
              body: t('Verified seller details, clear pricing, and fast replies lead to quicker sales.'),
              tag: t('Trust'),
            },
            {
              title: t('Manage everything easily'),
              body: t('Track inquiries, update availability, and renew listings from one dashboard.'),
              tag: t('Control'),
            },
          ].map((card) => (
            <article key={card.title} className={styles.card}>
              <span className={styles.tag}>{card.tag}</span>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </section>

        <section className={styles.split}>
          <div className={styles.panel}>
            <h2>{t('What to include')}</h2>
            <ul>
              <li>{t('Clear title with key details (brand, model, size).')}</li>
              <li>{t('3-6 bright photos from different angles.')}</li>
              <li>{t('Accurate price and condition notes.')}</li>
              <li>{t('Pickup location, delivery, or shipping info.')}</li>
              <li>{t('Response time expectations and availability.')}</li>
            </ul>
          </div>
          <div className={styles.panel}>
            <h2>{t('How it works')}</h2>
            <ol>
              <li>{t('Create the listing with photos and details.')}</li>
              <li>{t('Publish to Marketplace for buyers to see.')}</li>
              <li>{t('Reply to messages and arrange pickup or delivery.')}</li>
              <li>{t('Mark as sold when your item is gone.')}</li>
            </ol>
          </div>
        </section>

        <section className={styles.cta}>
          <div>
            <h2>{t('Ready to create a listing?')}</h2>
            <p>{t('Use the listing form to add your product details and publish instantly.')}</p>
          </div>
          <Link className={styles.primaryLink} href="/products">
            {t('Go to add product')}
          </Link>
        </section>
      </main>
    </>
  );
};

export default CreateListingInfo;
