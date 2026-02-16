import React, { useContext, useEffect, useState } from 'react';
import styles from './friendsSuggestions.module.css';
import { LanguageContext } from '../../context/LanguageContext';

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

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeViewer();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, photos.length]);

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
      {isOpen && (
        <div className={styles.photoModalOverlay} onClick={closeViewer}>
          <div className={styles.photoModal} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.photoCloseBtn} onClick={closeViewer} aria-label={t('Close')}>
              ×
            </button>
            <button type="button" className={styles.photoNavBtn} onClick={goPrev} aria-label={t('Previous photo')}>
              ‹
            </button>
            <img
              src={photos[activeIndex]}
              alt={t('Profile')}
              className={styles.photoModalImage}
            />
            <button type="button" className={styles.photoNavBtn} onClick={goNext} aria-label={t('Next photo')}>
              ›
            </button>
            <div className={styles.photoCount}>
              {activeIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PhotosPreview);
