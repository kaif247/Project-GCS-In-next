import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Logout.module.css';

const LogoutPage = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (typeof window === 'undefined') return;
    setLoading(true);
    setStatus('');
    const access = window.localStorage.getItem('gcs-access-token') || '';
    const refresh = window.localStorage.getItem('gcs-refresh-token') || '';
    try {
      if (access) {
        await fetch('/backend/accounts/logout/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh }),
        });
      }
      window.localStorage.removeItem('gcs-access-token');
      window.localStorage.removeItem('gcs-refresh-token');
      setStatus('You are logged out.');
    } catch (error) {
      setStatus('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Log out</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.card}>
          <h1>Log out</h1>
          <p>Are you sure you want to log out of your account?</p>
          <div className={styles.actions}>
            <button type="button" onClick={handleLogout} disabled={loading}>
              {loading ? 'Logging out...' : 'Log out'}
            </button>
            <Link href="/profile" className={styles.secondaryBtn}>Cancel</Link>
          </div>
          {status && <div className={styles.notice}>{status}</div>}
        </div>
      </div>
    </>
  );
};

export default LogoutPage;
