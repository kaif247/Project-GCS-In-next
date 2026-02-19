import React, { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { LanguageContext } from '../context/LanguageContext';
import { birthdays } from '../data/facebookData';
import useProfileData from '../hooks/useProfileData';

const BirthdaysPage = () => {
  const { t } = useContext(LanguageContext);
  const router = useRouter();
  const profile = useProfileData();
  const [isBirthdayOpen, setIsBirthdayOpen] = useState(false);
  const [activePersonId, setActivePersonId] = useState(null);
  const [birthdayMessage, setBirthdayMessage] = useState({});

  const greetingPresets = useMemo(
    () => [
      'Happy Birthday! 🎉🎂',
      'You deserve to be celebrated. Happy Birthday! 🎈🍰',
      'Enjoy your birthday! 🎉🎁',
      'HBD! 🎊🎂',
      'Wishing you an amazing year ahead! ✨🎉',
    ],
    []
  );

  const activePerson = birthdays.find((person) => person.id === activePersonId) || null;

  const handleOpenWish = (person) => {
    setActivePersonId(person.id);
    setIsBirthdayOpen(true);
  };

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
    <div className="birthdays-page">
      <div className="birthdays-page__header">
        <h1>{t('Birthdays')}</h1>
        <p>{t('Wish your friends a happy birthday.')}</p>
      </div>
      <div className="birthdays-page__list">
        {birthdays.length === 0 ? (
          <div className="birthdays-page__empty">{t('No birthdays today')}</div>
        ) : (
          birthdays.map((person) => (
            <div key={person.id} className="birthdays-card">
              <img src={person.avatar} alt={person.name} />
              <div className="birthdays-card__info">
                <div className="birthdays-card__name">{person.name}</div>
                <div className="birthdays-card__meta">{t('Birthday today')}</div>
              </div>
              <button
                type="button"
                className="birthdays-card__btn"
                onClick={() => handleOpenWish(person)}
              >
                {t('Write post')}
              </button>
            </div>
          ))
        )}
      </div>
      {isBirthdayOpen && activePerson && (
        <div className="birthday-modal" onClick={() => setIsBirthdayOpen(false)}>
          <div className="birthday-modal__card" onClick={(e) => e.stopPropagation()}>
            <div className="birthday-modal__header">
              <h3>{t("Friends' birthdays")}</h3>
              <button type="button" onClick={() => setIsBirthdayOpen(false)} aria-label={t('Close')}>
                ×
              </button>
            </div>

            <div className="birthday-modal__list">
              <div className="birthday-modal__row">
                <img src={activePerson.avatar} alt={activePerson.name} className="birthday-modal__avatar" />
                <div className="birthday-modal__content">
                  <div className="birthday-modal__name">{activePerson.name}</div>
                  <div className="birthday-modal__input">
                    <input
                      type="text"
                      value={
                        birthdayMessage[activePerson.id] ||
                        `Happy Birthday, ${activePerson.name}! 🎉🎂`
                      }
                      onChange={(e) =>
                        setBirthdayMessage((prev) => ({ ...prev, [activePerson.id]: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      className="birthday-send-btn"
                      onClick={() => handleSendBirthday(activePerson)}
                      aria-label={t('Send birthday message')}
                    >
                      ➤
                    </button>
                  </div>
                  <div className="birthday-modal__presets">
                    {greetingPresets.map((preset) => (
                      <button
                        type="button"
                        key={`${activePerson.id}-${preset}`}
                        onClick={() => handlePreset(activePerson.id, preset)}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdaysPage;
