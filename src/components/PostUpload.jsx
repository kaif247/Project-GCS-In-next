import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import useProfileData from '../hooks/useProfileData';

const PostUpload = () => {
  const [text, setText] = useState('');
  const { t } = useContext(LanguageContext);
  const profile = useProfileData();

  return (
    <div className="post-upload">
      <div className="post-upload__top">
        <img src={profile.avatar} alt={profile.name} className="post-upload__avatar" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("What's on your mind, {name}?", { name: profile.name.split(' ')[0] || profile.name })}
          aria-label={t('Create post')}
        />
      </div>
      <div className="post-upload__actions">
        <button className="post-upload__action" type="button" aria-label={t('Live')}>
          <span className="post-upload__icon post-upload__icon--live" />
          {t('Live')}
        </button>
        <button className="post-upload__action" type="button" aria-label={t('Photos')}>
          <span className="post-upload__icon post-upload__icon--photo" />
          {t('Photos')}
        </button>
        <button className="post-upload__action" type="button" aria-label={t('Emojis')}>
          <span className="post-upload__icon post-upload__icon--emoji" />
          {t('Emojis')}
        </button>
      </div>
    </div>
  );
};

export default PostUpload;
