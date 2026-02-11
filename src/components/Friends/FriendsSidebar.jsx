import React, { useContext } from 'react';
import Link from 'next/link';
import Icon from '../Icon';
import { LanguageContext } from '../../context/LanguageContext';

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" className="friends-icon" aria-hidden="true">
    <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z" fill="currentColor" />
    <path d="M4 13l-1-2 1-2 2 .5 1.2-1.2-.5-2 2-1 2 1 2-1 2 1-.5 2 1.2 1.2 2-.5 1 2-1 2-2-.5-1.2 1.2.5 2-2 1-2-1-2 1-2-1 .5-2-1.2-1.2-2 .5z" fill="currentColor" opacity=".35" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" className="friends-icon friends-icon--small" aria-hidden="true">
    <path d="M7 5l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FriendsSidebar = () => {
  const { t } = useContext(LanguageContext);
  return (
    <aside className="friends-sidebar">
      <div className="friends-sidebar__header">
        <h1>{t('Friends')}</h1>
        <button className="friends-sidebar__icon-btn" aria-label={t('Settings')}>
          <SettingsIcon />
        </button>
      </div>

      <div className="friends-sidebar__menu">
        <Link href="/" className="friends-sidebar__item active">
          <span className="friends-sidebar__icon">
            <Icon name="home" size={18} />
          </span>
          <span>{t('Home')}</span>
        </Link>
        <button className="friends-sidebar__item">
          <span className="friends-sidebar__icon">
            <Icon name="friends" size={18} />
          </span>
          <span>{t('Friend requests')}</span>
          <ArrowIcon />
        </button>
        <Link href="/friends/suggestions" className="friends-sidebar__item">
          <span className="friends-sidebar__icon">
            <Icon name="friends" size={18} />
          </span>
          <span>{t('Suggestions')}</span>
          <ArrowIcon />
        </Link>
        <button className="friends-sidebar__item">
          <span className="friends-sidebar__icon">
            <Icon name="friends" size={18} />
          </span>
          <span>{t('All friends')}</span>
          <ArrowIcon />
        </button>
        <button className="friends-sidebar__item">
          <span className="friends-sidebar__icon">
            <Icon name="cake (1)" size={18} />
          </span>
          <span>{t('Birthdays')}</span>
        </button>
        <button className="friends-sidebar__item">
          <span className="friends-sidebar__icon">
            <Icon name="friends" size={18} />
          </span>
          <span>{t('Custom lists')}</span>
          <ArrowIcon />
        </button>
      </div>

      <div className="friends-sidebar__divider" />

      <div className="friends-sidebar__section">
        <h3>{t('New friends')}</h3>
        <div className="friends-sidebar__notification">
          <img
            src="https://i.pravatar.cc/100?img=52"
            alt={t('New friend')}
            className="friends-sidebar__avatar"
          />
          <div>
            <div className="friends-sidebar__text">{t('accepted your friend request')}</div>
            <div className="friends-sidebar__time">{t('12 hours ago')}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FriendsSidebar;
