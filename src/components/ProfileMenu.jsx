import React, { useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { LanguageContext } from '../context/LanguageContext';

const MenuRow = ({ icon, label, meta, onClick, href }) => {
  if (href) {
    return (
      <Link className="profile-menu__item" href={href} onClick={onClick}>
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
  const { t } = useContext(LanguageContext);

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

  return (
    <div ref={menuRef} className="profile-menu" role="menu" aria-label={t('Profile menu')}>
      <div className="profile-menu__header">
        <img src={user.avatar} alt={user.name} />
        <div>
          <div className="profile-menu__name">{user.name}</div>
          <Link href="/profiles" className="profile-menu__profiles" onClick={onClose}>
            {t('See all profiles')}
          </Link>
        </div>
      </div>

      <div className="profile-menu__section">
        <MenuRow
          icon={<ChevronIcon />}
          label={t('Settings & privacy')}
          onClick={onClose}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label={t('Help & support')}
          onClick={onClose}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label={t('Display & accessibility')}
          onClick={onClose}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label={t('Give feedback')}
          meta="CTRL + B"
          onClick={onClose}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label={t('Log out')}
          onClick={() => {
            console.log('Logged out');
            onClose();
          }}
        />
      </div>

      <div className="profile-menu__footer">
        <button type="button">{t('Privacy')}</button>
        <span>·</span>
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
