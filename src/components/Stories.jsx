import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useProfileData from '../hooks/useProfileData';
import { currentUser } from '../data/facebookData';
import useStories from '../hooks/useStories';

const StoryCard = ({ story, isCreate, profile, onCreate, onView }) => {
  if (isCreate) {
    return (
      <div className="story-card create-story" onClick={onCreate} role="button" tabIndex={0}>
        <div className="story-avatar-wrap">
          <img src={profile.avatar} alt={profile.name} className="story-avatar" />
        </div>
        <button className="create-story-btn" aria-label="Create story">
          +
        </button>
        <p className="story-label">{profile.name}</p>
      </div>
    );
  }

  return (
    <div
      className="story-card"
      data-bg={story.backgroundKey || 'dark'}
      onClick={onView}
      role="button"
      tabIndex={0}
    >
      {story.image && <img src={story.image} alt="" className="story-bg-image" />}
      {!story.image && story.video && (
        <video
          className="story-bg-video"
          src={story.video}
          muted
          playsInline
          preload="metadata"
        />
      )}
      <div className="story-overlay"></div>
      <div className="story-avatar-wrap">
        <img src={story.userAvatar || profile.avatar} alt={story.userName || profile.name} className="story-avatar" />
        <div className={`story-ring ${!story.hasViewed ? 'unviewed' : 'viewed'}`}></div>
      </div>
      {story.text && <div className="story-text">{story.text}</div>}
      <p className="story-label">{story.userName || profile.name}</p>
    </div>
  );
};

const Stories = () => {
  const scrollContainerRef = useRef(null);
  const router = useRouter();
  const profile = useProfileData();
  const { stories, addStory } = useStories();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [storyImage, setStoryImage] = useState(null);
  const [storyVideo, setStoryVideo] = useState(null);
  const [storyBg, setStoryBg] = useState('dark');

  const backgroundOptions = [
    { key: 'dark', color: '#1f1f1f' },
    { key: 'accent', color: '#FFD700' },
    { key: 'cyan', color: '#22c1c3' },
    { key: 'violet', color: '#4a00e0' },
    { key: 'rose', color: '#ff758c' },
    { key: 'mint', color: '#56ab2f' },
  ];
  const activeMode = storyVideo ? 'Video' : storyImage ? 'Photo' : 'Text';

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleCreateStory = () => {
    if (!storyText.trim() && !storyImage && !storyVideo) return;
    addStory({
      userId: currentUser.id,
      userName: profile.name,
      userAvatar: profile.avatar,
      text: storyText.trim(),
      image: storyImage?.url || null,
      video: storyVideo?.url || null,
      createdAt: Date.now(),
      backgroundKey: storyBg,
      hasViewed: false,
    });
    setStoryText('');
    setStoryImage(null);
    setStoryVideo(null);
    setIsComposerOpen(false);
  };

  const groupedStories = useMemo(() => {
    const map = new Map();
    stories.forEach((story) => {
      const key = story.userId || story.userName || 'unknown';
      if (!map.has(key)) {
        map.set(key, {
          userId: story.userId,
          userName: story.userName,
          userAvatar: story.userAvatar,
          stories: [],
        });
      }
      map.get(key).stories.push(story);
    });
    return Array.from(map.values()).map((group) => {
      const sorted = [...group.stories].sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      );
      const latest = sorted[0];
      return {
        ...latest,
        userId: group.userId,
        userName: group.userName,
        userAvatar: group.userAvatar,
      };
    });
  }, [stories]);

  return (
    <div className="stories-container">
      <button
        className="scroll-btn left"
        onClick={() => scroll('left')}
        aria-label="Scroll stories left"
      >
        ‹
      </button>

      <div className="stories-wrapper" ref={scrollContainerRef}>
        <StoryCard isCreate profile={profile} onCreate={() => setIsComposerOpen(true)} />
        {groupedStories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            profile={profile}
            onView={() => router.push(`/stories/${story.id}`)}
          />
        ))}
      </div>

      <button
        className="scroll-btn right"
        onClick={() => scroll('right')}
        aria-label="Scroll stories right"
      >
        ›
      </button>

      {isComposerOpen && (
        <div className="story-modal-backdrop" onClick={() => setIsComposerOpen(false)}>
          <div className="story-modal" onClick={(e) => e.stopPropagation()}>
            <div className="story-modal__header">
              <div className="story-modal__title">
                <span className="story-modal__badge">Story Lab</span>
                <h3>Create story</h3>
                <p>Design a cinematic story in seconds.</p>
              </div>
              <button type="button" onClick={() => setIsComposerOpen(false)} className="story-modal__close">
                x
              </button>
            </div>
            <div className="story-modal__modes">
              {['Text', 'Photo', 'Video'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`story-mode-btn ${activeMode === mode ? 'active' : ''}`}
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
              {backgroundOptions.map((color) => (
                <button
                  key={color.key}
                  type="button"
                  className={`story-color-btn ${storyBg === color.key ? 'active' : ''}`}
                  data-bg={color.key}
                  onClick={() => setStoryBg(color.key)}
                />
              ))}
            </div>
            <button type="button" className="story-modal__submit" onClick={handleCreateStory}>
              Share to story
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
