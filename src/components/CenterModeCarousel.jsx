import React, { useMemo, useRef, useState } from 'react';
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
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const touchDeltaXRef = useRef(0);
  const touchDeltaYRef = useRef(0);
  const rafRef = useRef(null);

  React.useEffect(() => {
    if (!safeItems.length) return;
    setActiveIndex(wrapIndex(initialIndex, safeItems.length));
  }, [initialIndex, safeItems.length]);

  React.useEffect(
    () => () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    },
    []
  );

  const trackStyle = useMemo(
    () => ({
      '--cm-item-width': `${itemWidth}px`,
      '--cm-gap': `${gap}px`,
      '--cm-active': activeIndex,
      '--cm-drag-offset': `${dragOffsetX}px`,
    }),
    [activeIndex, itemWidth, gap, dragOffsetX]
  );

  const goNext = () => setActiveIndex((prev) => wrapIndex(prev + 1, safeItems.length));
  const goPrev = () => setActiveIndex((prev) => wrapIndex(prev - 1, safeItems.length));

  const handleTouchStart = (event) => {
    const point = event.touches?.[0];
    if (!point) return;
    touchStartXRef.current = point.clientX;
    touchStartYRef.current = point.clientY;
    touchDeltaXRef.current = 0;
    touchDeltaYRef.current = 0;
    setDragOffsetX(0);
    setIsDragging(true);
  };

  const handleTouchMove = (event) => {
    if (touchStartXRef.current == null) return;
    const point = event.touches?.[0];
    if (!point) return;
    const nextDeltaX = point.clientX - touchStartXRef.current;
    const nextDeltaY =
      touchStartYRef.current == null ? 0 : point.clientY - touchStartYRef.current;
    touchDeltaXRef.current = nextDeltaX;
    touchDeltaYRef.current = nextDeltaY;
    if (Math.abs(nextDeltaX) > Math.abs(nextDeltaY) && Math.abs(nextDeltaX) > 8) {
      event.preventDefault();
    }
    if (rafRef.current != null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      setDragOffsetX(nextDeltaX);
      rafRef.current = null;
    });
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current == null) return;
    const threshold = 22;
    if (
      Math.abs(touchDeltaXRef.current) > Math.abs(touchDeltaYRef.current) &&
      touchDeltaXRef.current <= -threshold
    ) {
      goNext();
    } else if (
      Math.abs(touchDeltaXRef.current) > Math.abs(touchDeltaYRef.current) &&
      touchDeltaXRef.current >= threshold
    ) {
      goPrev();
    }
    setIsDragging(false);
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchDeltaXRef.current = 0;
    touchDeltaYRef.current = 0;
    setDragOffsetX(0);
  };

  const handleSlideTap = (index) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

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

      <div
        className={`${styles.viewport} ${isDragging ? styles.dragging : ''}`}
        aria-label={ariaLabel}
        role="region"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
                onClick={() => handleSlideTap(index)}
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
