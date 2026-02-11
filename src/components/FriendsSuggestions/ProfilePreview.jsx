import React from 'react';
import MutualFriends from './MutualFriends';
import PhotosPreview from './PhotosPreview';
import PostsPreview from './PostsPreview';
import styles from './friendsSuggestions.module.css';

const ProfilePreview = ({ profile, onToggleRequest, onMessage }) => {
  const coverImage = profile.cover || profile.photos?.[0];

  return (
    <section className={styles.profilePreview}>
      <div className={styles.profileCover}>
        {coverImage && <img src={coverImage} alt="" className={styles.coverImage} />}
      </div>

      <div className={styles.profileHeader}>
        <img src={profile.avatar} alt={profile.name} className={styles.profileAvatar} />
        <div className={styles.profileMeta}>
          <h2>{profile.name}</h2>
          <div className={styles.profileCounts}>
            {profile.friendsCount} friends · {profile.mutualFriends} mutual
          </div>
          <div className={styles.profileSubtitle}>Digital creator</div>
          <MutualFriends count={profile.mutualFriends} avatars={profile.photos?.slice(0, 3)} />
        </div>
        <div className={styles.profileActions}>
          <button className={styles.secondaryBtn} type="button" onClick={() => onMessage?.(profile)}>
            Message
          </button>
          <button className={styles.primaryBtn} type="button" onClick={onToggleRequest}>
            {profile.isRequestSent ? 'Cancel request' : 'Add friend'}
          </button>
          <button className={styles.secondaryBtn} type="button">
            Search
          </button>
          <button className={styles.moreBtn} type="button" aria-label="More">
            ⋯
          </button>
        </div>
      </div>

      <div className={styles.profileTabs}>
        <button className={`${styles.tabBtn} ${styles.tabActive}`} type="button">All</button>
        <button className={styles.tabBtn} type="button">About</button>
        <button className={styles.tabBtn} type="button">Photos</button>
        <button className={styles.tabBtn} type="button">Friends</button>
        <button className={styles.tabBtn} type="button">Reels</button>
        <button className={styles.tabBtn} type="button">More</button>
        <button className={styles.moreBtn} type="button" aria-label="Menu">
          ⋯
        </button>
      </div>

      <div className={styles.profileDetails}>
        <div className={styles.profileSide}>
          <div className={styles.detailCard}>
            <h3>Personal details</h3>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>🎂</span>
              <span>{profile.details.birthday}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>📍</span>
              <span>{profile.details.location}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>🎓</span>
              <span>{profile.details.education}</span>
            </div>
          </div>
          <PhotosPreview photos={profile.photos} />
        </div>

        <div className={styles.profilePosts}>
          <PostsPreview posts={profile.posts} name={profile.name} avatar={profile.avatar} />
        </div>
      </div>
    </section>
  );
};

export default ProfilePreview;
