import React, { useState } from 'react';
import { currentUser } from '../data/facebookData';

const CommentSection = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) return;
    setComments((prev) => [...prev, trimmed]);
    setComment('');
  };

  return (
    <div className="comment-section">
      <div className="comment-input">
        <img src={currentUser.avatar} alt={currentUser.name} />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </form>
      </div>

      <div className="comment-list">
        {comments.map((text, idx) => (
          <div key={idx} className="comment-item">
            <img src={currentUser.avatar} alt={currentUser.name} />
            <div className="comment-bubble">{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
