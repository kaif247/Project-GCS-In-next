import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { LanguageContext } from '../../context/LanguageContext';

const ADMIN_USER = 'kaif';
const ADMIN_PASS = 'kaif12345';

const AdminLogin = () => {
  const { t } = useContext(LanguageContext);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
      window.localStorage.setItem('admin-auth', 'true');
      router.push('/admin');
      return;
    }
    setError(t('Invalid credentials'));
  };

  return (
    <div className="admin-login">
      <div className="admin-login__bg" aria-hidden="true" />
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <div className="admin-login__badge">ADM</div>
        <h1>{t('Admin Access')}</h1>
        <p>{t('Restricted control room')}</p>
        {error && <div className="admin-login__error">{error}</div>}
        <label className="admin-login__label" htmlFor="admin-user">{t('Username')}</label>
        <input
          id="admin-user"
          className="admin-login__input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('Enter username')}
          autoComplete="username"
        />
        <label className="admin-login__label" htmlFor="admin-pass">{t('Password')}</label>
        <input
          id="admin-pass"
          className="admin-login__input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('Enter password')}
          autoComplete="current-password"
        />
        <button type="submit" className="admin-login__btn">{t('Sign in')}</button>
      </form>
    </div>
  );
};

export default AdminLogin;
