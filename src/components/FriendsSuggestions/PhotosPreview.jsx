import React, { useContext } from 'react';
import styles from './friendsSuggestions.module.css';
import { LanguageContext } from '../../context/LanguageContext';

const PhotosPreview = ({ photos = [] }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div className={styles.detailCard}>
      <div className={styles.cardHeader}>
        <h3>{t('Photos')}</h3>
        <button type="button" className={styles.linkBtn}>{t('See all photos')}</button>
      </div>
      <div className={styles.photosGrid}>
        {photos.slice(0, 6).map((src, idx) => (
          <div key={src + idx} className={styles.photoItem}>
            <img src={src} alt={t('Profile')} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PhotosPreview);
