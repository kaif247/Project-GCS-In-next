import React, { useMemo, useState, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/SignIn.module.css';
import landingStyles from '../styles/SovereignHome.module.css';
import ToggleButton from '../components/ToggleButton';
import { LanguageContext } from '../context/LanguageContext';

const SignInPage = () => {
  const { t } = useContext(LanguageContext);
  const router = useRouter();
  const [mode, setMode] = useState('signin');
  const [status, setStatus] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const nextPath = useMemo(() => {
    const raw = router.query?.next;
    const candidate = Array.isArray(raw) ? raw[0] : raw;
    if (typeof candidate !== 'string') return '/imperial-treasury';
    if (!candidate.startsWith('/') || candidate.startsWith('//')) {
      return '/imperial-treasury';
    }
    return candidate;
  }, [router.query]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const message =
      mode === 'signin'
        ? t('Sign in submitted (demo). Connect backend to enable access.')
        : t('Registration submitted (demo). Connect backend to enable access.');
    setStatus(message);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('gcs-society-auth', '1');
    }
    router.push(nextPath);
  };

  return (
    <>
      <Head>
        <title>{t('Sign in | House of Dorvilus')}</title>
      </Head>
      <div className={`${styles.page} ${styles.mobileAppPage}`}>
        <nav className={landingStyles.nav}>
          <div className={landingStyles.navInner}>
            <div className={landingStyles.navLeft}>
              <div className={landingStyles.brandWrap}>
                <img src="/GCS.png" alt="GCS" className={landingStyles.brandLogo} />
              </div>
            </div>
            <div className={landingStyles.navCenter}>
              <div className={landingStyles.navLinks}>
                <a href="/landing">{t('Home')}</a>
                <a href="/imperial-treasury">{t('Imperial Treasury')}</a>
                <a href="/landing#nexus">{t('Nexus')}</a>
                <a href="/landing#registry">{t('Registry')}</a>
                <a href="/landing#roadmap">{t('Roadmap')}</a>
              </div>
            </div>
            <div className={landingStyles.navRight}>
              <a href="/signin" className={landingStyles.navCta}>
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
            className={landingStyles.landingSidebarBackdrop}
            aria-label={t('Close navigation')}
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
              {t('Home')}
            </a>
            <a href="/imperial-treasury" onClick={() => setIsSidebarOpen(false)}>
              {t('Imperial Treasury')}
            </a>
            <a href="/landing#nexus" onClick={() => setIsSidebarOpen(false)}>
              {t('Nexus')}
            </a>
            <a href="/landing#registry" onClick={() => setIsSidebarOpen(false)}>
              {t('Registry')}
            </a>
            <a href="/landing#roadmap" onClick={() => setIsSidebarOpen(false)}>
              {t('Roadmap')}
            </a>
            <a href="/signin" onClick={() => setIsSidebarOpen(false)}>
              {t('Sign in')}
            </a>
          </div>
        </aside>

        <main className={styles.center}>
          <div className={styles.card}>
            <div className={styles.brandRow}>
              <img src="/GCS.png" alt="GCS" />
              <div>
                <h1>{t('House of Dorvilus')}</h1>
                <p>{t('Access the Digital Lakou')}</p>
              </div>
            </div>

            <div className={styles.tabs} role="tablist" aria-label={t('Sign in or register')}>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                className={`${styles.tab} ${mode === 'signin' ? styles.tabActive : ''}`}
                onClick={() => setMode('signin')}
              >
                {t('Sign in')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
                onClick={() => setMode('register')}
              >
                {t('Register')}
              </button>
            </div>

            <button type="button" className={styles.googleBtn}>
              {t('Continue with Google')}
            </button>

            <form className={styles.form} onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label>
                  {t('Full name')}
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder={t('Your full name')}
                    required
                  />
                </label>
              )}
              <label>
                {t('Email')}
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder={t('you@example.com')}
                  required
                />
              </label>
              <label>
                {t('Password')}
                <input
                  type="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="••••••••"
                  required
                />
              </label>
              <button type="submit" className={styles.submitBtn}>
                {mode === 'signin' ? t('Sign in') : t('Create account')}
              </button>
            </form>

            {status && <div className={styles.status}>{status}</div>}
          </div>
        </main>

        <nav className={landingStyles.mobileDock} aria-label={t('Sign in quick navigation')}>
          <a href="/landing">{t('Home')}</a>
          <a href="/landing#registry">{t('Registry')}</a>
          <a href="/imperial-treasury">{t('Treasury')}</a>
          <a href="/signin">{t('Sign in')}</a>
        </nav>
      </div>
    </>
  );
};

export default SignInPage;
