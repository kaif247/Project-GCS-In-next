import React from 'react';

const PostInput = ({ username, avatarUrl, onVideoClick, onPhotoClick, onEmojiClick }) => {
  const firstName = username?.split(' ')[0] || 'there';

  return (
    <section className="post-input-card">
      <div className="post-input-row">
        <img
          src={avatarUrl}
          alt={username}
          className="post-input-avatar"
        />
        <button
          type="button"
          className="post-input-field"
        >
          {`What's on your mind, ${firstName}?`}
        </button>
        <div className="post-input-actions">
          <button
            type="button"
            onClick={onVideoClick}
            className="post-input-icon-btn"
            aria-label="Video"
          >
            <span className="post-input-icon post-input-icon--video">🎥</span>
          </button>
          <button
            type="button"
            onClick={onPhotoClick}
            className="post-input-icon-btn"
            aria-label="Photo"
          >
            <span className="post-input-icon post-input-icon--photo">🖼️</span>
          </button>
          <button
            type="button"
            onClick={onEmojiClick}
            className="post-input-icon-btn"
            aria-label="Emoji"
          >
            <span className="post-input-icon post-input-icon--emoji">😊</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PostInput;
