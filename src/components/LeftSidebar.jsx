import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { sidebarItems, currentUser } from '../data/facebookData';
import Icon from './Icon';
import { LanguageContext } from '../context/LanguageContext';

const LeftSidebar = () => {
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();
  const { t } = useContext(LanguageContext);
  const [profileData, setProfileData] = useState(null);
  const [profileRoute, setProfileRoute] = useState('/profile/create');

  const iconKeyMap = {
    'Meta AI': 'meta',
    'Friends': 'friends',
    'Suggestions': 'friends',
    'Feeds': 'feeds', // match exact filename key
    'Saved': 'saved',
    'Events': 'event',
    'Marketplace': 'marketplace (2)',
  };

  const renderIcon = (label) => {
    const mapped = iconKeyMap[label] || label;
    return <Icon name={mapped} size={24} className="icon--sidebar" circle={false} />;
  };

  const displayedItems = showMore ? sidebarItems : sidebarItems.slice(0, 6);
  const routeMap = {
    Marketplace: '/marketplace',
    Friends: '/friends',
    Suggestions: '/friends/suggestions',
    Saved: '/saved',
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('gcs-profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfileData(parsed);
        setProfileRoute('/profile');
      } else {
        setProfileRoute('/profile/create');
      }
    } catch (error) {
      setProfileRoute('/profile/create');
    }
  }, []);

  return (
    <aside className="left-sidebar">
      <div className="sidebar-scroll">
        {/* User Profile Section */}
        <Link className="user-profile" href={profileRoute} aria-label={t('Profile')}>
          <img
            src={profileData?.avatarUrl || currentUser.avatar}
            alt={profileData?.name || currentUser.name}
            className="user-avatar"
          />
          <span className="user-name">{profileData?.name || currentUser.name}</span>
          {currentUser.online && <span className="online-indicator" />}
        </Link>

        {/* Sidebar Items */}
        <nav className="sidebar-nav">
          {displayedItems.map((item) => {
            const route = routeMap[item.label];
            if (route) {
              const isActive =
                router.asPath === route || router.asPath.startsWith(`${route}/`);
              return (
                <Link
                  key={item.id}
                  href={route}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  aria-label={t(item.label)}
                >
                  <span className="sidebar-icon">{renderIcon(item.label)}</span>
                  <span className="sidebar-label">{t(item.label)}</span>
                </Link>
              );
            }
            return (
              <button
                key={item.id}
                className="sidebar-item"
                aria-label={t(item.label)}
              >
                <span className="sidebar-icon">{renderIcon(item.label)}</span>
                <span className="sidebar-label">{t(item.label)}</span>
              </button>
            );
          })}
        </nav>

        {/* See More Button */}
        {!showMore && sidebarItems.length > 6 && (
          <button
            className="see-more-btn"
            onClick={() => setShowMore(true)}
            aria-expanded={showMore}
          >
            <span className="see-more-icon">▼</span>
            <span>{t('See more')}</span>
          </button>
        )}

        {showMore && sidebarItems.length > 6 && (
          <button
            className="see-more-btn"
            onClick={() => setShowMore(false)}
            aria-expanded={showMore}
          >
            <span className="see-more-icon">▲</span>
            <span>{t('See less')}</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
