import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import useBlockedUsers from '../hooks/useBlockedUsers';
import useFeedPreferences from '../hooks/useFeedPreferences';
import styles from '../styles/Blocking.module.css';

const BlockingPage = () => {
  const { blockedUsers, block, unblock } = useBlockedUsers();
  const { blockUserId, unblockUserId } = useFeedPreferences();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredBlocked = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return blockedUsers;
    return blockedUsers.filter((user) =>
      user.profile_name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value)
    );
  }, [blockedUsers, query]);

  const handleSearch = async () => {
    const value = query.trim();
    if (!value) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    setStatus('');
    try {
      const token = window.localStorage.getItem('gcs-access-token') || '';
      if (!token) throw new Error('Please sign in first.');
      const response = await fetch(`/backend/accounts/search/?q=${encodeURIComponent(value)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Search failed');
      }
      setResults(Array.isArray(data) ? data : data?.results || []);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBlock = async (user) => {
    setStatus('');
    try {
      await block(user);
      blockUserId(user.id);
      setStatus(`${user.profile_name || 'User'} blocked.`);
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleUnblock = async (userId) => {
    setStatus('');
    try {
      await unblock(userId);
      unblockUserId(userId);
      setStatus('User unblocked.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Blocking</title>
      </Head>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Blocking</h1>
            <p>Block users who cause problems. They won’t be able to see or interact with you.</p>
          </div>
          <Link href="/profile" className={styles.backLink}>Back to profile</Link>
        </header>

        <section className={styles.searchRow}>
          <input
            type="text"
            placeholder="Search people by name or email"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </section>

        {status && <div className={styles.notice}>{status}</div>}

        <section className={styles.grid}>
          {(results.length ? results : filteredBlocked).map((user) => {
            const isBlocked = blockedUsers.some((entry) => entry.id === user.id);
            return (
              <article key={user.id} className={styles.card}>
                <img
                  src={user.profile_image || 'https://i.pravatar.cc/120?img=12'}
                  alt={user.profile_name || 'User'}
                />
                <div>
                  <h3>{user.profile_name || 'User'}</h3>
                  <p>{user.email || 'Email hidden'}</p>
                </div>
                <button
                  type="button"
                  className={isBlocked ? styles.secondaryBtn : styles.primaryBtn}
                  onClick={() => (isBlocked ? handleUnblock(user.id) : handleBlock(user))}
                >
                  {isBlocked ? 'Unblock' : 'Block'}
                </button>
              </article>
            );
          })}
          {!results.length && !filteredBlocked.length && (
            <div className={styles.emptyState}>No users found.</div>
          )}
        </section>
      </div>
    </>
  );
};

export default BlockingPage;
