import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/SignIn.module.css';
import landingStyles from '../styles/SovereignHome.module.css';

const SignInPage = () => {
  const [mode, setMode] = useState('signin');
  const [status, setStatus] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus(
      mode === 'signin'
        ? 'Sign in submitted (demo). Connect backend to enable access.'
        : 'Registration submitted (demo). Connect backend to enable access.'
    );
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Sign in | House of Dorvilus</title>
      </Head>
      <div className={styles.page}>
        <nav className={landingStyles.nav}>
          <div className={landingStyles.navInner}>
            <div className={landingStyles.navTop}>
              <div className={landingStyles.brandWrap}>
                <img src="/GCS.png" alt="GCS" className={landingStyles.brandLogo} />
              </div>
              {isMounted && (
                <button
                  type="button"
                  className={landingStyles.navToggle}
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
              className={`${landingStyles.navLinks} ${
                isMounted && isNavOpen ? landingStyles.navLinksOpen : ''
              }`}
            >
              <a href="/landing">Home</a>
              <a href="/landing#nexus">Nexus</a>
              <a href="/landing#registry">Registry</a>
              <a href="/landing#roadmap">Roadmap</a>
              <a href="/signin">Sign in</a>
            </div>
          </div>
        </nav>

        <main className={styles.center}>
          <div className={styles.card}>
            <div className={styles.brandRow}>
              <img src="/GCS.png" alt="GCS" />
              <div>
                <h1>House of Dorvilus</h1>
                <p>Access the Digital Lakou</p>
              </div>
            </div>

            <div className={styles.tabs} role="tablist" aria-label="Sign in or register">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                className={`${styles.tab} ${mode === 'signin' ? styles.tabActive : ''}`}
                onClick={() => setMode('signin')}
              >
                Sign in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
                onClick={() => setMode('register')}
              >
                Register
              </button>
            </div>

            <button type="button" className={styles.googleBtn}>
              Continue with Google
            </button>

            <form className={styles.form} onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label>
                  Full name
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Your full name"
                    required
                  />
                </label>
              )}
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="••••••••"
                  required
                />
              </label>
              <button type="submit" className={styles.submitBtn}>
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            {status && <div className={styles.status}>{status}</div>}
          </div>
        </main>
      </div>
    </>
  );
};

export default SignInPage;
