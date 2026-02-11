import React, { useMemo, useState } from 'react';
import { currentUser } from '../../data/facebookData';
import Icon from '../Icon';
import styles from './friendsSuggestions.module.css';

const PostsPreview = ({ posts = [], name, avatar }) => {
  const [likedIds, setLikedIds] = useState(new Set());
  const [activeShare, setActiveShare] = useState(null);
  const [activeComment, setActiveComment] = useState(null);
  const [imageModal, setImageModal] = useState(null); // { post, index }
  const [imageComments, setImageComments] = useState({});

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
    return currentUser.name;
  }, [activeComment]);

  const handleImageComment = (postId, index, text) => {
    if (!text.trim()) return;
    const key = `${postId}-${index}`;
    setImageComments((prev) => {
      const next = { ...prev };
      next[key] = [...(next[key] || []), text.trim()];
      return next;
    });
  };

  return (
    <div className={styles.detailCard}>
      <div className={styles.cardHeader}>
        <h3>Posts</h3>
        <button type="button" className={styles.filterBtn}>Filters</button>
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
                    {post.time} • {post.location}
                  </p>
                </div>
              </div>
              <button className="post-menu-btn" aria-label="Post options" title="More options">⋯</button>
            </div>
            <div className="post-content">
              <p className="post-text">
                {post.text.length > 160 ? `${post.text.slice(0, 160)}… ` : post.text}
                <button type="button" className="post-link-btn">See more</button>
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
                  {liked && <Icon name="family" size={16} className="reaction-icon" aria-hidden="true" />}
                </div>
                <span className="reactions-count">{liked ? 1 : 0}</span>
              </div>
              <div className="interaction-counts">
                <span><button className="post-link-btn" type="button" onClick={() => setActiveComment(post)}>comments</button></span>
                <span><button className="post-link-btn" type="button" onClick={() => setActiveShare(post)}>shares</button></span>
              </div>
            </div>
            {liked && <div className="liked-by">{currentUser.name}</div>}
            <div className="post-actions-bar">
              <button className={`action-btn ${liked ? 'liked' : ''}`} type="button" onClick={() => toggleLike(post.id)}>
                {liked ? (
                  <Icon name="family" size={16} className="icon--no-circle" aria-hidden="true" />
                ) : (
                  <span aria-hidden="true">👍</span>
                )}
                <span>Like</span>
              </button>
              <button className="action-btn" type="button" onClick={() => setActiveComment(post)}>
                <Icon name="comment" size={16} className="icon--no-circle comment-icon" aria-hidden="true" />
                <span>Comment</span>
              </button>
              <button className="action-btn" type="button" onClick={() => setActiveShare(post)}>
                <Icon name="share" size={16} className="icon--no-circle" aria-hidden="true" />
                <span>Share</span>
              </button>
            </div>
            <div className="post-quick-comment">
              <img src={currentUser.avatar} alt={currentUser.name} />
              <input type="text" placeholder={`Comment as ${currentUser.name}`} />
              <button className="quick-comment-btn" type="button">➤</button>
            </div>
          </div>
        );
      })}

      {activeShare && (
        <div className="post-modal-backdrop" onClick={() => setActiveShare(null)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>Share</h3>
              <button type="button" className="post-modal__close" onClick={() => setActiveShare(null)}>×</button>
            </div>
            <div className="post-modal__body">
              <div className="post-modal__user">
                <img src={currentUser.avatar} alt={currentUser.name} />
                <div>
                  <div className="post-modal__name">{currentUser.name}</div>
                  <button type="button" className="post-modal__audience">Friends</button>
                </div>
              </div>
              <textarea placeholder="Say something about this..." rows={4} />
              <button type="button" className="post-modal__primary">Share now</button>
            </div>
          </div>
        </div>
      )}

      {activeComment && (
        <div className="post-modal-backdrop" onClick={() => setActiveComment(null)}>
          <div className="post-modal post-modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>{name}'s post</h3>
              <button type="button" className="post-modal__close" onClick={() => setActiveComment(null)}>×</button>
            </div>
            <div className="post-modal__body">
              <div className="post-content">
                <p className="post-text">{activeComment.text}</p>
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
                <img src={currentUser.avatar} alt={currentUser.name} />
                <input type="text" placeholder={`Comment as ${currentUser.name}`} />
                <button className="quick-comment-btn" type="button">➤</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {imageModal && imageModal.post?.images && (
        <div className="post-modal-backdrop" onClick={() => setImageModal(null)}>
          <div className="post-modal post-modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>{name}'s photo</h3>
              <button type="button" className="post-modal__close" onClick={() => setImageModal(null)}>×</button>
            </div>
            <div className="post-modal__body">
              <div className="post-media-scroll">
                {imageModal.post.images.map((src, idx) => (
                  <img
                    key={src + idx}
                    src={src}
                    alt={`Post content ${idx + 1}`}
                    className="post-media-image"
                  />
                ))}
              </div>
              <div className="post-actions-bar">
                <button className="action-btn" type="button" onClick={() => toggleLike(imageModal.post.id)}>
                  {likedIds.has(imageModal.post.id) ? (
                    <Icon name="family" size={16} className="icon--no-circle" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">👍</span>
                  )}
                  <span>Like</span>
                </button>
                <button className="action-btn" type="button">
                  <Icon name="comment" size={16} className="icon--no-circle comment-icon" aria-hidden="true" />
                  <span>Comment</span>
                </button>
                <button className="action-btn" type="button" onClick={() => setActiveShare(imageModal.post)}>
                  <Icon name="share" size={16} className="icon--no-circle" aria-hidden="true" />
                  <span>Share</span>
                </button>
              </div>
              <div className="post-quick-comment">
                <img src={currentUser.avatar} alt={currentUser.name} />
                <input
                  type="text"
                  placeholder={`Comment as ${currentUser.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleImageComment(imageModal.post.id, imageModal.index, e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button
                  className="quick-comment-btn"
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling;
                    if (input) {
                      handleImageComment(imageModal.post.id, imageModal.index, input.value);
                      input.value = '';
                    }
                  }}
                >
                  ➤
                </button>
              </div>
              {(imageComments[`${imageModal.post.id}-${imageModal.index}`] || []).map((text, idx) => (
                <div key={`${imageModal.post.id}-${idx}`} className="image-comment">
                  <strong>{currentUser.name}</strong> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PostsPreview);
