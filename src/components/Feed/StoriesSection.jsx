
import React from 'react';
import { useRouter } from 'next/router';
import styles from './StoriesSection.module.css';
import { stories } from '../../data/facebookData';


const StoriesSection = () => {
  const router = useRouter();
  return (
    <div className={styles.storiesSection}>
      {stories.map((story, idx) => (
        <div
          key={story.id}
          className={styles.storyCard}
          onClick={() => router.push(`/stories?start=${idx}`)}
          tabIndex={0}
          role="button"
          aria-label={`View story by ${story.userName}`}
        >
          <img src={story.image || story.userAvatar} alt={story.userName} className={styles.storyImage} />
          <span className={styles.user}>{story.userName}</span>
        </div>
      ))}
    </div>
  );
};

export default StoriesSection;
