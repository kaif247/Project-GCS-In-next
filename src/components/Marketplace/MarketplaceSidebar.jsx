import React from 'react';
import Icon from '../Icon';

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" className="marketplace-icon" aria-hidden="true">
    <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z" fill="currentColor" />
    <path d="M4 13l-1-2 1-2 2 .5 1.2-1.2-.5-2 2-1 2 1 2-1 2 1-.5 2 1.2 1.2 2-.5 1 2-1 2-2-.5-1.2 1.2.5 2-2 1-2-1-2 1-2-1 .5-2-1.2-1.2-2 .5z" fill="currentColor" opacity=".35" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 20 20" className="marketplace-icon marketplace-icon--small" aria-hidden="true">
    <path d="M7 5l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const categoryIconMap = {
  Vehicles: 'vehicels',
  'Property for rent': 'properties',
  Classifieds: 'classifieds',
  Clothing: 'clothings',
  Electronics: 'laptop_18235558',
  Entertainment: 'entertainment',
  Family: 'family',
  'Free stuff': 'selling',
};

const MarketplaceSidebar = ({
  searchTerm,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <aside className="marketplace-sidebar">
      <div className="marketplace-sidebar__header">
        <h1>MarketPlace</h1>
        <button className="marketplace-sidebar__icon-btn" aria-label="Settings">
          <SettingsIcon />
        </button>
      </div>

      <div className="marketplace-sidebar__search">
        <Icon name="search (1)" size={14} className="search-icon" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search Marketplace"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search Marketplace"
        />
      </div>

      <nav className="marketplace-sidebar__menu">
        <button
          className={`marketplace-sidebar__item ${activeCategory === 'Browse all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('Browse all')}
        >
          <span className="marketplace-sidebar__icon">
            <Icon name="browse-all" size={18} />
          </span>
          <span>Browse all</span>
        </button>
        <button className="marketplace-sidebar__item">
          <span className="marketplace-sidebar__icon">
            <Icon name="notification" size={18} />
          </span>
          <span>Notifications</span>
        </button>
        <button className="marketplace-sidebar__item">
          <span className="marketplace-sidebar__icon">
            <Icon name="inbox" size={18} />
          </span>
          <span>Inbox</span>
        </button>
        <button className="marketplace-sidebar__item">
          <span className="marketplace-sidebar__icon">
            <Icon name="marketplace-access" size={18} />
          </span>
          <span>Marketplace access</span>
        </button>
      </nav>

      <div className="marketplace-sidebar__section">
        <button className="marketplace-sidebar__item">
          <span className="marketplace-sidebar__icon">
            <Icon name="buy_10982864" size={18} />
          </span>
          <span>Buying</span>
          <ChevronIcon />
        </button>
        <button className="marketplace-sidebar__item">
          <span className="marketplace-sidebar__icon">
            <Icon name="selling" size={18} />
          </span>
          <span>Selling</span>
          <ChevronIcon />
        </button>
      </div>

      <button className="marketplace-sidebar__primary-btn">+ Create new listing</button>

      <div className="marketplace-sidebar__location">
        <span className="marketplace-sidebar__icon">
          <Icon name="map-location" size={18} />
        </span>
        <span>Muzaffarabad · Within 65 km</span>
      </div>

      <div className="marketplace-sidebar__section">
        <h3>Categories</h3>
        <div className="marketplace-sidebar__categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`marketplace-sidebar__item ${activeCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              <span className="marketplace-sidebar__icon">
                <Icon name={categoryIconMap[category]} size={18} />
              </span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default MarketplaceSidebar;
