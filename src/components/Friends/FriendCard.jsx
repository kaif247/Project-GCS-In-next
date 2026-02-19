import React, { useContext, useState } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const FriendCard = ({ friend, onRemove }) => {
  const { t } = useContext(LanguageContext);
  const [isRequestSent, setIsRequestSent] = useState(false);
  return (
    <article className="friends-card">
      <div className="friends-card__image-wrap">
        <img src={friend.profileImage} alt={friend.name} className="friends-card__image" />
      </div>
      <div className="friends-card__body">
        <div className="friends-card__name">{friend.name}</div>
        <div className="friends-card__mutual">
          <span className="friends-card__mutual-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="9" cy="9" r="3.2" fill="currentColor" />
              <circle cx="16.5" cy="10.5" r="2.6" fill="currentColor" />
              <path d="M4.5 19a5 5 0 0 1 9 0v1h-9z" fill="currentColor" />
              <path d="M13.5 19a4 4 0 0 1 7 0v1h-7z" fill="currentColor" />
            </svg>
          </span>
          {friend.mutualFriends} {t('mutual friends')}
        </div>
        {isRequestSent ? (
          <button
            type="button"
            className="friends-card__btn"
            onClick={() => setIsRequestSent(false)}
          >
            {t('Cancel request')}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="friends-card__btn--primary"
              onClick={() => setIsRequestSent(true)}
            >
              {t('Add friend')}
            </button>
            <button
              type="button"
              className="friends-card__btn"
              onClick={() => onRemove?.(friend.id)}
            >
              {t('Remove')}
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default FriendCard;
