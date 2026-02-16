
import React, { useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import styles from './StoriesSection.module.css';
import { LanguageContext } from '../../context/LanguageContext';
import useProfileData from '../../hooks/useProfileData';
import useStories from '../../hooks/useStories';


const StoriesSection = () => {
  const router = useRouter();
  const { t } = useContext(LanguageContext);
  const profile = useProfileData();
  const { stories } = useStories();
  const resolvedStories = stories.map((story) =>
    story.userName ? story : { ...story, userAvatar: profile.avatar, userName: profile.name }
  );
  const groupedStories = useMemo(() => {
    const map = new Map();
    resolvedStories.forEach((story) => {
      const key = story.userId || story.userName || 'unknown';
      if (!map.has(key)) {
        map.set(key, {
          userId: story.userId,
          userName: story.userName,
          userAvatar: story.userAvatar,
          stories: [],
        });
      }
      map.get(key).stories.push(story);
    });
    return Array.from(map.values()).map((group) => {
      const sorted = [...group.stories].sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      );
      const latest = sorted[0];
      return {
        ...latest,
        userId: group.userId,
        userName: group.userName,
        userAvatar: group.userAvatar,
      };
    });
  }, [resolvedStories]);
  return (
    <div className={styles.storiesSection}>
      {groupedStories.map((story, idx) => (
        <div
          key={story.id}
          className={styles.storyCard}
          onClick={() => router.push(`/stories/${story.id}`)}
          tabIndex={0}
          role="button"
          aria-label={t('View story by {name}', { name: t(story.userName) })}
        >
          {story.video ? (
            <video
              src={story.video}
              className={styles.storyImage}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img src={story.image || story.userAvatar} alt={t(story.userName)} className={styles.storyImage} />
          )}
          <span className={styles.user}>{t(story.userName)}</span>
        </div>
      ))}
    </div>
  );
};

export default StoriesSection;
