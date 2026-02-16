import React from 'react';
import styles from './StorySidebar.module.css';

const StorySidebar = ({ groups, activeIndex, onSelect }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.title}>Stories</div>
        <div className={styles.links}>
          <button type="button">Archive</button>
          <button type="button">Settings</button>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Your story</div>
        <div className={styles.createCard}>
          <div className={styles.createAvatar}>+</div>
          <div>
            <div className={styles.createTitle}>Create a story</div>
            <div className={styles.createSub}>Share a photo or write something.</div>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>All stories</div>
        <div className={styles.list}>
          {groups.map((group, idx) => (
            <button
              key={group.userName || idx}
              type="button"
              className={`${styles.item} ${idx === activeIndex ? styles.active : ''}`}
              onClick={() => onSelect(idx)}
            >
              <div className={`${styles.ring} ${group.stories[0]?.hasViewed ? styles.viewed : styles.unviewed}`}>
                <img src={group.userAvatar} alt={group.userName} />
              </div>
              <div>
                <div className={styles.name}>{group.userName}</div>
                <div className={styles.time}>22h</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default React.memo(StorySidebar);
