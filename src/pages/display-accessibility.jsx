import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/DisplayAccessibility.module.css';
import { ThemeContext } from '../context/ThemeContext';

const STORAGE_KEY = 'gcs-display-settings';

const DisplayAccessibility = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [settings, setSettings] = useState({
    textSize: 'medium',
    reduceMotion: false,
    highContrast: false,
    compactMode: false,
    captions: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const applySettings = (next) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${next.textSize}`);
    root.classList.toggle('reduce-motion', next.reduceMotion);
    root.classList.toggle('high-contrast', next.highContrast);
    root.classList.toggle('compact-mode', next.compactMode);
    root.classList.toggle('captions-on', next.captions);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <Head>
        <title>Display & Accessibility</title>
      </Head>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Display & accessibility</h1>
            <p>Adjust how GCS looks and feels for your comfort.</p>
          </div>
          <Link href="/profile" className={styles.backLink}>Back to profile</Link>
        </header>

        <section className={styles.card}>
          <h2>Text size</h2>
          <div className={styles.segmented}>
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                type="button"
                className={`${styles.segmentBtn} ${settings.textSize === size ? styles.segmentActive : ''}`}
                onClick={() => update('textSize', size)}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2>Accessibility</h2>
          <div className={styles.toggleList}>
            <label className={styles.toggleRow}>
              <div>
                <strong>Dark mode</strong>
                <p>Switch between light and dark themes.</p>
              </div>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
            </label>
            <label className={styles.toggleRow}>
              <div>
                <strong>Reduce motion</strong>
                <p>Minimize animations and transitions.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.reduceMotion}
                onChange={(e) => update('reduceMotion', e.target.checked)}
              />
            </label>
            <label className={styles.toggleRow}>
              <div>
                <strong>High contrast</strong>
                <p>Increase contrast for readability.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => update('highContrast', e.target.checked)}
              />
            </label>
            <label className={styles.toggleRow}>
              <div>
                <strong>Compact mode</strong>
                <p>Reduce spacing for dense layouts.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => update('compactMode', e.target.checked)}
              />
            </label>
            <label className={styles.toggleRow}>
              <div>
                <strong>Always show captions</strong>
                <p>Enable captions when available.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.captions}
                onChange={(e) => update('captions', e.target.checked)}
              />
            </label>
          </div>
        </section>
      </div>
    </>
  );
};

export default DisplayAccessibility;
