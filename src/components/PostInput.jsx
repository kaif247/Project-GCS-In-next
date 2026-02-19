import React, { useContext, useMemo, useRef, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import Icon from './Icon';
import { friendsData } from '../data/friendsData';

const buildEmojiList = () => {
  const ranges = [
    [0x1f600, 0x1f64f],
    [0x1f300, 0x1f5ff],
    [0x1f680, 0x1f6ff],
    [0x1f900, 0x1f9ff],
  ];
  const list = [];
  ranges.forEach(([start, end]) => {
    for (let code = start; code <= end; code += 1) {
      list.push(String.fromCodePoint(code));
    }
  });
  return list;
};

const colorOptions = [
  { id: 'default', label: 'Default', bg: 'var(--bg-muted)', text: 'var(--text-primary)' },
  { id: 'sunset', label: 'Sunset', bg: 'linear-gradient(135deg, #f6b73c 0%, #FFD700 100%)', text: '#1b1b1b' },
  { id: 'ocean', label: 'Ocean', bg: 'linear-gradient(135deg, #22c1c3 0%, #5b86e5 100%)', text: '#0b1b2b' },
  { id: 'violet', label: 'Violet', bg: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', text: '#ffffff' },
  { id: 'mint', label: 'Mint', bg: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)', text: '#0e2411' },
  { id: 'rose', label: 'Rose', bg: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', text: '#3a0b1f' },
];

const PostInput = ({ username, avatarUrl, onVideoClick, onPhotoClick, onEmojiClick, onCreatePost }) => {
  const { t } = useContext(LanguageContext);
  const firstName = username?.split(' ')[0] || t('there');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [privacy, setPrivacy] = useState('Friends');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [media, setMedia] = useState([]);
  const [video, setVideo] = useState(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [tags, setTags] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [taggedFriends, setTaggedFriends] = useState([]);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const emojiList = useMemo(() => buildEmojiList(), []);

  const canPost = (postText.trim().length > 0 || media.length > 0) && !mediaLoading;
  const previewStyle = useMemo(
    () => ({
      background: selectedColor.bg,
      color: selectedColor.text,
    }),
    [selectedColor]
  );

  const openComposer = () => setIsComposerOpen(true);
  const closeComposer = () => {
    setIsComposerOpen(false);
    setPostText('');
    setPrivacy('Friends');
    setSelectedColor(colorOptions[0]);
    setMedia([]);
    setVideo(null);
    setTags('');
    setShowEmojiPicker(false);
    setShowTagPicker(false);
    setTagSearch('');
    setTaggedFriends([]);
  };

  const handleMediaChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const imageFiles = files.filter((file) => !file.type.startsWith('video/'));
    const videoFile = files.find((file) => file.type.startsWith('video/'));
    if (videoFile) {
      const objectUrl = URL.createObjectURL(videoFile);
      setVideo({ name: videoFile.name, url: objectUrl, objectUrl: true });
    }
    if (imageFiles.length) {
      setMediaLoading(true);
      const readers = imageFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({ name: file.name, url: e.target.result });
            reader.readAsDataURL(file);
          })
      );
      Promise.all(readers).then((images) => {
        setMedia((prev) => [...prev, ...images]);
        setMediaLoading(false);
      });
    }
  };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMediaLoading(true);
    const objectUrl = URL.createObjectURL(file);
    setVideo({ name: file.name, url: objectUrl, objectUrl: true });
    setMediaLoading(false);
  };

  const handleRemoveMedia = (index) => {
    setMedia((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handlePost = () => {
    if (!canPost) return;
    const tagNames = taggedFriends.map((friend) => friend.name);
    const tagSummary = tagNames.length
      ? `${postText.trim()} with ${tagNames.join(', ')}`
      : postText.trim();
    onCreatePost?.({
      content: tagSummary,
      images: media.map((item) => item.url),
      video: video?.url || null,
      privacy,
      tags: [
        ...tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
        ...tagNames,
      ],
      taggedFriends: tagNames,
      textStyle: selectedColor.id,
      textBackground: selectedColor.id === 'default' ? null : selectedColor.bg,
      textColor: selectedColor.id === 'default' ? null : selectedColor.text,
    });
    closeComposer();
  };

  const filteredFriends = useMemo(() => {
    if (!tagSearch.trim()) return friendsData;
    return friendsData.filter((friend) =>
      friend.name.toLowerCase().includes(tagSearch.toLowerCase())
    );
  }, [tagSearch]);

  const toggleFriendTag = (friend) => {
    setTaggedFriends((prev) => {
      const exists = prev.find((item) => item.id === friend.id);
      if (exists) return prev.filter((item) => item.id !== friend.id);
      return [...prev, friend];
    });
  };

  return (
    <>
      <section className="post-input-card">
        <div className="post-input-row">
          <img src={avatarUrl} alt={username} className="post-input-avatar" />
          <button type="button" className="post-input-field" onClick={openComposer}>
            {t("What's on your mind, {name}?", { name: firstName })}
          </button>
          <div className="post-input-actions">
            <button
              type="button"
              onClick={onVideoClick}
              className="post-input-icon-btn"
              aria-label={t('Video')}
            >
              <span className="post-input-icon post-input-icon--video">
                <Icon name="live" size={22} className="icon--no-circle" aria-hidden="true" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                openComposer();
                setTimeout(() => fileInputRef.current?.click(), 50);
              }}
              className="post-input-icon-btn"
              aria-label={t('Photo')}
            >
              <span className="post-input-icon post-input-icon--photo">
                <Icon name="photo-png" size={18} className="icon--no-circle" aria-hidden="true" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                onEmojiClick?.();
                openComposer();
                setShowEmojiPicker(true);
              }}
              className="post-input-icon-btn"
              aria-label={t('Emoji')}
            >
              <span className="post-input-icon post-input-icon--emoji">{'\u{1F60A}'}</span>
            </button>
          </div>
        </div>
      </section>

      {isComposerOpen && (
        <div className="post-composer-backdrop" onClick={closeComposer}>
          <div className="post-composer" onClick={(e) => e.stopPropagation()}>
            <header className="post-composer__header">
              <h3>{t('Create post')}</h3>
              <button type="button" className="post-composer__close" onClick={closeComposer}>
                x
              </button>
            </header>
            <div className="post-composer__profile">
              <img src={avatarUrl} alt={username} />
              <div>
                <div className="post-composer__name">{username}</div>
                <button
                  type="button"
                  className="post-composer__privacy"
                  onClick={() =>
                    setPrivacy((prev) => (prev === 'Friends' ? 'Public' : prev === 'Public' ? 'Only me' : 'Friends'))
                  }
                >
                  {privacy}
                </button>
              </div>
            </div>
            <div className="post-composer__input" style={previewStyle}>
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder={t("What's on your mind, {name}?", { name: firstName })}
              />
              <button
                type="button"
                className="post-composer__emoji"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                aria-label={t('Add emoji')}
              >
                {'\u{1F60A}'}
              </button>
              {showEmojiPicker && (
                <div className="post-emoji-picker">
                  {emojiList.map((emoji, index) => (
                    <button
                      key={`${emoji}-${index}`}
                      type="button"
                      className="post-emoji-btn"
                      onClick={() => setPostText((prev) => `${prev}${emoji}`)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="post-composer__colors">
              {colorOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`post-color-btn ${selectedColor.id === option.id ? 'active' : ''}`}
                  style={{ background: option.bg }}
                  onClick={() => setSelectedColor(option)}
                  aria-label={option.label}
                />
              ))}
            </div>

            {media.length > 0 && (
              <div className="post-composer__media">
                {media.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="post-media-thumb">
                    <img src={item.url} alt={item.name} />
                    <button type="button" onClick={() => handleRemoveMedia(index)}>
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
            {mediaLoading && (
              <div className="post-composer__media-status">
                {t('Loading media...')}
              </div>
            )}
            {video && (
              <div className="post-composer__media">
                <div className="post-media-thumb post-media-thumb--video">
                  <video src={video.url} controls />
                  <button type="button" onClick={() => setVideo(null)}>
                    x
                  </button>
                </div>
              </div>
            )}

            <div className="post-composer__add">
              <span>{t('Add to your post')}</span>
              <div className="post-composer__add-actions">
                <button type="button" onClick={() => fileInputRef.current?.click()}>
                  <Icon name="photo-png" size={18} className="icon--no-circle" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => videoInputRef.current?.click()}>
                  <Icon name="live" size={18} className="icon--no-circle" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => setShowTagPicker((prev) => !prev)}>
                  <Icon name="friends" size={18} className="icon--no-circle" aria-hidden="true" />
                </button>
              </div>
            </div>

            {showTagPicker && (
              <div className="post-tag-picker">
                <div className="post-tag-picker__header">
                  <span>{t('Tag friends')}</span>
                  <button type="button" onClick={() => setShowTagPicker(false)}>x</button>
                </div>
                <input
                  type="text"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder={t('Search friends')}
                />
                <div className="post-tag-picker__list">
                  {filteredFriends.map((friend) => {
                    const selected = taggedFriends.some((item) => item.id === friend.id);
                    return (
                      <button
                        key={friend.id}
                        type="button"
                        className={`post-tag-picker__item ${selected ? 'selected' : ''}`}
                        onClick={() => toggleFriendTag(friend)}
                      >
                        <img src={friend.profileImage} alt={friend.name} />
                        <span>{friend.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {taggedFriends.length > 0 && (
              <div className="post-tagged-summary">
                {t('With')}{' '}
                {taggedFriends.map((friend) => (
                  <span key={friend.id} className="post-tagged-chip">
                    {friend.name}
                  </span>
                ))}
              </div>
            )}

            <div className="post-composer__tags">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={t('Add tags (comma separated)')}
              />
            </div>

            <button
              type="button"
              className="post-composer__submit"
              onClick={handlePost}
              disabled={!canPost}
            >
              {mediaLoading ? t('Please wait...') : t('Post')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="post-composer__file"
              onChange={handleMediaChange}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="post-composer__file"
              onChange={handleVideoChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PostInput;
