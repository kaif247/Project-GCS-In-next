import React, { useMemo, useState, useContext } from 'react';
import CommentSection from './CommentSection';
import { currentUser } from '../data/facebookData';
import Icon from './Icon';
import { LanguageContext } from '../context/LanguageContext';

const Post = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [imageModal, setImageModal] = useState(null); // { index }
  const [imageComments, setImageComments] = useState({});
  const { t } = useContext(LanguageContext);

  const reactionEmojis = {
    like: '👍',
    love: '❤️',
    haha: '😄',
    wow: '😮',
  };

  const baseTotal = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);
  const totalReactions = baseTotal + (liked ? 1 : 0);
  const likedByText = useMemo(() => {
    if (!liked) return '';
    if (baseTotal > 0) return `${currentUser.name} ${t('and')} ${baseTotal} ${t('others')}`;
    return `${currentUser.name}`;
  }, [liked, baseTotal, t]);

  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  const handleImageComment = (index, text) => {
    if (!text.trim()) return;
    setImageComments((prev) => {
      const key = String(index);
      const next = { ...prev };
      next[key] = [...(next[key] || []), text.trim()];
      return next;
    });
  };

  return (
    <>
      <article className="post-card">
        {/* Post Header */}
        <div className="post-header">
          <div className="post-header-left">
            <img src={post.userAvatar} alt={post.userName} className="post-user-avatar" />
            <div className="post-user-info">
              <h3 className="post-user-name">{post.userName}</h3>
              <p className="post-meta">
                {t(post.location)} • <time>{t(post.timestamp)}</time>
              </p>
            </div>
          </div>
          <button className="post-menu-btn" aria-label={t('Post options')} title={t('More options')}>
            ⋯
          </button>
        </div>

        {/* Post Content */}
        <div className="post-content">
          <p className="post-text">
            {t(post.content)}
            {post.hashtags && post.hashtags.length > 0 && (
              <>
                {' '}
                {post.hashtags.map((tag, idx) => (
                  <a key={idx} href={`#${tag}`} className="hashtag">
                    {tag}
                  </a>
                ))}
              </>
            )}
          </p>
        </div>

        {/* Post Media */}
        {post.video && (
          <div className="post-video">
            <video src={post.video} controls poster={post.videoPoster} />
          </div>
        )}

        {post.images && post.images.length > 0 && (
          <div className={`post-images ${post.images.length === 1 ? 'single' : 'multiple'}`}>
            {post.images.map((img, idx) => (
              <div
                key={idx}
                className="post-image-wrapper"
                role="button"
                tabIndex={0}
                onClick={() => setImageModal({ index: idx })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setImageModal({ index: idx });
                }}
              >
                <img src={img} alt={`Post content ${idx + 1}`} className="post-image" />
              </div>
            ))}
          </div>
        )}

        {/* Post Stats */}
        <div className="post-stats">
          <div className="reactions-summary">
            <div className="reaction-icons">
              {liked && <Icon name="family" size={16} className="reaction-icon" aria-hidden="true" />}
              {Object.entries(post.reactions || {}).map(
                ([type, count]) =>
                  count > 0 && (
                    <span key={type} className="reaction-icon" title={type}>
                      {reactionEmojis[type]}
                    </span>
                  )
              )}
            </div>
            <span className="reactions-count">{totalReactions}</span>
          </div>

          <div className="interaction-counts">
            <span>
              <button className="post-link-btn" type="button" onClick={() => setIsCommentOpen(true)}>
                {post.comments} {t('comments')}
              </button>
            </span>
            <span>
              <button className="post-link-btn" type="button" onClick={() => setIsShareOpen(true)}>
                {post.shares} {t('shares')}
              </button>
            </span>
          </div>
        </div>

        {likedByText && <div className="liked-by">{likedByText}</div>}

        {/* Post Actions */}
        <div className="post-actions-bar">
          <button
            className={`action-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
            aria-label={liked ? t('Unlike') : t('Like')}
          >
            {liked ? (
              <Icon name="family" size={16} className="icon--no-circle" aria-hidden="true" />
            ) : (
              <span aria-hidden="true">👍</span>
            )}
            <span>{t('Like')}</span>
          </button>

          {/* Reactions Popup */}
          {showReactions && (
            <div className="reactions-popup">
              <button className="reaction-btn" title={t('Like')}>👍</button>
              <button className="reaction-btn" title={t('Love')}>❤️</button>
              <button className="reaction-btn" title={t('Haha')}>😄</button>
              <button className="reaction-btn" title={t('Wow')}>😮</button>
              <button className="reaction-btn" title={t('Sad')}>😢</button>
              <button className="reaction-btn" title={t('Angry')}>😠</button>
            </div>
          )}

          <button className="action-btn" aria-label={t('Comment')} onClick={() => setIsCommentOpen(true)}>
            <Icon name="comment" size={16} className="icon--no-circle comment-icon" aria-hidden="true" />
            <span>{t('Comment')}</span>
          </button>

          <button className="action-btn" aria-label={t('Share')} onClick={() => setIsShareOpen(true)}>
            <Icon name="share" size={16} className="icon--no-circle" aria-hidden="true" />
            <span>{t('Share')}</span>
          </button>
        </div>

        {/* Quick Comment */}
        <div className="post-quick-comment">
          <img src={currentUser.avatar} alt={currentUser.name} />
          <input type="text" placeholder={t('Comment as {name}', { name: currentUser.name })} />
          <button className="quick-comment-btn" type="button">➤</button>
        </div>

        <CommentSection />
      </article>

      {/* Share Modal */}
      {isShareOpen && (
        <div className="post-modal-backdrop" onClick={() => setIsShareOpen(false)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>{t('Share')}</h3>
              <button type="button" className="post-modal__close" onClick={() => setIsShareOpen(false)}>×</button>
            </div>
            <div className="post-modal__body">
              <div className="post-modal__user">
                <img src={currentUser.avatar} alt={currentUser.name} />
                <div>
                  <div className="post-modal__name">{currentUser.name}</div>
                  <button type="button" className="post-modal__audience">{t('Friends')}</button>
                </div>
              </div>
              <textarea placeholder={t('Say something about this...')} rows={4} />
              <button type="button" className="post-modal__primary">{t('Share now')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {isCommentOpen && (
        <div className="post-modal-backdrop" onClick={() => setIsCommentOpen(false)}>
          <div className="post-modal post-modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>{t("{name}'s post", { name: post.userName })}</h3>
              <button type="button" className="post-modal__close" onClick={() => setIsCommentOpen(false)}>×</button>
            </div>
            <div className="post-modal__body">
              <div className="post-modal__post">
                <div className="post-header">
                  <div className="post-header-left">
                    <img src={post.userAvatar} alt={post.userName} className="post-user-avatar" />
                    <div className="post-user-info">
                      <h3 className="post-user-name">{post.userName}</h3>
                      <p className="post-meta">
                        {t(post.location)} • <time>{t(post.timestamp)}</time>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="post-content">
                  <p className="post-text">{t(post.content)}</p>
                </div>
                {post.video && (
                  <div className="post-video">
                    <video src={post.video} controls poster={post.videoPoster} />
                  </div>
                )}
                {post.images && post.images.length > 0 && (
                  <div className={`post-images ${post.images.length === 1 ? 'single' : 'multiple'}`}>
                    {post.images.map((img, idx) => (
                      <div key={idx} className="post-image-wrapper">
                        <img src={img} alt={`Post content ${idx + 1}`} className="post-image" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <CommentSection />
              <div className="post-quick-comment">
                <img src={currentUser.avatar} alt={currentUser.name} />
                <input type="text" placeholder={t('Comment as {name}', { name: currentUser.name })} />
                <button className="quick-comment-btn" type="button">➤</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {imageModal && post.images && (
        <div className="post-modal-backdrop" onClick={() => setImageModal(null)}>
          <div className="post-modal post-modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>{t("{name}'s photo", { name: post.userName })}</h3>
              <button type="button" className="post-modal__close" onClick={() => setImageModal(null)}>×</button>
            </div>
            <div className="post-modal__body">
              <div className="post-media-scroll">
                {post.images.map((img, idx) => (
                  <img
                    key={img + idx}
                    src={img}
                    alt={`Post content ${idx + 1}`}
                    className={`post-media-image ${idx === imageModal.index ? 'active' : ''}`}
                  />
                ))}
              </div>
              <div className="post-actions-bar">
                <button className={`action-btn ${liked ? 'liked' : ''}`} type="button" onClick={handleLike}>
                  {liked ? (
                    <Icon name="family" size={16} className="icon--no-circle" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">👍</span>
                  )}
                  <span>{t('Like')}</span>
                </button>
                <button className="action-btn" type="button">
                  <Icon name="comment" size={16} className="icon--no-circle" aria-hidden="true" />
                  <span>{t('Comment')}</span>
                </button>
                <button className="action-btn" type="button" onClick={() => setIsShareOpen(true)}>
                  <Icon name="share" size={16} className="icon--no-circle" aria-hidden="true" />
                  <span>{t('Share')}</span>
                </button>
              </div>
              <div className="post-quick-comment">
                <img src={currentUser.avatar} alt={currentUser.name} />
                <input
                  type="text"
                  placeholder={t('Comment as {name}', { name: currentUser.name })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleImageComment(imageModal.index, e.currentTarget.value);
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
                      handleImageComment(imageModal.index, input.value);
                      input.value = '';
                    }
                  }}
                >
                  ➤
                </button>
              </div>
              {(imageComments[String(imageModal.index)] || []).map((text, idx) => (
                <div key={`${imageModal.index}-${idx}`} className="image-comment">
                  <strong>{currentUser.name}</strong> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;










