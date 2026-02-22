import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Feedback.module.css';

const STORAGE_KEY = 'gcs-feedback';

const FeedbackPage = () => {
  const [form, setForm] = useState({
    type: 'Suggestion',
    rating: '5',
    message: '',
    email: '',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setForm((prev) => ({ ...prev, email: saved.email || '' }));
      }
    } catch {
      // ignore
    }
  }, []);

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.message.trim()) {
      setStatus('Please describe your feedback.');
      return;
    }
    const entry = {
      ...form,
      createdAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : {};
      const history = Array.isArray(existing.history) ? existing.history : [];
      const next = { email: form.email, history: [entry, ...history].slice(0, 25) };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    setStatus('Thanks! Your feedback has been saved.');
    setForm((prev) => ({ ...prev, message: '' }));
  };

  return (
    <>
      <Head>
        <title>Give Feedback</title>
      </Head>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Give feedback</h1>
            <p>Share ideas, report issues, or tell us what’s working.</p>
          </div>
          <Link href="/profile" className={styles.backLink}>Back to profile</Link>
        </header>

        <section className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Feedback type
              <select value={form.type} onChange={update('type')}>
                <option>Suggestion</option>
                <option>Bug</option>
                <option>Safety</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Rating
              <select value={form.rating} onChange={update('rating')}>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Okay</option>
                <option value="2">2 - Needs work</option>
                <option value="1">1 - Poor</option>
              </select>
            </label>

            <label className={styles.fullWidth}>
              Your feedback
              <textarea
                rows={5}
                value={form.message}
                onChange={update('message')}
                placeholder="Tell us what you love or what needs fixing..."
              />
            </label>

            <label className={styles.fullWidth}>
              Contact email (optional)
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@email.com"
              />
            </label>

            <div className={styles.actions}>
              <button type="submit">Send feedback</button>
            </div>
            {status && <div className={styles.notice}>{status}</div>}
          </form>
        </section>
      </div>
    </>
  );
};

export default FeedbackPage;
