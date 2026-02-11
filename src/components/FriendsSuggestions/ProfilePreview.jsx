import React, { useContext } from 'react';
import MutualFriends from './MutualFriends';
import PhotosPreview from './PhotosPreview';
import PostsPreview from './PostsPreview';
import styles from './friendsSuggestions.module.css';
import { LanguageContext } from '../../context/LanguageContext';

const ProfilePreview = ({ profile, onToggleRequest, onMessage }) => {
  const coverImage = profile.cover || profile.photos?.[0];
  const { t } = useContext(LanguageContext);

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
            {profile.friendsCount} {t('Friends')} · {profile.mutualFriends} {t('mutual')}
          </div>
          <div className={styles.profileSubtitle}>{t('Digital creator')}</div>
          <MutualFriends count={profile.mutualFriends} avatars={profile.photos?.slice(0, 3)} />
        </div>
        <div className={styles.profileActions}>
          <button className={styles.secondaryBtn} type="button" onClick={() => onMessage?.(profile)}>
            {t('Message')}
          </button>
          <button className={styles.primaryBtn} type="button" onClick={onToggleRequest}>
            {profile.isRequestSent ? t('Cancel request') : t('Add friend')}
          </button>
          <button className={styles.secondaryBtn} type="button">
            {t('Search')}
          </button>
          <button className={styles.moreBtn} type="button" aria-label={t('More')}>
            ⋯
          </button>
        </div>
      </div>

      <div className={styles.profileTabs}>
        <button className={`${styles.tabBtn} ${styles.tabActive}`} type="button">{t('All')}</button>
        <button className={styles.tabBtn} type="button">{t('About')}</button>
        <button className={styles.tabBtn} type="button">{t('Photos')}</button>
        <button className={styles.tabBtn} type="button">{t('Friends')}</button>
        <button className={styles.tabBtn} type="button">{t('Reels')}</button>
        <button className={styles.tabBtn} type="button">{t('More')}</button>
        <button className={styles.moreBtn} type="button" aria-label={t('Menu')}>
          ⋯
        </button>
      </div>

      <div className={styles.profileDetails}>
        <div className={styles.profileSide}>
          <div className={styles.detailCard}>
            <h3>{t('Personal details')}</h3>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>🎂</span>
              <span>{t(profile.details.birthday)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>📍</span>
              <span>{t(profile.details.location)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>🎓</span>
              <span>{t(profile.details.education)}</span>
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








