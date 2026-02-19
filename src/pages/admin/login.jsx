import React, { useState } from 'react';
import { useRouter } from 'next/router';

const ADMIN_USER = 'kaif';
const ADMIN_PASS = 'kaif12345';

const AdminLogin = () => {
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
    setError('Invalid credentials');
  };

  return (
    <div className="admin-login">
      <div className="admin-login__bg" aria-hidden="true" />
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <div className="admin-login__badge">ADM</div>
        <h1>Admin Access</h1>
        <p>Restricted control room</p>
        {error && <div className="admin-login__error">{error}</div>}
        <label className="admin-login__label" htmlFor="admin-user">Username</label>
        <input
          id="admin-user"
          className="admin-login__input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          autoComplete="username"
        />
        <label className="admin-login__label" htmlFor="admin-pass">Password</label>
        <input
          id="admin-pass"
          className="admin-login__input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
        />
        <button type="submit" className="admin-login__btn">Sign in</button>
      </form>
    </div>
  );
};

export default AdminLogin;
