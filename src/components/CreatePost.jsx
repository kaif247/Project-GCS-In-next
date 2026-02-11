import React, { useState } from 'react';
import { currentUser } from '../data/facebookData';

const CreatePost = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [postText, setPostText] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (postText.trim()) {
      console.log('Post submitted:', postText);
      setPostText('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        {/* User Avatar */}
        <div className="post-avatar-section">
          <img src={currentUser.avatar} alt={currentUser.name} className="post-avatar" />
        </div>

        {/* Input Section */}
        <div className="post-input-section">
          <input
            type="text"
            placeholder="What's on your mind, Kaif?"
            className="post-input"
            onFocus={() => setIsExpanded(true)}
            onClick={() => setIsExpanded(true)}
            readOnly
            aria-label="Create post"
          />
        </div>

        {/* Expanded Section */}
        {isExpanded && (
          <div className="post-expanded">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's on your mind, Kaif?"
              className="post-textarea"
              aria-label="Post content"
            />

            {/* Action Icons */}
            <div className="post-actions">
              <button className="action-btn live-video" title="Live Video">
                <span className="action-icon">📹</span>
                <span className="action-label">Live Video</span>
              </button>
              <button className="action-btn photo-video" title="Photo/Video">
                <span className="action-icon">🖼️</span>
                <span className="action-label">Photo/Video</span>
              </button>
              <button className="action-btn feeling-activity" title="Feeling/Activity">
                <span className="action-icon">😊</span>
                <span className="action-label">Feeling/Activity</span>
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="post-buttons">
              <button
                className="post-cancel-btn"
                onClick={() => {
                  setIsExpanded(false);
                  setPostText('');
                }}
              >
                Cancel
              </button>
              <button
                className="post-submit-btn"
                onClick={handlePostSubmit}
                disabled={!postText.trim()}
              >
                Post
              </button>
            </div>
          </div>
        )}

        {/* Compact Action Icons */}
        {!isExpanded && (
          <div className="post-compact-actions">
            <button className="compact-action-btn live-video" title="Live Video">
              <span>📹</span>
              Live Video
            </button>
            <button className="compact-action-btn photo-video" title="Photo/Video">
              <span>🖼️</span>
              Photo/Video
            </button>
            <button className="compact-action-btn feeling-activity" title="Feeling/Activity">
              <span>😊</span>
              Feeling/Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
