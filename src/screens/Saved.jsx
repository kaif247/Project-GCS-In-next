import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import useSavedPosts from '../hooks/useSavedPosts';
import Post from '../components/Post';

const Saved = () => {
  const { t } = useContext(LanguageContext);
  const { saved } = useSavedPosts();

  if (!saved.length) {
    return (
      <div className="saved-page">
        <h1>{t('Saved')}</h1>
        <p>{t('No saved posts yet.')}</p>
      </div>
    );
  }

  return (
    <div className="saved-page">
      <h1>{t('Saved')}</h1>
      <div className="posts-list">
        {saved.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Saved;
