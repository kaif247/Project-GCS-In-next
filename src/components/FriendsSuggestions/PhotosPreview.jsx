import React from 'react';
import styles from './friendsSuggestions.module.css';

const PhotosPreview = ({ photos = [] }) => {
  return (
    <div className={styles.detailCard}>
      <div className={styles.cardHeader}>
        <h3>Photos</h3>
        <button type="button" className={styles.linkBtn}>See all photos</button>
      </div>
      <div className={styles.photosGrid}>
        {photos.slice(0, 6).map((src, idx) => (
          <div key={src + idx} className={styles.photoItem}>
            <img src={src} alt="Profile" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PhotosPreview);
