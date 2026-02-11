import React, { useContext } from 'react';
import MutualFriends from './MutualFriends';
import styles from './friendsSuggestions.module.css';
import { LanguageContext } from '../../context/LanguageContext';

const SuggestionCard = ({ suggestion, isSelected, onClick, onRemove, onToggleRequest }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div
      role="button"
      tabIndex={0}
      className={`${styles.suggestionCard} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={styles.suggestionAvatarWrap}>
        <img src={suggestion.avatar} alt={suggestion.name} />
        {suggestion.isOnline && <span className={styles.onlineDot} />}
      </div>
      <div className={styles.suggestionBody}>
        <div className={styles.suggestionName}>{suggestion.name}</div>
        <MutualFriends count={suggestion.mutualFriends} />
        <div className={styles.suggestionActions}>
          {suggestion.isRequestSent ? (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={(e) => {
                e.stopPropagation();
                onToggleRequest();
              }}
            >
              {t('Cancel request')}
            </button>
          ) : (
            <>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleRequest();
                }}
              >
                {t('Add friend')}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                {t('Remove')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SuggestionCard);
