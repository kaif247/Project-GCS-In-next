import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import CreatePost from '../components/CreatePost';
import PostsPreview from '../components/FriendsSuggestions/PostsPreview';
import PhotosPreview from '../components/FriendsSuggestions/PhotosPreview';
import styles from '../components/FriendsSuggestions/friendsSuggestions.module.css';

const STORAGE_KEY = 'gcs-profile';

const fallbackPhotos = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop',
];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [modalImage, setModalImage] = useState('');
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (error) {
        setProfile(null);
      }
    }
  }, []);

  const updateProfile = (next) => {
    setProfile(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  };

  const handleImageUpload = (field) => (event) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ ...profile, [field]: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const profileData = useMemo(() => {
    if (!profile) return null;
    const photos = [profile.coverUrl, profile.avatarUrl, ...fallbackPhotos].filter(Boolean);
    return {
      id: 1,
      name: profile.name,
      avatar: profile.avatarUrl,
      cover: profile.coverUrl,
      friendsCount: 1,
      mutualFriends: 0,
      isRequestSent: false,
      photos,
      details: {
        birthday: 'Birthday not set',
        location: profile.location || 'Location not set',
        education: profile.education || 'Education not set',
      },
      posts: [
        {
          id: 1,
          time: 'Just now',
          location: profile.location || 'Your city',
          text: profile.bio || 'Welcome to my profile!',
          images: photos.slice(0, 2),
        },
        {
          id: 2,
          time: '1d',
          location: profile.location || 'Your city',
          text: 'Sharing a new update on my profile.',
          images: photos.slice(1, 3),
        },
      ],
    };
  }, [profile]);

  if (!profileData) {
    return (
      <div className="profile-empty">
        <h1>No profile yet</h1>
        <p>Create your profile to get started.</p>
        <Link href="/profile/create" className="profile-empty-link">
          Create profile
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <div className="profile-cover-wrap">
          <div className={styles.profileCover}>
            {profileData.cover && (
              <img
                src={profileData.cover}
                alt=""
                className={styles.coverImage}
                onClick={() => setModalImage(profileData.cover)}
              />
            )}
          </div>
          <button
            type="button"
            className="profile-edit-cover"
            onClick={() => coverInputRef.current?.click()}
          >
            <span className="profile-edit-cover__icon">📷</span>
            Edit cover photo
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="profile-hidden-input"
            onChange={handleImageUpload('coverUrl')}
          />
        </div>

        <div className={styles.profileHeader}>
          <div className="profile-avatar-wrap">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className={styles.profileAvatar}
              onClick={() => setModalImage(profileData.avatar)}
            />
            <button
              type="button"
              className="profile-avatar-edit"
              aria-label="Edit avatar"
              onClick={() => avatarInputRef.current?.click()}
            >
              📷
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="profile-hidden-input"
              onChange={handleImageUpload('avatarUrl')}
            />
          </div>
          <div className={styles.profileMeta}>
            <h2>{profileData.name}</h2>
            <div className={styles.profileCounts}>
              {profileData.friendsCount} Friends · {profileData.mutualFriends} mutual
            </div>
            <div className={styles.profileSubtitle}>Digital creator</div>
          </div>
          <div className="profile-actions">
            <button type="button" className="profile-action profile-action--primary">
              + Add to story
            </button>
            <Link href="/profile/create" className="profile-action">
              Edit profile
            </Link>
          </div>
        </div>

        <div className={styles.profileTabs}>
          <button className={`${styles.tabBtn} ${styles.tabActive}`} type="button">All</button>
          <button className={styles.tabBtn} type="button">About</button>
          <button className={styles.tabBtn} type="button">Friends</button>
          <button className={styles.tabBtn} type="button">Photos</button>
          <button className={styles.tabBtn} type="button">Reels</button>
          <button className={styles.tabBtn} type="button">More</button>
          <button className={styles.moreBtn} type="button" aria-label="Menu">⋯</button>
        </div>
      </div>

      <div className={styles.profileDetails}>
        <div className={styles.profileSide}>
          <div className={styles.detailCard}>
            <h3>Personal details</h3>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>🎂</span>
              <span>{profileData.details.birthday}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>📍</span>
              <span>{profileData.details.location}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>🎓</span>
              <span>{profileData.details.education}</span>
            </div>
          </div>
          <PhotosPreview photos={profileData.photos} />
        </div>

        <div className={styles.profilePosts}>
          <CreatePost />
          <PostsPreview posts={profileData.posts} name={profileData.name} avatar={profileData.avatar} />
        </div>
      </div>
      {modalImage && (
        <div className="profile-image-modal" onClick={() => setModalImage('')}>
          <div className="profile-image-modal__content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="Profile" />
            <button type="button" onClick={() => setModalImage('')}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
