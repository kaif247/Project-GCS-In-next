import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { stories } from '../data/facebookData';
import styles from '../components/Feed/StoriesSection.module.css';
import { LanguageContext } from '../context/LanguageContext';

const StoriesPage = () => {
  const router = useRouter();
  const { t } = useContext(LanguageContext);
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
        <img src={story.image || story.userAvatar} alt={t(story.userName)} className={styles.storyViewerImage} />
        <div className={styles.storyViewerUser}>{t(story.userName)}</div>
        <button onClick={prevStory} className={styles.storyNavBtn} aria-label={t('Previous Story')}>&#8592;</button>
        <button onClick={nextStory} className={styles.storyNavBtn} aria-label={t('Next Story')}>&#8594;</button>
        <button onClick={() => router.back()} className={styles.storyCloseBtn} aria-label={t('Close')}>&times;</button>
      </div>
    </div>
  );
};

export default StoriesPage;
