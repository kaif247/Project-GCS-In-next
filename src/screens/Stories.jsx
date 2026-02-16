import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import styles from '../components/Feed/StoriesSection.module.css';
import { LanguageContext } from '../context/LanguageContext';
import useStories from '../hooks/useStories';
import useProfileData from '../hooks/useProfileData';

const StoriesPage = () => {
  const router = useRouter();
  const { t } = useContext(LanguageContext);
  const [current, setCurrent] = useState(0);
  const { stories } = useStories();
  const profile = useProfileData();

  const groupedStories = useMemo(() => {
    const map = new Map();
    stories.forEach((story) => {
      const key = story.userName || 'Unknown';
      if (!map.has(key)) {
        map.set(key, {
          userName: story.userName,
          userAvatar: story.userAvatar,
          list: [],
        });
      }
      map.get(key).list.push(story);
    });
    return Array.from(map.values());
  }, [stories]);

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

  useEffect(() => {
    if (!story) return undefined;
    const duration = story.video ? 8000 : 5000;
    const timer = setTimeout(() => nextStory(), duration);
    return () => clearTimeout(timer);
  }, [story]);

  if (!story) return null;

  return (
    <div className={styles.storyViewerOverlay}>
      <aside className={styles.storySidebar}>
        <div className={styles.storySidebarHeader}>
          <button onClick={() => router.back()} className={styles.storyCloseBtn} aria-label={t('Close')}>
            &times;
          </button>
          <div className={styles.storySidebarTitle}>{t('Stories')}</div>
        </div>
        <div className={styles.storySidebarSection}>
          <div className={styles.storySidebarLabel}>{t('Your story')}</div>
          <div className={styles.storyCreateCard}>
            <div className={styles.storyCreateAvatar}>
              <img src={profile.avatar} alt={profile.name} />
            </div>
            <div>
              <div className={styles.storyCreateTitle}>{t('Create a story')}</div>
              <div className={styles.storyCreateSubtitle}>{t('Share a photo or write something.')}</div>
            </div>
            <button type="button" className={styles.storyCreatePlus}>+</button>
          </div>
        </div>
        <div className={styles.storySidebarSection}>
          <div className={styles.storySidebarLabel}>{t('All stories')}</div>
          <div className={styles.storySidebarList}>
            {groupedStories.map((group) => {
              const firstIdx = stories.findIndex((s) => s.userName === group.userName);
              return (
                <button
                  key={group.userName}
                  type="button"
                  className={`${styles.storySidebarItem} ${firstIdx === current ? styles.storySidebarItemActive : ''}`}
                  onClick={() => setCurrent(firstIdx)}
                >
                  <img src={group.userAvatar} alt={group.userName} />
                  <div>
                    <div className={styles.storySidebarName}>{group.userName}</div>
                    <div className={styles.storySidebarTime}>22h</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className={styles.storyViewerStage}>
        <div className={styles.storyViewerCard}>
          <div className={styles.storyViewerHeader}>
            <img src={story.userAvatar} alt={story.userName} />
            <div>
              <div className={styles.storyViewerName}>{t(story.userName)}</div>
              <div className={styles.storyViewerMeta}>22h</div>
            </div>
          </div>
          <div className={styles.storyViewerMedia}>
            {story.video ? (
              <video src={story.video} autoPlay muted controls />
            ) : story.image ? (
              <img src={story.image} alt={t(story.userName)} />
            ) : (
              <div className={styles.storyViewerText} style={{ background: story.background || '#111' }}>
                {story.text}
              </div>
            )}
          </div>
        </div>
        <button onClick={prevStory} className={styles.storyNavBtn} aria-label={t('Previous Story')}>
          &#8592;
        </button>
        <button onClick={nextStory} className={styles.storyNavBtn} aria-label={t('Next Story')}>
          &#8594;
        </button>
        <div className={styles.storyReplyBar}>
          <input type="text" placeholder={t('Reply...')} />
          <div className={styles.storyReactions}>
            <span>👍</span>
            <span>❤️</span>
            <span>😂</span>
            <span>😮</span>
            <span>😢</span>
            <span>😡</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesPage;
