import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { stories } from '../data/facebookData';
import styles from '../components/Feed/StoriesSection.module.css';

const StoriesPage = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!router.isReady) return;
    const raw = Array.isArray(router.query.start)
      ? router.query.start[0]
      : router.query.start;
    const idx = parseInt(raw || '0', 10);
    const safeIdx = isNaN(idx) ? 0 : Math.max(0, Math.min(idx, stories.length - 1));
    setCurrent(safeIdx);
  }, [router.isReady, router.query.start]);

  const story = stories[current];

  const nextStory = () => setCurrent((c) => (c + 1) % stories.length);
  const prevStory = () => setCurrent((c) => (c - 1 + stories.length) % stories.length);

  if (!story) return null;

  return (
    <div className={styles.storyViewerOverlay}>
      <div className={styles.storyViewerContent}>
        <img src={story.image || story.userAvatar} alt={story.userName} className={styles.storyViewerImage} />
        <div className={styles.storyViewerUser}>{story.userName}</div>
        <button onClick={prevStory} className={styles.storyNavBtn} aria-label="Previous Story">&#8592;</button>
        <button onClick={nextStory} className={styles.storyNavBtn} aria-label="Next Story">&#8594;</button>
        <button onClick={() => router.back()} className={styles.storyCloseBtn} aria-label="Close">&times;</button>
      </div>
    </div>
  );
};

export default StoriesPage;
