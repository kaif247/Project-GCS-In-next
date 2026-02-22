import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/HelpCenter.module.css';

const faqItems = [
  {
    title: 'How do I create an account?',
    body: 'Use the Sign Up option on the login screen and fill in your details.',
  },
  {
    title: 'How do I log in?',
    body: 'Open the login screen, enter your email and password, then tap Log In.',
  },
  {
    title: 'How do I reset my password?',
    body: 'Tap “Forgot password?” on the login screen and follow the steps.',
  },
  {
    title: 'How do I edit my profile?',
    body: 'Go to your Profile and select Edit to update your name, bio, and details.',
  },
  {
    title: 'How do I change my profile picture?',
    body: 'Open your Profile and tap your avatar to upload a new photo.',
  },
  {
    title: 'How do I create a post?',
    body: 'Use the post composer on Home. Add text, media, and choose who can see it.',
  },
  {
    title: 'How do I edit or delete a post?',
    body: 'Open the post menu (•••) and choose Edit or Delete.',
  },
  {
    title: 'How do I like or comment on a post?',
    body: 'Tap Like or type your comment in the comment box under a post.',
  },
  {
    title: 'How do I follow or add friends?',
    body: 'Go to Friends and send a request. You can accept or decline requests there.',
  },
  {
    title: 'How do I block someone?',
    body: 'Open the profile menu and choose Blocking to manage blocked users.',
  },
  {
    title: 'How do I use Messenger?',
    body: 'Click the Messenger icon to start or continue conversations.',
  },
  {
    title: 'How do I start a group (society)?',
    body: 'Open Societies and choose Create. Add a name, privacy, and cover image.',
  },
  {
    title: 'How do I post a story?',
    body: 'Go to Stories and choose Create to share a photo or video.',
  },
  {
    title: 'How do I find people or content?',
    body: 'Use the top search bar to find people, posts, or topics.',
  },
  {
    title: 'How do I change my email or phone number?',
    body: 'Go to Account Center > Contact info and follow the update steps.',
  },
  {
    title: 'How do I update my privacy settings?',
    body: 'Go to Account Center and open the privacy section to choose visibility options.',
  },
  {
    title: 'How do I use Marketplace?',
    body: 'Open Marketplace to browse items, message sellers, and manage your cart.',
  },
  {
    title: 'How do I view my orders?',
    body: 'Go to Marketplace > Orders to see your purchase history.',
  },
  {
    title: 'How do I start a livestream?',
    body: 'Go to Live and follow the setup steps to begin streaming.',
  },
  {
    title: 'How do I report a problem?',
    body: 'Go to Help Center and use the support options to report issues.',
  },
  {
    title: 'How do I log out?',
    body: 'Open the profile menu and select Log out.',
  },
];

const HelpCenter = () => {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return faqItems;
    return faqItems.filter((item) => (
      item.title.toLowerCase().includes(value) || item.body.toLowerCase().includes(value)
    ));
  }, [query]);

  return (
    <>
      <Head>
        <title>Help Center</title>
      </Head>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Help</h1>
            <p>Get answers to common questions, learn how to use features, and find support.</p>
          </div>
          <Link href="/profile" className={styles.backLink}>Back to profile</Link>
        </header>

        <section className={styles.searchRow}>
          <input
            type="text"
            placeholder="Search help topics"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button">Search Now</button>
        </section>

        <section className={styles.grid}>
          {results.length ? (
            results.map((item) => (
              <article key={item.title} className={styles.card}>
                <div className={styles.cardTitle}>
                  <span className={styles.icon}>✉</span>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.body}</p>
              </article>
            ))
          ) : (
            <div className={styles.emptyState}>No results found. Try different keywords.</div>
          )}
        </section>
      </div>
    </>
  );
};

export default HelpCenter;
