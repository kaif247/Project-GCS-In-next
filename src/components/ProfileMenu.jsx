import React, { useEffect, useRef, useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LanguageContext } from '../context/LanguageContext';

const MenuRow = ({ icon, label, meta, onClick, href, currentPath }) => {
  if (href) {
    return (
      <Link
        className="profile-menu__item"
        href={href}
        onClick={(event) => {
          if (currentPath === href) {
            event.preventDefault();
          }
          onClick?.(event);
        }}
      >
        <span className="profile-menu__icon">{icon}</span>
        <span className="profile-menu__label">
          {label}
          {meta && <span className="profile-menu__meta">{meta}</span>}
        </span>
      </Link>
    );
  }

  return (
    <button className="profile-menu__item" onClick={onClick} type="button">
      <span className="profile-menu__icon">{icon}</span>
      <span className="profile-menu__label">
        {label}
        {meta && <span className="profile-menu__meta">{meta}</span>}
      </span>
    </button>
  );
};

const ChevronIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M7 5l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ProfileMenu = ({ open, onClose, user }) => {
  const menuRef = useRef(null);
  const router = useRouter();
  const { t } = useContext(LanguageContext);
  const [hasProfile, setHasProfile] = useState(false);
  const [logoutNotice, setLogoutNotice] = useState('');

  useEffect(() => {
    if (!open) return;
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('gcs-profile');
      setHasProfile(!!stored);
    } catch (error) {
      setHasProfile(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const handleLogout = async () => {
    setLogoutNotice('');
    if (typeof window === 'undefined') return;
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
    } catch (error) {
      setLogoutNotice('Logout failed. Please try again.');
    } finally {
      window.localStorage.removeItem('gcs-access-token');
      window.localStorage.removeItem('gcs-refresh-token');
      onClose();
    }
  };

  return (
    <div ref={menuRef} className="profile-menu" role="menu" aria-label={t('Profile menu')}>
      <div className="profile-menu__header">
        <img src={user.avatar} alt={user.name} />
        <div>
          <div className="profile-menu__name">{user.name}</div>
          <Link
            href={hasProfile ? '/profile' : '/profile/create'}
            className="profile-menu__profiles"
            onClick={onClose}
          >
            {t('See all profiles')}
          </Link>
        </div>
      </div>

      <div className="profile-menu__section">
        {!hasProfile && (
          <MenuRow
            icon={<ChevronIcon />}
            label={t('Create profile')}
            href="/profile/create"
            onClick={onClose}
            currentPath={router.asPath}
          />
        )}
        <MenuRow
          icon={<ChevronIcon />}
          label={t('Account Center')}
          href="/account-center"
          onClick={onClose}
          currentPath={router.asPath}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label={t('Blocking')}
          href="/blocking"
          onClick={onClose}
          currentPath={router.asPath}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label={t('Help & support')}
          href="/help-center"
          onClick={onClose}
          currentPath={router.asPath}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label={t('Display & accessibility')}
          href="/display-accessibility"
          onClick={onClose}
          currentPath={router.asPath}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label={t('Give feedback')}
          meta="CTRL + B"
          href="/feedback"
          onClick={onClose}
          currentPath={router.asPath}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label={t('Log out')}
          onClick={handleLogout}
        />
        {logoutNotice && <div className="profile-menu__notice">{logoutNotice}</div>}
      </div>

      <div className="profile-menu__footer">
        <button type="button">{t('Terms')}</button>
        <span>·</span>
        <button type="button">{t('Advertising')}</button>
        <span>·</span>
        <button type="button">{t('Ad choices')}</button>
        <span>·</span>
        <button type="button">{t('Cookies')}</button>
        <span>·</span>
        <button type="button">{t('More')}</button>
      </div>
    </div>
  );
};

export default ProfileMenu;

