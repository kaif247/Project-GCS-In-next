import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import ProfileMenu from './ProfileMenu';
import NotificationDropdown from './NotificationDropdown';
import { notificationsData } from '../data/notificationsData';
import MenuDropdown from './MenuDropdown';
import Icon from './Icon';

const Navbar = ({ isLiveOpen = false, onToggleLive = () => {}, onNavigateAttempt }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { t, language, setLanguage, languages } = useContext(LanguageContext);
  const [notificationCount] = useState(3);
  const [messageCount] = useState(1);
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMessengerHover, setIsMessengerHover] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const languageIconMap = {
    fr: 'lang-fr',
    es: 'lang-es',
    ht: 'lang-ht',
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <Icon name="home" size={28} />, path: '/' },
    { id: 'marketplace', label: '', icon: <Icon name="marketplace2" size={28} />, path: '/marketplace' },
    { id: 'friends', label: '', icon: <Icon name="friends" size={28} />, path: '/friends' },
    { id: 'products', label: '', icon: <Icon name="product" size={28} /> },
  ];

  const isActiveRoute = (path) => {
    if (!path) return false;
    if (path === '/') return router.pathname === '/';
    return router.asPath === path || router.asPath.startsWith(`${path}/`);
  };

  const handleNavAttempt = (event, path) => {
    if (!onNavigateAttempt || !path) return;
    const shouldNavigate = onNavigateAttempt(path);
    if (!shouldNavigate) event.preventDefault();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Section */}
        <div className="navbar-left">
          <Link
            href="/"
            className="navbar-logo"
            aria-label="Home"
            onClick={(event) => handleNavAttempt(event, '/')}
          >
            {/* full rectangular logo (not circular) from public folder */}
            <img src="/GCS.png" alt="GCS" className="navbar-logo-img" />
          </Link>

          <div className={`navbar-search ${isSearchFocused ? 'focused' : ''}`}>
            <Icon name="search (1)" size={14} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder={t('Search')}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              aria-label={t('Search')}
            />
          </div>
        </div>

        {/* Center Section - Navigation */}
        <div className="navbar-center">
          {navItems.map((item) => {
            if (item.path) {
              const isActive = isActiveRoute(item.path);
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  aria-label={item.label ? t(item.label) : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(event) => handleNavAttempt(event, item.path)}
                >
                  <span className="nav-icon">{item.icon}</span>
                </Link>
              );
            }
            return (
              <button
                key={item.id}
                className="nav-item"
                aria-label={item.label ? t(item.label) : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          <div className="navbar-menu">
            <button
              className="navbar-icon-btn"
              aria-label={t('Menu')}
              title={t('Menu')}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="5" height="5" />
                <rect x="9" y="2" width="5" height="5" />
                <rect x="16" y="2" width="5" height="5" />
                <rect x="2" y="9" width="5" height="5" />
                <rect x="9" y="9" width="5" height="5" />
                <rect x="16" y="9" width="5" height="5" />
                <rect x="2" y="16" width="5" height="5" />
                <rect x="9" y="16" width="5" height="5" />
                <rect x="16" y="16" width="5" height="5" />
              </svg>
            </button>
            <MenuDropdown open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </div>

          <Link
            href="/chats"
            className="navbar-icon-btn notification-btn"
            aria-label={t('Messenger')}
            title={t('Messenger')}
            onMouseEnter={() => setIsMessengerHover(true)}
            onMouseLeave={() => setIsMessengerHover(false)}
            onClick={(event) => handleNavAttempt(event, '/chats')}
          >
            <Icon
              name={isMessengerHover ? 'messenger_5968771' : (isDarkMode ? 'messenger_5968771' : 'messenger_596877')}
              size={20}
              className="icon--no-circle"
              aria-hidden="true"
            />
            {messageCount > 0 && <span className="badge">{messageCount}</span>}
          </Link>

          <div className="navbar-notifications">
            <button
              className="navbar-icon-btn notification-btn"
              aria-label={t('Notifications')}
              title={t('Notifications')}
              onClick={() => setIsNotifOpen((prev) => !prev)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              {notificationCount > 0 && (
                <span className="badge notification-badge">{notificationCount}</span>
              )}
            </button>
            <NotificationDropdown
              open={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              initialNotifications={notificationsData}
            />
          </div>

          <div className="navbar-language">
            <button
              className="navbar-icon-btn"
              aria-label={t('Language')}
              title={t('Language')}
              onClick={() => setIsLangOpen((prev) => !prev)}
            >
              <Icon
                name={languageIconMap[language] || 'languages'}
                size={20}
                className="icon--no-circle"
                aria-hidden="true"
              />
            </button>
            <div className={`language-menu ${isLangOpen ? 'open' : ''}`}>
              <div className="language-menu-title">{t('Language')}</div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`language-option ${language === lang.code ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLangOpen(false);
                  }}
                  type="button"
                >
                  <span className="language-label">{lang.label}</span>
                  <span className="language-code">{lang.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="navbar-profile">
            <button
              className="navbar-icon-btn profile-btn"
              aria-label={t('User profile')}
              title={t('User profile')}
              onClick={() => setIsProfileOpen((prev) => !prev)}
            >
              <img
                src="https://i.pravatar.cc/150?img=1"
                alt="Profile"
                className="profile-avatar"
              />
            </button>
            <ProfileMenu
              open={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              user={{ name: 'Kaif Islam', avatar: 'https://i.pravatar.cc/150?img=1' }}
            />
          </div>

          <button
            className="navbar-icon-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={t('Toggle dark mode')}
            title={isDarkMode ? t('Light mode') : t('Dark mode')}
          >
            <Icon
              name={isDarkMode ? 'lightmode' : 'night-mode'}
              size={18}
              className="icon--no-circle"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

