import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { sponsoredAds, birthdays, onlineContacts } from '../data/facebookData';
import { LanguageContext } from '../context/LanguageContext';
import Icon from './Icon';
import useProfileData from '../hooks/useProfileData';

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
  const router = useRouter();
  const profile = useProfileData();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBirthdayOpen, setIsBirthdayOpen] = useState(false);
  const [birthdayMessage, setBirthdayMessage] = useState({});
  const [settings, setSettings] = useState({
    incomingCalls: true,
    messageSounds: true,
    popups: true,
    showContacts: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const greetingPresets = [
    'Happy Birthday! 🎉🎂',
    'You deserve to be celebrated. Happy Birthday! 🎈🍰',
    'Enjoy your birthday! 🎉🎁',
    'HBD! 🎊🎂',
    'Wishing you an amazing year ahead! ✨🎉',
  ];

  const handlePreset = (id, text) => {
    setBirthdayMessage((prev) => ({ ...prev, [id]: text }));
  };

  const handleSendBirthday = (person) => {
    const text =
      birthdayMessage[person.id] ||
      `Happy Birthday, ${person.name}! 🎉🎂`;
    const message = `${text} — ${profile.name}`;
    router.push(
      `/chats?name=${encodeURIComponent(person.name)}&avatar=${encodeURIComponent(person.avatar)}&message=${encodeURIComponent(message)}`
    );
    setIsBirthdayOpen(false);
  };
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
          <div
            className="birthdays-content birthdays-content--clickable"
            role="button"
            tabIndex={0}
            onClick={() => setIsBirthdayOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') setIsBirthdayOpen(true);
            }}
          >
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
          <div className="contacts-header-wrap">
            <div className="contacts-header">
              <h3 className="section-title">{t('Contacts')}</h3>
              <div className="contacts-actions">
                <button
                  className="contacts-action-btn"
                  aria-label={t('Search')}
                  onClick={() => setIsSearchOpen((prev) => !prev)}
                >
                  <Icon name="search (1)" size={16} className="icon--no-circle" aria-hidden="true" />
                </button>
                <button
                  className="chats-icon-btn"
                  aria-label={t('More')}
                  onClick={() => setIsSettingsOpen((prev) => !prev)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="6" cy="12" r="2" fill="currentColor" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <circle cx="18" cy="12" r="2" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>

            {isSettingsOpen && (
              <div className="contacts-settings contacts-settings--popover">
              <div className="contacts-settings__title">{t('Chat settings')}</div>
              <div className="contacts-settings__subtitle">
                {t('Customise your Messenger experience.')}
              </div>
              <div className="contacts-settings__divider" />
              <div className="contacts-settings__row">
                <span>{t('Incoming call sounds')}</span>
                <button
                  type="button"
                  className={`toggle ${settings.incomingCalls ? 'on' : 'off'}`}
                  onClick={() => toggleSetting('incomingCalls')}
                >
                  <span />
                </button>
              </div>
              <div className="contacts-settings__row">
                <span>{t('Message sounds')}</span>
                <button
                  type="button"
                  className={`toggle ${settings.messageSounds ? 'on' : 'off'}`}
                  onClick={() => toggleSetting('messageSounds')}
                >
                  <span />
                </button>
              </div>
              <div className="contacts-settings__row">
                <span>{t('Pop up new messages')}</span>
                <button
                  type="button"
                  className={`toggle ${settings.popups ? 'on' : 'off'}`}
                  onClick={() => toggleSetting('popups')}
                >
                  <span />
                </button>
              </div>
              <div className="contacts-settings__divider" />
              <div className="contacts-settings__row">
                <span>{t('Show contacts')}</span>
                <button
                  type="button"
                  className={`toggle ${settings.showContacts ? 'on' : 'off'}`}
                  onClick={() => toggleSetting('showContacts')}
                >
                  <span />
                </button>
              </div>
              </div>
            )}
          </div>

          {isSearchOpen && (
            <div className="contacts-search">
              <Icon name="search (1)" size={14} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder={t('Search contacts')}
                aria-label={t('Search contacts')}
              />
            </div>
          )}

          <div className="contacts-list">
            {onlineContacts.map((contact) => (
              <button
                key={contact.id}
                className="contact-item"
                aria-label={`${contact.name}, ${contact.online ? t('online') : t('offline')}`}
                onClick={() => router.push(`/chats?name=${encodeURIComponent(contact.name)}`)}
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
      {isBirthdayOpen && (
        <div className="birthday-modal" onClick={() => setIsBirthdayOpen(false)}>
          <div className="birthday-modal__card" onClick={(e) => e.stopPropagation()}>
            <div className="birthday-modal__header">
              <h3>{t("Friends' birthdays")}</h3>
              <button type="button" onClick={() => setIsBirthdayOpen(false)} aria-label={t('Close')}>
                ×
              </button>
            </div>

            <div className="birthday-modal__list">
              {birthdays.map((person) => (
                <div key={person.id} className="birthday-modal__row">
                  <img src={person.avatar} alt={person.name} className="birthday-modal__avatar" />
                  <div className="birthday-modal__content">
                    <div className="birthday-modal__name">{person.name}</div>
                    <div className="birthday-modal__input">
                      <input
                        type="text"
                        value={
                          birthdayMessage[person.id] ||
                          `Happy Birthday, ${person.name}! 🎉🎂`
                        }
                        onChange={(e) =>
                          setBirthdayMessage((prev) => ({ ...prev, [person.id]: e.target.value }))
                        }
                      />
                      <button
                        type="button"
                        className="birthday-send-btn"
                        onClick={() => handleSendBirthday(person)}
                        aria-label={t('Send birthday message')}
                      >
                        ➤
                      </button>
                    </div>
                    <div className="birthday-modal__presets">
                      {greetingPresets.map((preset) => (
                        <button
                          type="button"
                          key={`${person.id}-${preset}`}
                          onClick={() => handlePreset(person.id, preset)}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="birthday-modal__footer">
              {t('See upcoming birthdays')}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;
