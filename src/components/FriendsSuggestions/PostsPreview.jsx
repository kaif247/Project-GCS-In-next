import React, { useMemo, useState, useContext } from 'react';
import Icon from '../Icon';
import styles from './friendsSuggestions.module.css';
import { LanguageContext } from '../../context/LanguageContext';
import useProfileData from '../../hooks/useProfileData';
import CommentProfileModal from '../CommentProfileModal';

const PostsPreview = ({ posts = [], name, avatar }) => {
  const [likedIds, setLikedIds] = useState(new Set());
  const [activeShare, setActiveShare] = useState(null);
  const [activeComment, setActiveComment] = useState(null);
  const [imageModal, setImageModal] = useState(null); // { post, index }
  const [imageComments, setImageComments] = useState({});
  const [activeProfile, setActiveProfile] = useState(null);
  const { t } = useContext(LanguageContext);
  const profile = useProfileData();

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const likedByText = useMemo(() => {
    if (!activeComment) return '';
    return profile.name;
  }, [activeComment, profile.name]);

  const handleImageComment = (postId, index, text) => {
    if (!text.trim()) return;
    const key = `${postId}-${index}`;
    setImageComments((prev) => {
      const next = { ...prev };
      next[key] = [
        ...(next[key] || []),
        {
          id: `${postId}-${Date.now()}`,
          text: text.trim(),
          name: profile.name,
          avatar: profile.avatar,
        },
      ];
      return next;
    });
  };

  return (
    <div className={styles.detailCard}>
      <div className={styles.cardHeader}>
        <h3>{t('Posts')}</h3>
        <button type="button" className={styles.filterBtn}>{t('Filters')}</button>
      </div>
      {posts.map((post) => {
        const liked = likedIds.has(post.id);
        return (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-header-left">
                <img src={avatar} alt={name} className="post-user-avatar" />
                <div className="post-user-info">
                  <h3 className="post-user-name">{name}</h3>
                  <p className="post-meta">
                    {t(post.time)} - {t(post.location)}
                  </p>
                </div>
              </div>
              <button className="post-menu-btn" aria-label={t('Post options')} title={t('More options')}>...</button>
            </div>
            <div className="post-content">
              <p className="post-text">
                {t(post.text).length > 160 ? `${t(post.text).slice(0, 160)}... ` : t(post.text)}
                <button type="button" className="post-link-btn">{t('See more')}</button>
              </p>
            </div>
            {post.video && (
              <div className="post-video">
                <video src={post.video} controls poster={post.videoPoster} />
              </div>
            )}
            {post.images?.length > 0 && (
              <div className={`post-images ${post.images.length === 1 ? 'single' : 'multiple'}`}>
                {post.images.map((src, idx) => (
                  <div
                    key={src + idx}
                    className="post-image-wrapper"
                    role="button"
                    tabIndex={0}
                    onClick={() => setImageModal({ post, index: idx })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setImageModal({ post, index: idx });
                    }}
                  >
                    <img src={src} alt="Post" loading="lazy" className="post-image" />
                  </div>
                ))}
              </div>
            )}
            <div className="post-stats">
              <div className="reactions-summary">
                <div className="reaction-icons">
                  {liked && <Icon name="like" size={16} className="reaction-icon" aria-hidden="true" />}
                </div>
                <span className="reactions-count">{liked ? 1 : 0}</span>
              </div>
              <div className="interaction-counts">
                <span><button className="post-link-btn" type="button" onClick={() => setActiveComment(post)}>{t('comments')}</button></span>
                <span><button className="post-link-btn" type="button" onClick={() => setActiveShare(post)}>{t('shares')}</button></span>
              </div>
            </div>
            {liked && <div className="liked-by">{profile.name}</div>}
            <div className="post-actions-bar">
              <button className={`action-btn ${liked ? 'liked' : ''}`} type="button" onClick={() => toggleLike(post.id)}>
                <Icon name="like" size={16} className="icon--no-circle" aria-hidden="true" />
                <span>{t('Like')}</span>
              </button>
              <button className="action-btn" type="button" onClick={() => setActiveComment(post)}>
                <Icon name="comment" size={16} className="icon--no-circle comment-icon" aria-hidden="true" />
                <span>{t('Comment')}</span>
              </button>
              <button className="action-btn" type="button" onClick={() => setActiveShare(post)}>
                <Icon name="share" size={16} className="icon--no-circle" aria-hidden="true" />
                <span>{t('Share')}</span>
              </button>
            </div>
            <div className="post-quick-comment">
              <img src={profile.avatar} alt={profile.name} />
              <input type="text" placeholder={t('Comment as {name}', { name: profile.name })} />
              <button className="quick-comment-btn" type="button">{'\u2192'}</button>
            </div>
          </div>
        );
      })}

      {activeShare && (
        <div className="post-modal-backdrop" onClick={() => setActiveShare(null)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>{t('Share')}</h3>
              <button type="button" className="post-modal__close" onClick={() => setActiveShare(null)}>x</button>
            </div>
            <div className="post-modal__body">
              <div className="post-modal__user">
                <img src={profile.avatar} alt={profile.name} />
                <div>
                  <div className="post-modal__name">{profile.name}</div>
                  <button type="button" className="post-modal__audience">{t('Friends')}</button>
                </div>
              </div>
              <textarea placeholder={t('Say something about this...')} rows={4} />
              <button type="button" className="post-modal__primary">{t('Share now')}</button>
            </div>
          </div>
        </div>
      )}

      {activeComment && (
        <div className="post-modal-backdrop" onClick={() => setActiveComment(null)}>
          <div className="post-modal post-modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>{t("{name}'s post", { name })}</h3>
              <button type="button" className="post-modal__close" onClick={() => setActiveComment(null)}>x</button>
            </div>
            <div className="post-modal__body">
              <div className="post-content">
                <p className="post-text">{t(activeComment.text)}</p>
              </div>
              {activeComment.video && (
                <div className="post-video">
                  <video src={activeComment.video} controls poster={activeComment.videoPoster} />
                </div>
              )}
              {activeComment.images?.length > 0 && (
                <div className={`post-images ${activeComment.images.length === 1 ? 'single' : 'multiple'}`}>
                  {activeComment.images.map((src, idx) => (
                    <div key={src + idx} className="post-image-wrapper">
                      <img src={src} alt="Post" loading="lazy" className="post-image" />
                    </div>
                  ))}
                </div>
              )}
              {likedByText && <div className="liked-by">{likedByText}</div>}
              <div className="post-quick-comment">
                <img src={profile.avatar} alt={profile.name} />
                <input type="text" placeholder={t('Comment as {name}', { name: profile.name })} />
                <button className="quick-comment-btn" type="button">{'\u2192'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {imageModal && imageModal.post?.images && (
        <div className="post-modal-backdrop post-modal-backdrop--photo" onClick={() => setImageModal(null)}>
          <div className="post-photo-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="post-modal__close" onClick={() => setImageModal(null)}>
              x
            </button>
            <button
              type="button"
              className="post-photo-nav"
              aria-label={t('Previous photo')}
              onClick={() =>
                setImageModal((prev) => ({
                  ...prev,
                  index: (prev.index - 1 + imageModal.post.images.length) % imageModal.post.images.length,
                }))
              }
            >
              {'\u2039'}
            </button>
            <img
              src={imageModal.post.images[imageModal.index]}
              alt={t("{name}'s photo", { name })}
              className="post-photo-image"
            />
            <button
              type="button"
              className="post-photo-nav"
              aria-label={t('Next photo')}
              onClick={() =>
                setImageModal((prev) => ({
                  ...prev,
                  index: (prev.index + 1) % imageModal.post.images.length,
                }))
              }
            >
              {'\u203A'}
            </button>
            <div className="post-photo-count">
              {imageModal.index + 1} / {imageModal.post.images.length}
            </div>
          </div>
        </div>
      )}
      <CommentProfileModal user={activeProfile} onClose={() => setActiveProfile(null)} />
    </div>
  );
};

export default React.memo(PostsPreview);
