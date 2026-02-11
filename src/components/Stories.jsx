import React, { useRef } from 'react';
import { stories } from '../data/facebookData';

const StoryCard = ({ story, isCreate }) => {
  if (isCreate) {
    return (
      <div className="story-card create-story">
        <div className="story-avatar-wrap">
          <img src={story.userAvatar} alt={story.userName} className="story-avatar" />
        </div>
        <button className="create-story-btn" aria-label="Create story">
          +
        </button>
        <p className="story-label">{story.userName}</p>
      </div>
    );
  }

  return (
    <div className="story-card" style={{ backgroundImage: `url(${story.image})` }}>
      <div className="story-overlay"></div>
      <div className="story-avatar-wrap">
        <img src={story.userAvatar} alt={story.userName} className="story-avatar" />
        <div className={`story-ring ${!story.hasViewed ? 'unviewed' : 'viewed'}`}></div>
      </div>
      <p className="story-label">{story.userName}</p>
    </div>
  );
};

const Stories = () => {
  const scrollContainerRef = useRef(null);

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
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            isCreate={story.type === 'create'}
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
    </div>
  );
};

export default Stories;
