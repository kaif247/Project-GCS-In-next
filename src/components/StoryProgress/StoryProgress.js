import React, { useEffect, useMemo, useRef } from 'react';
import styles from './StoryProgress.module.css';

const StoryProgress = ({ segments, activeIndex, progress }) => {
  const refs = useRef([]);

  useEffect(() => {
    refs.current.forEach((node, idx) => {
      if (!node) return;
      if (idx < activeIndex) {
        node.style.width = '100%';
      } else if (idx === activeIndex) {
        node.style.width = `${Math.min(progress * 100, 100)}%`;
      } else {
        node.style.width = '0%';
      }
    });
  }, [segments, activeIndex, progress]);

  const segmentArray = useMemo(() => Array.from({ length: segments }), [segments]);

  return (
    <div className={styles.wrapper} aria-label="Story progress">
      {segmentArray.map((_, idx) => (
        <div key={idx} className={styles.segment}>
          <div
            className={`${styles.fill} ${idx < activeIndex ? styles.complete : ''}`}
            ref={(el) => {
              refs.current[idx] = el;
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(StoryProgress);
