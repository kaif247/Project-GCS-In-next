import React, { useMemo, useState, useContext, useEffect } from 'react';
import CommentSection from './CommentSection';
import Icon from './Icon';
import { LanguageContext } from '../context/LanguageContext';
import useProfileData from '../hooks/useProfileData';
import useSavedPosts from '../hooks/useSavedPosts';
import useFeedPreferences from '../hooks/useFeedPreferences';

const Post = ({ post, canDelete = false, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [imageModal, setImageModal] = useState(null); // { index }
  const [imageComments, setImageComments] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuNotice, setMenuNotice] = useState('');
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [embedCopied, setEmbedCopied] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Spam');
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showAllCommentsPopup, setShowAllCommentsPopup] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
    const [commentDraftPopup, setCommentDraftPopup] = useState('');
    const { t } = useContext(LanguageContext);
    const profile = useProfileData();
    const canDeletePost = canDelete || post?.isLocal || String(post?.id || '').startsWith('local-');
  const { isSaved, toggleSave } = useSavedPosts();
  const {
    prefs,
    hidePost,
    hideAuthor,
    blockAuthor,
    snoozeAuthor,
    toggleNotifications,
    setFeedback,
  } = useFeedPreferences();
  const saved = isSaved(post.id);
  const notificationsOn = Boolean(prefs.notifications?.[post.id]);

  const reactionEmojis = {
    like: '👍',
    love: '❤️',
    haha: '😄',
    wow: '😮',
  };

  const baseTotal = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);
  const baseComments = Number(post.comments || 0);
  const totalComments = baseComments + comments.length;
  const visibleComments = showAllComments ? comments : comments.slice(0, 1);
  const totalReactions = baseTotal + (liked ? 1 : 0);
  const likedByText = useMemo(() => {
    if (!liked) return '';
    if (baseTotal > 0) return `${profile.name} ${t('and')} ${baseTotal} ${t('others')}`;
    return `${profile.name}`;
  }, [liked, baseTotal, t, profile.name]);

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

  const handleAddComment = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setComments((prev) => [
      ...prev,
      {
        id: `${post.id}-${Date.now()}`,
        text: trimmed,
        name: profile.name,
        avatar: profile.avatar,
      },
    ]);
  };

  const handleQuickComment = () => {
    if (!commentDraft.trim()) return;
    handleAddComment(commentDraft);
    setCommentDraft('');
  };

  const handlePopupComment = () => {
    if (!commentDraftPopup.trim()) return;
    handleAddComment(commentDraftPopup);
    setCommentDraftPopup('');
  };

  useEffect(() => {
    if (!menuNotice) return;
    const timer = setTimeout(() => setMenuNotice(''), 3200);
    return () => clearTimeout(timer);
  }, [menuNotice]);

  const buildEmbedCode = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `<iframe src="${origin}/post?id=${post.id}" width="500" height="650" style="border:none;overflow:hidden" allow="fullscreen"></iframe>`;
  };

  const handleCopyEmbed = async () => {
    if (!embedCode) return;
    try {
      await navigator.clipboard.writeText(embedCode);
      setEmbedCopied(true);
      setMenuNotice(t('Embed code copied to clipboard.'));
    } catch {
      setMenuNotice(t('Copy failed. Please select and copy manually.'));
    }
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
          <div className="post-header-actions">
              <button
                className="post-menu-btn"
                aria-label={t('Post options')}
                title={t('More options')}
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                ...
              </button>
              {canDeletePost && (
                <button
                  className="post-delete-btn"
                  aria-label={t('Delete post')}
                  title={t('Delete post')}
                  onClick={() => {
                    onDelete?.(post.id);
                    setMenuNotice(t('Post deleted.'));
                    setIsMenuOpen(false);
                  }}
                >
                  🗑
                </button>
              )}
              <button
                className="post-hide-btn"
                aria-label={t('Hide post')}
                title={t('Hide post')}
                onClick={() => {
                hidePost(post.id, 'hide');
                setIsMenuOpen(false);
              }}
            >
              x
            </button>
            {isMenuOpen && (
              <div className="post-menu-dropdown">
                <button
                  type="button"
                  className="post-menu-item"
                  onClick={() => {
                    setFeedback(post.id, 'interested');
                    setMenuNotice(t('We will show you more posts like this.'));
                    setIsMenuOpen(false);
                  }}
                >
                  {t('Interested')}
                </button>
                <button
                  type="button"
                  className="post-menu-item"
                  onClick={() => {
                    setFeedback(post.id, 'not_interested');
                    hidePost(post.id, 'not_interested');
                    setIsMenuOpen(false);
                  }}
                >
                  {t('Not interested')}
                </button>
                <div className="post-menu-divider" />
                <button
                  type="button"
                  className="post-menu-item"
                  onClick={() => {
                    toggleSave(post);
                    setIsMenuOpen(false);
                    setMenuNotice(saved ? t('Removed from Saved.') : t('Saved for later.'));
                  }}
                >
                  {saved ? t('Unsave post') : t('Save post')}
                </button>
                <button
                  type="button"
                  className="post-menu-item"
                  onClick={() => {
                    toggleNotifications(post.id);
                    setIsMenuOpen(false);
                    setMenuNotice(
                      notificationsOn
                        ? t('Notifications turned off for this post.')
                        : t('Notifications turned on for this post.')
                    );
                  }}
                >
                  {notificationsOn
                    ? t('Turn off notifications for this post')
                    : t('Turn on notifications for this post')}
                </button>
                <button
                  type="button"
                  className="post-menu-item"
                  onClick={() => {
                    setEmbedCode(buildEmbedCode());
                    setEmbedCopied(false);
                    setIsEmbedOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  {t('Embed')}
                </button>
                {canDeletePost && (
                  <>
                    <div className="post-menu-divider" />
                    <button
                      type="button"
                      className="post-menu-item"
                      onClick={() => {
                        onDelete?.(post.id);
                        setIsMenuOpen(false);
                        setMenuNotice(t('Post deleted.'));
                      }}
                    >
                      {t('Delete post')}
                    </button>
                  </>
                )}
                <div className="post-menu-divider" />
                <button
                  type="button"
                  className="post-menu-item"
                  onClick={() => {
                    hidePost(post.id, 'hide');
                    setIsMenuOpen(false);
                  }}
                >
                  {t('Hide post')}
                </button>
                <button
                  type="button"
                  className="post-menu-item"
                  onClick={() => {
                    snoozeAuthor(post.userName);
                    setIsMenuOpen(false);
                    setMenuNotice(t('You will not see posts from this profile for 30 days.'));
                  }}
                >
                  {t('Snooze for 30 days')}
                </button>
                <button
                  type="button"
                  className="post-menu-item"
                  onClick={() => {
                    hideAuthor(post.userName);
                    setIsMenuOpen(false);
                    setMenuNotice(t('All posts from this profile are hidden.'));
                  }}
                >
                  {t('Hide all posts from this page')}
                </button>
                <div className="post-menu-divider" />
                <button
                  type="button"
                  className="post-menu-item"
                  onClick={() => {
                    setReportReason('Spam');
                    setIsReportOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  {t('Report post')}
                </button>
                <button
                  type="button"
                  className="post-menu-item"
                  onClick={() => {
                    blockAuthor(post.userName);
                    setIsMenuOpen(false);
                    setMenuNotice(t('You will no longer see posts from this profile.'));
                  }}
                >
                  {t('Block profile')}
                </button>
              </div>
            )}
          </div>
        </div>
        {menuNotice && <div className="post-action-toast">{menuNotice}</div>}

        {/* Post Content */}
        <div className="post-content">
          <div
            className={`post-text-box ${post.textBackground ? 'post-text-box--styled' : ''}`}
            style={
              post.textBackground
                ? { background: post.textBackground, color: post.textColor || 'var(--text-primary)' }
                : undefined
            }
          >
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
                {totalComments} {t('comments')}
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
          <img src={profile.avatar} alt={profile.name} />
          <input
            type="text"
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleQuickComment();
              }
            }}
            placeholder={t('Comment as {name}', { name: profile.name })}
          />
          <button className="quick-comment-btn" type="button" onClick={handleQuickComment}>
            &rarr;
          </button>
        </div>
        {comments.length > 0 && (
          <div className="post-comment-list">
            {visibleComments.map((item) => (
              <div key={item.id} className="comment-item">
                <img src={item.avatar} alt={item.name} />
                <div className="comment-bubble">
                  <strong>{item.name}</strong>
                  <span>{item.text}</span>
                </div>
              </div>
            ))}
            {comments.length > 1 && (
              <button
                type="button"
                className="post-comment-toggle"
                onClick={() => {
                  setIsCommentOpen(true);
                  setShowAllCommentsPopup(true);
                }}
              >
                {t('See more comments')}
              </button>
            )}
          </div>
        )}

      </article>

      {/* Share Modal */}
      {isShareOpen && (
        <div className="post-modal-backdrop" onClick={() => setIsShareOpen(false)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>{t('Share')}</h3>
              <button type="button" className="post-modal__close" onClick={() => setIsShareOpen(false)}>x</button>
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

      {/* Comment Modal */}
      {isCommentOpen && (
        <div className="post-modal-backdrop" onClick={() => setIsCommentOpen(false)}>
          <div className="post-modal post-modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>{t("{name}'s post", { name: post.userName })}</h3>
              <button type="button" className="post-modal__close" onClick={() => setIsCommentOpen(false)}>x</button>
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
              <CommentSection
                comments={comments}
                onAddComment={handleAddComment}
                showAll={showAllCommentsPopup}
                onToggleView={() => setShowAllCommentsPopup((prev) => !prev)}
                showAllLabel={showAllCommentsPopup ? t('Show less') : t('See more comments')}
              />
              <div className="post-quick-comment">
                <img src={profile.avatar} alt={profile.name} />
                <input
                  type="text"
                  value={commentDraftPopup}
                  onChange={(e) => setCommentDraftPopup(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePopupComment();
                    }
                  }}
                  placeholder={t('Comment as {name}', { name: profile.name })}
                />
                <button className="quick-comment-btn" type="button" onClick={handlePopupComment}>
                  &rarr;
                </button>
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
              <button type="button" className="post-modal__close" onClick={() => setImageModal(null)}>x</button>
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
                <img src={profile.avatar} alt={profile.name} />
                <input
                  type="text"
                  placeholder={t('Comment as {name}', { name: profile.name })}
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
                  &rarr;
                </button>
              </div>
              {(imageComments[String(imageModal.index)] || []).map((text, idx) => (
                <div key={`${imageModal.index}-${idx}`} className="image-comment">
                  <strong>{profile.name}</strong> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isEmbedOpen && (
        <div className="post-modal-backdrop" onClick={() => setIsEmbedOpen(false)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>{t('Embed post')}</h3>
              <button type="button" className="post-modal__close" onClick={() => setIsEmbedOpen(false)}>x</button>
            </div>
            <div className="post-modal__body">
              <p className="post-modal__hint">{t('Copy this code to embed the post on your site.')}</p>
              <textarea readOnly value={embedCode} rows={4} />
              <button type="button" className="post-modal__primary" onClick={handleCopyEmbed}>
                {embedCopied ? t('Copied') : t('Copy code')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isReportOpen && (
        <div className="post-modal-backdrop" onClick={() => setIsReportOpen(false)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="post-modal__header">
              <h3>{t('Report post')}</h3>
              <button type="button" className="post-modal__close" onClick={() => setIsReportOpen(false)}>x</button>
            </div>
            <div className="post-modal__body">
              <label className="post-report-option">
                <input
                  type="radio"
                  name={`report-${post.id}`}
                  value="Spam"
                  checked={reportReason === 'Spam'}
                  onChange={() => setReportReason('Spam')}
                />
                <span>{t('Spam')}</span>
              </label>
              <label className="post-report-option">
                <input
                  type="radio"
                  name={`report-${post.id}`}
                  value="Harassment"
                  checked={reportReason === 'Harassment'}
                  onChange={() => setReportReason('Harassment')}
                />
                <span>{t('Harassment')}</span>
              </label>
              <label className="post-report-option">
                <input
                  type="radio"
                  name={`report-${post.id}`}
                  value="False information"
                  checked={reportReason === 'False information'}
                  onChange={() => setReportReason('False information')}
                />
                <span>{t('False information')}</span>
              </label>
              <label className="post-report-option">
                <input
                  type="radio"
                  name={`report-${post.id}`}
                  value="Other"
                  checked={reportReason === 'Other'}
                  onChange={() => setReportReason('Other')}
                />
                <span>{t('Other')}</span>
              </label>
              <button
                type="button"
                className="post-modal__primary"
                onClick={() => {
                  setIsReportOpen(false);
                  setMenuNotice(t('Thanks for your report.'));
                }}
              >
                {t('Submit report')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;












