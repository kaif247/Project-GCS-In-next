import React, { useContext } from 'react';
import styles from './friendsSuggestions.module.css';
import { LanguageContext } from '../../context/LanguageContext';

const MutualFriends = ({ count, avatars = [] }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div className={styles.mutualFriends} title={`${count} ${t('mutual friends')}`}>
      <div className={styles.mutualAvatars}>
        {avatars.slice(0, 3).map((src, idx) => (
          <img key={src + idx} src={src} alt={t('mutual friends')} />
        ))}
      </div>
      <span>{count} {t('mutual friends')}</span>
    </div>
  );
};

export default React.memo(MutualFriends);
