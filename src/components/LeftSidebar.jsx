import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { sidebarItems, currentUser } from '../data/facebookData';
import Icon from './Icon';

const LeftSidebar = () => {
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();

  const iconKeyMap = {
    'Meta AI': 'meta',
    'Friends': 'friends',
    'Suggestions': 'friends',
    'Feeds': 'feeds', // match exact filename key
    'Memories': 'memories',
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
  };

  return (
    <aside className="left-sidebar">
      <div className="sidebar-scroll">
        {/* User Profile Section */}
        <div className="user-profile">
          <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" />
          <span className="user-name">{currentUser.name}</span>
          {currentUser.online && <span className="online-indicator" />}
        </div>

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
                  aria-label={item.label}
                >
                  <span className="sidebar-icon">{renderIcon(item.label)}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              );
            }
            return (
              <button
                key={item.id}
                className="sidebar-item"
                aria-label={item.label}
              >
                <span className="sidebar-icon">{renderIcon(item.label)}</span>
                <span className="sidebar-label">{item.label}</span>
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
            <span>See more</span>
          </button>
        )}

        {showMore && sidebarItems.length > 6 && (
          <button
            className="see-more-btn"
            onClick={() => setShowMore(false)}
            aria-expanded={showMore}
          >
            <span className="see-more-icon">▲</span>
            <span>See less</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
