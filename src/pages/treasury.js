import React from 'react';
import Head from 'next/head';
import styles from '../styles/Treasury.module.css';

const categories = [
  { title: 'Regalia', detail: 'Tools for the Restoration' },
  { title: 'Sacred Texts', detail: 'Tools for the Restoration' },
  { title: 'Sovereign Tools', detail: 'Tools for the Restoration' },
];

const TreasuryPage = () => (
  <>
    <Head>
      <title>House of Dorvilus — Imperial Treasury</title>
      <meta
        name="description"
        content="Imperial Treasury of the House of Dorvilus. Tools for the Restoration."
      />
      <link rel="icon" href="/imperial-seal.svg" />
    </Head>
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Imperial Treasury</p>
        <h1>House of Dorvilus Treasury</h1>
        <p className={styles.subhead}>Sacred resources for sovereign restoration.</p>
      </header>
      <section className={styles.grid}>
        {categories.map((item) => (
          <article key={item.title} className={styles.card}>
            <h2>{item.title}</h2>
            <p>{item.detail}</p>
            <button type="button" aria-label={`View ${item.title}`}>
              View {item.title}
            </button>
          </article>
        ))}
      </section>
    </main>
  </>
);

export default TreasuryPage;
