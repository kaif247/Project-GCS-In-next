import React from 'react';
import Head from 'next/head';
import styles from '../styles/Founders.module.css';

const founders = [
  'Sovereign Founder 001',
  'Sovereign Founder 002',
  'Sovereign Founder 003',
];

const FoundersPage = () => (
  <>
    <Head>
      <title>House of Dorvilus | Imperial Founders</title>
      <meta name="description" content="Sovereign Founder registry wall." />
      <link rel="icon" href="/crowned-hare.svg" />
    </Head>
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Imperial Founders Wall</h1>
        <p>Honoring the Sovereign Founders who activated the vault.</p>
      </header>
      <section className={styles.grid}>
        {founders.map((name) => (
          <div key={name} className={styles.card}>
            {name}
          </div>
        ))}
      </section>
    </main>
  </>
);

export default FoundersPage;
