import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import Icon from './Icon';

const PostInput = ({ username, avatarUrl, onVideoClick, onPhotoClick, onEmojiClick }) => {
  const { t } = useContext(LanguageContext);
  const firstName = username?.split(' ')[0] || t('there');

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
              <Icon name="live2" size={22} className="icon--no-circle" aria-hidden="true" />
            </span>
          </button>
          <button
            type="button"
            onClick={onPhotoClick}
            className="post-input-icon-btn"
            aria-label={t('Photo')}
          >
            <span className="post-input-icon post-input-icon--photo">
              <Icon name="photo2" size={18} className="icon--no-circle" aria-hidden="true" />
            </span>
          </button>
          <button
            type="button"
            onClick={onEmojiClick}
            className="post-input-icon-btn"
            aria-label={t('Emoji')}
          >
            <span className="post-input-icon post-input-icon--emoji">{'\u{1F60A}'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PostInput;
