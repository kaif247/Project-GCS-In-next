import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LanguageContext } from '../context/LanguageContext';
import styles from '../styles/AccountCenter.module.css';

const ACCESS_TOKEN_KEY = 'gcs-access-token';
const REFRESH_TOKEN_KEY = 'gcs-refresh-token';

const apiFetch = async (path, { method = 'GET', body, token } = {}) => {
  const headers = {};
  let payload = undefined;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const response = await fetch(path, {
    method,
    headers,
    body: payload,
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const message = data?.error || data?.message || 'Request failed';
    const details = data && typeof data === 'object' ? data : null;
    throw new Error(`${message}${details ? `: ${JSON.stringify(details)}` : ''}`);
  }

  return data;
};

const AccountCenter = () => {
  const { t } = useContext(LanguageContext);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginStatus, setLoginStatus] = useState('');

  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    profile_name: '',
    description: '',
    website: '',
    phone_number: '',
    gender: '',
    date_of_birth: '',
  });
  const [profileStatus, setProfileStatus] = useState('');

  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '' });
  const [passwordStatus, setPasswordStatus] = useState('');

  const [otpStatus, setOtpStatus] = useState('');
  const [changeEmailForm, setChangeEmailForm] = useState({ new_email: '', password: '', code: '' });
  const [changePhoneForm, setChangePhoneForm] = useState({ new_phone_number: '', password: '', code: '' });
  const [contactStatus, setContactStatus] = useState('');

  const [addEmailForm, setAddEmailForm] = useState({ email: '', password: '', code: '' });
  const [addPhoneForm, setAddPhoneForm] = useState({ phone_number: '', password: '', code: '' });
  const [extrasStatus, setExtrasStatus] = useState('');

  const [lockStatus, setLockStatus] = useState('');

  const isAuthed = useMemo(() => !!accessToken, [accessToken]);

  const loadProfile = useCallback(async (token) => {
    const data = await apiFetch('/backend/accounts/profile/', { token });
    setProfile(data);
    setProfileForm({
      profile_name: data.profile_name || '',
      description: data.description || '',
      website: data.website || '',
      phone_number: data.phone_number || '',
      gender: data.gender || '',
      date_of_birth: data.date_of_birth || '',
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedAccess = window.localStorage.getItem(ACCESS_TOKEN_KEY) || '';
    const storedRefresh = window.localStorage.getItem(REFRESH_TOKEN_KEY) || '';
    if (storedAccess) setAccessToken(storedAccess);
    if (storedRefresh) setRefreshToken(storedRefresh);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    loadProfile(accessToken).catch((error) => {
      setProfileStatus(error.message);
    });
  }, [accessToken, loadProfile]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginStatus('');
    try {
      const data = await apiFetch('/backend/accounts/login/', {
        method: 'POST',
        body: loginForm,
      });
      const nextAccess = data?.tokens?.access || '';
      const nextRefresh = data?.tokens?.refresh || '';
      if (!nextAccess) throw new Error('No access token returned');
      setAccessToken(nextAccess);
      setRefreshToken(nextRefresh);
      window.localStorage.setItem(ACCESS_TOKEN_KEY, nextAccess);
      if (nextRefresh) {
        window.localStorage.setItem(REFRESH_TOKEN_KEY, nextRefresh);
      }
      setLoginStatus('Signed in successfully.');
      await loadProfile(nextAccess);
    } catch (error) {
      setLoginStatus(error.message);
    }
  };

  const handleLogout = async () => {
    setLoginStatus('');
    try {
      if (accessToken) {
        await apiFetch('/backend/accounts/logout/', {
          method: 'POST',
          token: accessToken,
        });
      }
    } catch (error) {
      setLoginStatus(error.message);
    } finally {
      setAccessToken('');
      setRefreshToken('');
      setProfile(null);
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    if (!accessToken) {
      setProfileStatus('Sign in first to update your profile.');
      return;
    }
    setProfileStatus('');
    try {
      const data = await apiFetch('/backend/accounts/profile/', {
        method: 'PATCH',
        token: accessToken,
        body: profileForm,
      });
      setProfile(data);
      setProfileStatus('Profile updated.');
    } catch (error) {
      setProfileStatus(error.message);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (!accessToken) {
      setPasswordStatus('Sign in first to change your password.');
      return;
    }
    setPasswordStatus('');
    try {
      await apiFetch('/backend/accounts/change-password/', {
        method: 'POST',
        token: accessToken,
        body: passwordForm,
      });
      setPasswordForm({ old_password: '', new_password: '' });
      setPasswordStatus('Password updated.');
    } catch (error) {
      setPasswordStatus(error.message);
    }
  };

  const handleSendOtp = async () => {
    if (!accessToken) {
      setOtpStatus('Sign in first to request an OTP.');
      return;
    }
    setOtpStatus('');
    try {
      await apiFetch('/backend/accounts/send-otp/', {
        method: 'POST',
        token: accessToken,
      });
      setOtpStatus('OTP sent to your primary email.');
    } catch (error) {
      setOtpStatus(error.message);
    }
  };

  const handleChangeEmail = async (event) => {
    event.preventDefault();
    if (!accessToken) {
      setContactStatus('Sign in first to change your email.');
      return;
    }
    setContactStatus('');
    try {
      await apiFetch('/backend/accounts/change-email/', {
        method: 'POST',
        token: accessToken,
        body: changeEmailForm,
      });
      setChangeEmailForm({ new_email: '', password: '', code: '' });
      setContactStatus('Email updated.');
      await loadProfile(accessToken);
    } catch (error) {
      setContactStatus(error.message);
    }
  };

  const handleChangePhone = async (event) => {
    event.preventDefault();
    if (!accessToken) {
      setContactStatus('Sign in first to change your phone number.');
      return;
    }
    setContactStatus('');
    try {
      await apiFetch('/backend/accounts/change-phone-number/', {
        method: 'POST',
        token: accessToken,
        body: changePhoneForm,
      });
      setChangePhoneForm({ new_phone_number: '', password: '', code: '' });
      setContactStatus('Phone number updated.');
      await loadProfile(accessToken);
    } catch (error) {
      setContactStatus(error.message);
    }
  };

  const handleAddEmail = async (event) => {
    event.preventDefault();
    if (!accessToken) {
      setExtrasStatus('Sign in first to add an email.');
      return;
    }
    setExtrasStatus('');
    try {
      await apiFetch('/backend/accounts/add-email/', {
        method: 'POST',
        token: accessToken,
        body: addEmailForm,
      });
      setAddEmailForm({ email: '', password: '', code: '' });
      setExtrasStatus('Extra email added.');
      await loadProfile(accessToken);
    } catch (error) {
      setExtrasStatus(error.message);
    }
  };

  const handleAddPhone = async (event) => {
    event.preventDefault();
    if (!accessToken) {
      setExtrasStatus('Sign in first to add a phone number.');
      return;
    }
    setExtrasStatus('');
    try {
      await apiFetch('/backend/accounts/add-phone-number/', {
        method: 'POST',
        token: accessToken,
        body: addPhoneForm,
      });
      setAddPhoneForm({ phone_number: '', password: '', code: '' });
      setExtrasStatus('Extra phone number added.');
      await loadProfile(accessToken);
    } catch (error) {
      setExtrasStatus(error.message);
    }
  };

  const handleDeleteExtra = async (type, id) => {
    if (!accessToken) {
      setExtrasStatus('Sign in first to manage extra contacts.');
      return;
    }
    setExtrasStatus('');
    try {
      const path = type === 'email'
        ? `/backend/accounts/delete-email/${id}/`
        : `/backend/accounts/delete-phone-number/${id}/`;
      await apiFetch(path, { method: 'DELETE', token: accessToken });
      setExtrasStatus('Removed.');
      await loadProfile(accessToken);
    } catch (error) {
      setExtrasStatus(error.message);
    }
  };

  const handleToggleLock = async () => {
    if (!accessToken) {
      setLockStatus('Sign in first to change lock settings.');
      return;
    }
    setLockStatus('');
    try {
      const data = await apiFetch('/backend/accounts/profile-lock/', {
        method: 'POST',
        token: accessToken,
      });
      setLockStatus(data?.message || 'Updated.');
      await loadProfile(accessToken);
    } catch (error) {
      setLockStatus(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Account Center</title>
      </Head>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{t('Account Center')}</p>
            <h1>Control your identity, security, and connected experiences.</h1>
            <p className={styles.subhead}>
              Manage profile details, security, contact info, and linked services from one place.
            </p>
          </div>
          <Link href="/profile" className={styles.backLink}>Back to profile</Link>
        </header>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Sign in & tokens</h2>
              <p>Use your backend account to enable Account Center actions.</p>
            </div>
            <span className={isAuthed ? styles.statusOk : styles.statusWarn}>
              {isAuthed ? 'Connected' : 'Not connected'}
            </span>
          </div>
          <div className={styles.gridTwo}>
            <form className={styles.formBlock} onSubmit={handleLogin}>
              <label>
                Email
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="you@email.com"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="••••••••"
                />
              </label>
              <div className={styles.actions}>
                <button type="submit">Sign in</button>
                <button type="button" className={styles.secondaryBtn} onClick={handleLogout}>Sign out</button>
              </div>
              {loginStatus && <div className={styles.notice}>{loginStatus}</div>}
            </form>

            <div className={styles.tokenBlock}>
              <label>
                Access token
                <input
                  type="text"
                  value={accessToken}
                  onChange={(event) => setAccessToken(event.target.value)}
                  placeholder="Paste JWT access token"
                />
              </label>
              <label>
                Refresh token
                <input
                  type="text"
                  value={refreshToken}
                  onChange={(event) => setRefreshToken(event.target.value)}
                  placeholder="Optional refresh token"
                />
              </label>
              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={() => {
                    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                    if (refreshToken) {
                      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
                    }
                    setLoginStatus('Tokens saved locally.');
                  }}
                >
                  Save tokens
                </button>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => {
                    setAccessToken('');
                    setRefreshToken('');
                    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
                    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Profile info</h2>
              <p>Update public details and the basics of your account.</p>
            </div>
            <span className={styles.tag}>Backend</span>
          </div>
          <form className={styles.formGrid} onSubmit={handleProfileSave}>
            <label>
              Name
              <input
                type="text"
                value={profileForm.profile_name}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, profile_name: event.target.value }))}
              />
            </label>
            <label>
              Website
              <input
                type="text"
                value={profileForm.website}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, website: event.target.value }))}
              />
            </label>
            <label>
              Phone number
              <input
                type="text"
                value={profileForm.phone_number}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, phone_number: event.target.value }))}
              />
            </label>
            <label>
              Gender
              <input
                type="text"
                value={profileForm.gender}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, gender: event.target.value }))}
              />
            </label>
            <label>
              Date of birth
              <input
                type="date"
                value={profileForm.date_of_birth || ''}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, date_of_birth: event.target.value }))}
              />
            </label>
            <label className={styles.fullWidth}>
              Bio
              <textarea
                rows={3}
                value={profileForm.description}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </label>
            <div className={styles.actions}>
              <button type="submit">Save profile</button>
            </div>
            {profileStatus && <div className={styles.notice}>{profileStatus}</div>}
          </form>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Security</h2>
              <p>Change your password and protect your profile visibility.</p>
            </div>
            <span className={styles.tag}>Backend</span>
          </div>
          <div className={styles.gridTwo}>
            <form className={styles.formBlock} onSubmit={handlePasswordChange}>
              <label>
                Current password
                <input
                  type="password"
                  value={passwordForm.old_password}
                  onChange={(event) => setPasswordForm((prev) => ({ ...prev, old_password: event.target.value }))}
                />
              </label>
              <label>
                New password
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(event) => setPasswordForm((prev) => ({ ...prev, new_password: event.target.value }))}
                />
              </label>
              <div className={styles.actions}>
                <button type="submit">Update password</button>
              </div>
              {passwordStatus && <div className={styles.notice}>{passwordStatus}</div>}
            </form>

            <div className={styles.formBlock}>
              <div className={styles.lockCard}>
                <h3>Profile lock</h3>
                <p>
                  When enabled, only approved connections can see your full profile.
                </p>
                <button type="button" onClick={handleToggleLock}>
                  {profile?.profile_lock ? 'Unlock profile' : 'Lock profile'}
                </button>
                {lockStatus && <div className={styles.notice}>{lockStatus}</div>}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Contact info</h2>
              <p>Manage your primary email and phone number. OTP is required.</p>
            </div>
            <span className={styles.tag}>Backend</span>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={handleSendOtp}>Send OTP to primary email</button>
            {otpStatus && <div className={styles.notice}>{otpStatus}</div>}
          </div>
          <div className={styles.gridTwo}>
            <form className={styles.formBlock} onSubmit={handleChangeEmail}>
              <label>
                New email
                <input
                  type="email"
                  value={changeEmailForm.new_email}
                  onChange={(event) => setChangeEmailForm((prev) => ({ ...prev, new_email: event.target.value }))}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={changeEmailForm.password}
                  onChange={(event) => setChangeEmailForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </label>
              <label>
                OTP code
                <input
                  type="text"
                  value={changeEmailForm.code}
                  onChange={(event) => setChangeEmailForm((prev) => ({ ...prev, code: event.target.value }))}
                />
              </label>
              <div className={styles.actions}>
                <button type="submit">Change email</button>
              </div>
            </form>

            <form className={styles.formBlock} onSubmit={handleChangePhone}>
              <label>
                New phone number
                <input
                  type="text"
                  value={changePhoneForm.new_phone_number}
                  onChange={(event) => setChangePhoneForm((prev) => ({ ...prev, new_phone_number: event.target.value }))}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={changePhoneForm.password}
                  onChange={(event) => setChangePhoneForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </label>
              <label>
                OTP code
                <input
                  type="text"
                  value={changePhoneForm.code}
                  onChange={(event) => setChangePhoneForm((prev) => ({ ...prev, code: event.target.value }))}
                />
              </label>
              <div className={styles.actions}>
                <button type="submit">Change phone</button>
              </div>
            </form>
          </div>
          {contactStatus && <div className={styles.notice}>{contactStatus}</div>}
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Extra contacts</h2>
              <p>Add secondary emails or phone numbers and manage them.</p>
            </div>
            <span className={styles.tag}>Backend</span>
          </div>
          <div className={styles.gridTwo}>
            <form className={styles.formBlock} onSubmit={handleAddEmail}>
              <label>
                Extra email
                <input
                  type="email"
                  value={addEmailForm.email}
                  onChange={(event) => setAddEmailForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={addEmailForm.password}
                  onChange={(event) => setAddEmailForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </label>
              <label>
                OTP code
                <input
                  type="text"
                  value={addEmailForm.code}
                  onChange={(event) => setAddEmailForm((prev) => ({ ...prev, code: event.target.value }))}
                />
              </label>
              <div className={styles.actions}>
                <button type="submit">Add email</button>
              </div>
              {profile?.extra_emails?.length ? (
                <div className={styles.list}>
                  {profile.extra_emails.map((entry) => (
                    <div key={entry.id} className={styles.listRow}>
                      <span>{entry.email}</span>
                      <button type="button" onClick={() => handleDeleteExtra('email', entry.id)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.muted}>No extra emails yet.</p>
              )}
            </form>

            <form className={styles.formBlock} onSubmit={handleAddPhone}>
              <label>
                Extra phone number
                <input
                  type="text"
                  value={addPhoneForm.phone_number}
                  onChange={(event) => setAddPhoneForm((prev) => ({ ...prev, phone_number: event.target.value }))}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={addPhoneForm.password}
                  onChange={(event) => setAddPhoneForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </label>
              <label>
                OTP code
                <input
                  type="text"
                  value={addPhoneForm.code}
                  onChange={(event) => setAddPhoneForm((prev) => ({ ...prev, code: event.target.value }))}
                />
              </label>
              <div className={styles.actions}>
                <button type="submit">Add phone</button>
              </div>
              {profile?.extra_phone_numbers?.length ? (
                <div className={styles.list}>
                  {profile.extra_phone_numbers.map((entry) => (
                    <div key={entry.id} className={styles.listRow}>
                      <span>{entry.phone_number}</span>
                      <button type="button" onClick={() => handleDeleteExtra('phone', entry.id)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.muted}>No extra phone numbers yet.</p>
              )}
            </form>
          </div>
          {extrasStatus && <div className={styles.notice}>{extrasStatus}</div>}
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Connected experiences</h2>
              <p>Manage cross‑app connections and data sharing.</p>
            </div>
            <span className={styles.tagMuted}>Coming soon</span>
          </div>
          <div className={styles.placeholderGrid}>
            <div className={styles.placeholder}>
              <h3>Connected accounts</h3>
              <p>Link services and manage how they share data.</p>
            </div>
            <div className={styles.placeholder}>
              <h3>Privacy & data</h3>
              <p>Control download, export, and retention settings.</p>
            </div>
            <div className={styles.placeholder}>
              <h3>Ad preferences</h3>
              <p>Manage personalization and interests.</p>
            </div>
            <div className={styles.placeholder}>
              <h3>Payments</h3>
              <p>Manage payout methods and subscriptions.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AccountCenter;
