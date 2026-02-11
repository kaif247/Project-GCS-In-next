import React from 'react';
import { sponsoredAds, birthdays, onlineContacts } from '../data/facebookData';

const SponsoredAd = ({ ad }) => (
  <div className="sponsored-ad">
    <img src={ad.image} alt={ad.title} className="ad-image" />
    <div className="ad-info">
      <h3 className="ad-title">{ad.title}</h3>
      <p className="ad-url">{ad.url}</p>
    </div>
  </div>
);

const RightSidebar = () => {
  return (
    <aside className="right-sidebar">
      <div className="sidebar-scroll">
        {/* Sponsored Section */}
        <section className="sidebar-section">
          <h3 className="section-title">Sponsored</h3>
          <div className="sponsored-list">
            {sponsoredAds.map((ad) => (
              <SponsoredAd key={ad.id} ad={ad} />
            ))}
          </div>
        </section>

        {/* Birthdays Section */}
        <section className="sidebar-section">
          <h3 className="section-title">Birthdays</h3>
          <div className="birthdays-content">
            {birthdays.length > 0 ? (
              <div className="birthday-item">
                <svg className="gift-icon" viewBox="0 0 24 24" fill="#f02849" width="20" height="20">
                  <path d="M20 8h-3V6c0-2.21-1.79-4-4-4s-4 1.79-4 4v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-8-2c1.1 0 2 .9 2 2v2h-4V6c0-1.1.9-2 2-2zm8 16H4V10h3v2h10v-2h3v12z" />
                </svg>
                <span className="birthday-text">
                  <strong>{birthdays.map(b => b.name).join(' and ')}</strong> have their birthdays today.
                </span>
              </div>
            ) : (
              <p className="no-birthdays">No birthdays today</p>
            )}
          </div>
        </section>

        {/* Contacts Section */}
        <section className="sidebar-section">
          <div className="contacts-header">
            <h3 className="section-title">Contacts</h3>
            <div className="contacts-actions">
              <button className="contacts-action-btn" aria-label="Video call">
                📹
              </button>
              <button className="contacts-action-btn" aria-label="Search">
                🔍
              </button>
              <button className="contacts-action-btn" aria-label="More options">
                ⋯
              </button>
            </div>
          </div>

          <div className="contacts-list">
            {onlineContacts.map((contact) => (
              <button
                key={contact.id}
                className="contact-item"
                aria-label={`${contact.name}, ${contact.online ? 'online' : 'offline'}`}
              >
                <div className="contact-avatar-wrapper">
                  <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
                  {contact.online && <span className="contact-online-indicator"></span>}
                </div>
                <span className="contact-name">{contact.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default RightSidebar;
