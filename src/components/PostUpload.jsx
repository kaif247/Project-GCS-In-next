import React, { useState } from 'react';
import { currentUser } from '../data/facebookData';

const PostUpload = () => {
  const [text, setText] = useState('');

  return (
    <div className="post-upload">
      <div className="post-upload__top">
        <img src={currentUser.avatar} alt={currentUser.name} className="post-upload__avatar" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
          aria-label="Create post"
        />
      </div>
      <div className="post-upload__actions">
        <button className="post-upload__action" type="button" aria-label="Live">
          <span className="post-upload__icon post-upload__icon--live" />
          Live
        </button>
        <button className="post-upload__action" type="button" aria-label="Photos">
          <span className="post-upload__icon post-upload__icon--photo" />
          Photos
        </button>
        <button className="post-upload__action" type="button" aria-label="Emojis">
          <span className="post-upload__icon post-upload__icon--emoji" />
          Emojis
        </button>
      </div>
    </div>
  );
};

export default PostUpload;
