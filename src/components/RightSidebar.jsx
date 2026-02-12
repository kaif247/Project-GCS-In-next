import React, { useContext } from 'react';
import { sponsoredAds, birthdays, onlineContacts } from '../data/facebookData';
import { LanguageContext } from '../context/LanguageContext';
import Icon from './Icon';

const SponsoredAd = ({ ad, t }) => (
  <div className="sponsored-ad">
    <img src={ad.image} alt={ad.title} className="ad-image" />
    <div className="ad-info">
      <h3 className="ad-title">{t(ad.title)}</h3>
      <p className="ad-url">{ad.url}</p>
    </div>
  </div>
);

const RightSidebar = () => {
  const { t } = useContext(LanguageContext);
  return (
    <aside className="right-sidebar">
      <div className="sidebar-scroll">
        {/* Sponsored Section */}
        <section className="sidebar-section">
          <h3 className="section-title">{t('Sponsored')}</h3>
          <div className="sponsored-list">
            {sponsoredAds.map((ad) => (
              <SponsoredAd key={ad.id} ad={ad} t={t} />
            ))}
          </div>
        </section>

        {/* Birthdays Section */}
        <section className="sidebar-section">
          <h3 className="section-title">{t('Birthdays')}</h3>
          <div className="birthdays-content">
            {birthdays.length > 0 ? (
              <div className="birthday-item">
                <Icon name="cake (1)" size={20} className="gift-icon" aria-hidden="true" />
                <span className="birthday-text">
                  <strong>{birthdays.map(b => b.name).join(` ${t('and')} `)}</strong> {t('have their birthdays today.')}
                </span>
              </div>
            ) : (
              <p className="no-birthdays">{t('No birthdays today')}</p>
            )}
          </div>
        </section>

        {/* Contacts Section */}
        <section className="sidebar-section">
          <div className="contacts-header">
            <h3 className="section-title">{t('Contacts')}</h3>
            <div className="contacts-actions">
             
              <button className="contacts-action-btn" aria-label={t('Search')}>
                <Icon name="search (1)" size={16} className="icon--no-circle" aria-hidden="true" />
              </button>
              <button className="chats-icon-btn" aria-label={t('More')}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="6" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="18" cy="12" r="2" fill="currentColor" />
            </svg>
          </button>
            </div>
          </div>

          <div className="contacts-list">
            {onlineContacts.map((contact) => (
              <button
                key={contact.id}
                className="contact-item"
                aria-label={`${contact.name}, ${contact.online ? t('online') : t('offline')}`}
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
