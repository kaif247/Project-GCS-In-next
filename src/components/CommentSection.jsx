import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import useProfileData from '../hooks/useProfileData';

const CommentSection = ({ comments = [], onAddComment, showAll = false, onToggleView, showAllLabel }) => {
  const [comment, setComment] = useState('');
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
            <img src={item.avatar} alt={item.name} />
            <div className="comment-bubble">
              <strong>{item.name}</strong>
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
    </div>
  );
};

export default CommentSection;

