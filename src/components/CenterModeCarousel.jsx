import React, { useMemo, useState } from 'react';
import styles from './CenterModeCarousel.module.css';

const wrapIndex = (index, length) => {
  if (!length) return 0;
  const next = index % length;
  return next < 0 ? next + length : next;
};

const getOffset = (index, activeIndex, length) => {
  let diff = index - activeIndex;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
};

const CenterModeCarousel = ({
  items,
  renderItem,
  getKey,
  ariaLabel = 'Carousel',
  className = '',
  slideClassName = '',
  itemWidth = 260,
  gap = 16,
  initialIndex = 1,
  showNav = false,
}) => {
  const safeItems = Array.isArray(items) ? items : [];
  const [activeIndex, setActiveIndex] = useState(() =>
    wrapIndex(initialIndex, safeItems.length)
  );

  const trackStyle = useMemo(
    () => ({
      '--cm-item-width': `${itemWidth}px`,
      '--cm-gap': `${gap}px`,
      '--cm-active': activeIndex,
    }),
    [activeIndex, itemWidth, gap]
  );

  const goNext = () => setActiveIndex((prev) => wrapIndex(prev + 1, safeItems.length));
  const goPrev = () => setActiveIndex((prev) => wrapIndex(prev - 1, safeItems.length));

  if (!safeItems.length) return null;

  return (
    <div className={`${styles.carousel} ${className}`}>
      {showNav && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navPrev}`}
          onClick={goPrev}
          aria-label={`Previous ${ariaLabel}`}
        >
          ‹
        </button>
      )}

      <div className={styles.viewport} aria-label={ariaLabel} role="region">
        <div className={styles.track} style={trackStyle}>
          {safeItems.map((item, index) => {
            const offset = getOffset(index, activeIndex, safeItems.length);
            const isActive = offset === 0;
            const isNear = Math.abs(offset) === 1;
            const isFar = Math.abs(offset) > 1;
            const key = getKey ? getKey(item, index) : `${index}`;

            return (
              <article
                key={key}
                className={`${styles.slide} ${slideClassName} ${isActive ? styles.active : ''} ${
                  isNear ? styles.near : ''
                } ${isFar ? styles.far : ''}`}
                style={{ '--offset': offset }}
                aria-hidden={isFar}
              >
                {renderItem(item, index, { isActive, offset })}
              </article>
            );
          })}
        </div>
      </div>

      {showNav && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navNext}`}
          onClick={goNext}
          aria-label={`Next ${ariaLabel}`}
        >
          ›
        </button>
      )}
    </div>
  );
};

export default CenterModeCarousel;
