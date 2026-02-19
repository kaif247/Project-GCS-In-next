import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import PostInput from '../components/PostInput';
import Post from '../components/Post';
import PostsPreview from '../components/FriendsSuggestions/PostsPreview';
import PhotosPreview from '../components/FriendsSuggestions/PhotosPreview';
import styles from '../components/FriendsSuggestions/friendsSuggestions.module.css';
import { currentUser, posts as feedPosts } from '../data/facebookData';
import useProfileData from '../hooks/useProfileData';
import useLocalPosts from '../hooks/useLocalPosts';
import useStories from '../hooks/useStories';

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
  const profileRuntime = useProfileData();
  const { posts: localPosts, addPost, removePost } = useLocalPosts();
  const { addStory } = useStories();
  const [isStoryComposerOpen, setIsStoryComposerOpen] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [storyImage, setStoryImage] = useState(null);
  const [storyVideo, setStoryVideo] = useState(null);
  const [storyBg, setStoryBg] = useState('dark');
  const storyFileRef = useRef(null);
  const storyVideoRef = useRef(null);

  const storyBgOptions = [
    { key: 'dark', color: '#1f1f1f' },
    { key: 'accent', color: '#FFD700' },
    { key: 'cyan', color: '#22c1c3' },
    { key: 'violet', color: '#4a00e0' },
    { key: 'rose', color: '#ff758c' },
    { key: 'mint', color: '#56ab2f' },
  ];
  const storyMode = storyVideo ? 'Video' : storyImage ? 'Photo' : 'Text';

  const handleStoryCreate = () => {
    if (!storyText.trim() && !storyImage && !storyVideo) return;
    addStory({
      userId: currentUser.id,
      userName: profileRuntime.name,
      userAvatar: profileRuntime.avatar,
      text: storyText.trim(),
      image: storyImage?.url || null,
      video: storyVideo?.url || null,
      backgroundKey: storyBg,
      hasViewed: false,
    });
    setStoryText('');
    setStoryImage(null);
    setStoryVideo(null);
    setIsStoryComposerOpen(false);
  };

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
      window.dispatchEvent(new Event('gcs-profile-updated'));
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

  const myPosts = useMemo(() => {
    const combined = [...localPosts, ...feedPosts].filter((post) => post.userId === currentUser.id);
    return combined.map((post) => ({
      ...post,
      userName: profileRuntime.name,
      userAvatar: profileRuntime.avatar,
    }));
  }, [localPosts, profileRuntime]);

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
            <button
              type="button"
              className="profile-action profile-action--primary"
              onClick={() => setIsStoryComposerOpen(true)}
            >
              + Add to story
            </button>
            <Link href="/profile/create" className="profile-action">
              Edit profile
            </Link>
          </div>
        </div>

        <div className={styles.profileTabs}>
          <button className={`${styles.tabBtn} ${styles.tabActive}`} type="button">All</button>
          <Link className={styles.tabBtn} href="/profile/posts">Posts</Link>
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
          <PostInput
            username={profileRuntime.name}
            avatarUrl={profileRuntime.avatar}
            onVideoClick={() => {}}
            onPhotoClick={() => {}}
            onEmojiClick={() => {}}
            onCreatePost={(payload) => {
              const newPost = {
                id: `local-${Date.now()}`,
                isLocal: true,
                userId: currentUser.id,
                userName: profileRuntime.name,
                userAvatar: profileRuntime.avatar,
                content: payload.content || '',
                hashtags: payload.tags || [],
                images: payload.images || [],
                video: payload.video || null,
                textBackground: payload.textBackground || null,
                textColor: payload.textColor || null,
                reactions: {},
                comments: 0,
                shares: 0,
                location: 'Profile',
                timestamp: 'Just now',
              };
              addPost(newPost);
            }}
          />
          <div className="posts-list">
            {myPosts.length > 0 ? (
              myPosts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  canDelete={String(post.id).startsWith('local-')}
                  onDelete={removePost}
                />
              ))
            ) : (
              <PostsPreview posts={profileData.posts} name={profileData.name} avatar={profileData.avatar} />
            )}
          </div>
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
      {isStoryComposerOpen && (
        <div className="story-modal-backdrop" onClick={() => setIsStoryComposerOpen(false)}>
          <div className="story-modal" onClick={(e) => e.stopPropagation()}>
            <div className="story-modal__header">
              <div className="story-modal__title">
                <span className="story-modal__badge">Story Lab</span>
                <h3>Create story</h3>
                <p>Share a new moment with your friends.</p>
              </div>
              <button type="button" onClick={() => setIsStoryComposerOpen(false)} className="story-modal__close">
                x
              </button>
            </div>
            <div className="story-modal__modes">
              {['Text', 'Photo', 'Video'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`story-mode-btn ${storyMode === mode ? 'active' : ''}`}
                >
                  {mode}
                </button>
              ))}
              <span className="story-modal__hint">24h visibility</span>
            </div>
            <div className="story-modal__preview story-modal__preview--story" data-bg={storyBg}>
              {storyImage && <img src={storyImage.url} alt="Story" />}
              {storyVideo && <video src={storyVideo.url} controls />}
              {!storyImage && !storyVideo && storyText && (
                <div className="story-modal__text">{storyText}</div>
              )}
            </div>
            <textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="Write something..."
            />
            <div className="story-modal__actions">
              <label className="story-modal__file">
                Add photo
                <input
                  ref={storyFileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setStoryImage({ name: file.name, url: reader.result });
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              <label className="story-modal__file">
                Add video
                <input
                  ref={storyVideoRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setStoryVideo({ name: file.name, url });
                  }}
                />
              </label>
            </div>
            <div className="story-modal__colors">
              {storyBgOptions.map((color) => (
                <button
                  key={color.key}
                  type="button"
                  className={`story-color-btn ${storyBg === color.key ? 'active' : ''}`}
                  data-bg={color.key}
                  onClick={() => setStoryBg(color.key)}
                />
              ))}
            </div>
            <button type="button" className="story-modal__submit" onClick={handleStoryCreate}>
              Share to story
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
