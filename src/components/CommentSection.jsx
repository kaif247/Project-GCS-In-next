import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import useProfileData from '../hooks/useProfileData';
import CommentProfileModal from './CommentProfileModal';

const CommentSection = ({ comments = [], onAddComment, showAll = false, onToggleView, showAllLabel }) => {
  const [comment, setComment] = useState('');
  const [activeProfile, setActiveProfile] = useState(null);
  const { t } = useContext(LanguageContext);
  const profile = useProfileData();

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) return;
    onAddComment?.(trimmed);
    setComment('');
  };

  return (
    <div className="comment-section">
      <div className="comment-input">
        <img src={profile.avatar} alt={profile.name} />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t('Write a comment, {name}...', { name: profile.name.split(' ')[0] || profile.name })}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </form>
      </div>

      <div className="comment-list">
        {(showAll ? comments : comments.slice(0, 1)).map((item) => (
          <div key={item.id} className="comment-item">
            <button
              type="button"
              className="comment-profile-btn"
              onClick={() => setActiveProfile(item)}
              aria-label={t('User profile')}
            >
              <img src={item.avatar} alt={item.name} />
            </button>
            <div className="comment-bubble">
              <button
                type="button"
                className="comment-name-btn"
                onClick={() => setActiveProfile(item)}
              >
                {item.name}
              </button>
              <span>{item.text}</span>
            </div>
          </div>
        ))}
        {comments.length > 1 && (
          <button type="button" className="post-comment-toggle" onClick={onToggleView}>
            {showAllLabel || 'See more comments'}
          </button>
        )}
      </div>
      <CommentProfileModal user={activeProfile} onClose={() => setActiveProfile(null)} />
    </div>
  );
};

export default CommentSection;

