import React from 'react';
import styles from './StoryNavigation.module.css';

const StoryNavigation = ({ onPrev, onNext }) => {
  return (
    <div className={styles.nav}>
      <button type="button" className={styles.btn} onClick={onPrev} aria-label="Previous story">
        ‹
      </button>
      <button type="button" className={styles.btn} onClick={onNext} aria-label="Next story">
        ›
      </button>
    </div>
  );
};

export default React.memo(StoryNavigation);
