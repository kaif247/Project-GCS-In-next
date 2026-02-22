import React, { useContext, useState } from 'react';
import styles from './friendsSuggestions.module.css';
import { LanguageContext } from '../../context/LanguageContext';
import PhotoViewer from '../PhotoViewer';

const PhotosPreview = ({ photos = [] }) => {
  const { t } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openViewer = (index = 0) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeViewer = () => setIsOpen(false);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div className={styles.detailCard}>
      <div className={styles.cardHeader}>
        <h3>{t('Photos')}</h3>
        <button type="button" className={styles.linkBtn} onClick={() => openViewer(0)}>
          {t('See all photos')}
        </button>
      </div>
      <div className={styles.photosGrid}>
        {photos.slice(0, 6).map((src, idx) => (
          <button
            type="button"
            key={src + idx}
            className={styles.photoItem}
            onClick={() => openViewer(idx)}
            aria-label={t('View photo')}
          >
            <img src={src} alt={t('Profile')} loading="lazy" />
          </button>
        ))}
      </div>
      <PhotoViewer
        open={isOpen}
        photos={photos}
        index={activeIndex}
        onClose={closeViewer}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
};

export default React.memo(PhotosPreview);
