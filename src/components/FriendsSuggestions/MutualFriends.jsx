import React from 'react';
import styles from './friendsSuggestions.module.css';

const MutualFriends = ({ count, avatars = [] }) => {
  return (
    <div className={styles.mutualFriends} title={`${count} mutual friends`}>
      <div className={styles.mutualAvatars}>
        {avatars.slice(0, 3).map((src, idx) => (
          <img key={src + idx} src={src} alt="Mutual friend" />
        ))}
      </div>
      <span>{count} mutual friends</span>
    </div>
  );
};

export default React.memo(MutualFriends);
