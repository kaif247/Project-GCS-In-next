
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import styles from './StoriesSection.module.css';
import { stories } from '../../data/facebookData';
import { LanguageContext } from '../../context/LanguageContext';


const StoriesSection = () => {
  const router = useRouter();
  const { t } = useContext(LanguageContext);
  return (
    <div className={styles.storiesSection}>
      {stories.map((story, idx) => (
        <div
          key={story.id}
          className={styles.storyCard}
          onClick={() => router.push(`/stories?start=${idx}`)}
          tabIndex={0}
          role="button"
          aria-label={t('View story by {name}', { name: t(story.userName) })}
        >
          <img src={story.image || story.userAvatar} alt={t(story.userName)} className={styles.storyImage} />
          <span className={styles.user}>{t(story.userName)}</span>
        </div>
      ))}
    </div>
  );
};

export default StoriesSection;
