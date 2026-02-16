import React, { useState } from 'react';
import styles from './StoryReactions.module.css';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];
const OFFSET_CLASSES = [styles.offsetLeft, styles.offsetCenterLeft, styles.offsetCenter, styles.offsetCenterRight, styles.offsetRight];

const StoryReactions = () => {
  const [bursts, setBursts] = useState([]);

  const handleReact = (emoji) => {
    const id = `${Date.now()}-${Math.random()}`;
    const offsetClass = OFFSET_CLASSES[Math.floor(Math.random() * OFFSET_CLASSES.length)];
    setBursts((prev) => [...prev, { id, emoji, offsetClass }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  };

  return (
    <div className={styles.reactions}>
      <div className={styles.bursts}>
        {bursts.map((burst) => (
          <span key={burst.id} className={`${styles.floatEmoji} ${burst.offsetClass}`}>
            {burst.emoji}
          </span>
        ))}
      </div>
      <div className={styles.row}>
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className={styles.emojiBtn}
            onClick={() => handleReact(emoji)}
            aria-label={`React ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(StoryReactions);
