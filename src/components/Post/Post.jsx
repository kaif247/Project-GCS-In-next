
import React, { useState, useContext } from 'react';
import { FaRegCommentDots, FaShare, FaEllipsisH, FaBookmark, FaRegBookmark, FaRegSmile, FaLaughSquint, FaSurprise, FaSadTear, FaAngry, FaHandHoldingHeart } from 'react-icons/fa';
import Icon from '../Icon';
import styles from './Post.module.css';
import { LanguageContext } from '../../context/LanguageContext';
import useProfileData from '../../hooks/useProfileData';
import CommentProfileModal from '../CommentProfileModal';

const reactionIcons = [
  { type: 'like', icon: <Icon name="like" size={18} className="icon--no-circle" aria-hidden="true" />, label: 'Like' },
  { type: 'care', icon: <FaHandHoldingHeart color="#F7B928" />, label: 'Care' },
  { type: 'haha', icon: <FaLaughSquint color="#F7B928" />, label: 'Haha' },
  { type: 'wow', icon: <FaSurprise color="#F7B928" />, label: 'Wow' },
  { type: 'sad', icon: <FaSadTear color="#F7B928" />, label: 'Sad' },
  { type: 'angry', icon: <FaAngry color="#E9710F" />, label: 'Angry' },
];

const Post = ({ post }) => {
  const { t } = useContext(LanguageContext);
  const [reaction, setReaction] = useState(null); // like, love, care, haha, wow, sad, angry
  const [showReactions, setShowReactions] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const profile = useProfileData();

  const handleReaction = (type) => {
    setReaction(type);
    setShowReactions(false);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          id: `${post.id}-${Date.now()}`,
          text: comment.trim(),
          name: profile.name,
          avatar: profile.avatar,
        },
      ]);
      setComment('');
    }
  };

  return (
    <article className={styles.post}>
      <header className={styles.header}>
        <img src={post.userAvatar} alt={post.userName} className={styles.avatar} />
        <div className={styles.userInfo}>
          <span className={styles.userName}>{post.userName}</span>
          <span className={styles.meta}>{t(post.location)} • {t(post.timestamp)}</span>
        </div>
        <button className={styles.menuBtn} aria-label={t('More options')}><FaEllipsisH /></button>
      </header>
      <div className={styles.content}>
        <p>{t(post.content)} {post.hashtags && post.hashtags.map(tag => <span key={tag} className={styles.hashtag}>{tag}</span>)}</p>
        {post.images && post.images.length > 0 && (
          <div className={styles.images}>
            {post.images.map((img, idx) => (
              <img key={idx} src={img} alt={t('Post media')} className={styles.image} />
            ))}
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <div
          className={`${styles.actionBtn} ${reaction ? styles.liked : ''}`}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
          onClick={() => handleReaction(reaction === 'like' ? null : 'like')}
          aria-label={t('Like')}
        >
          {reaction ? reactionIcons.find(r => r.type === reaction)?.icon : <Icon name="like" size={18} className="icon--no-circle" aria-hidden="true" />} {reaction ? t(reactionIcons.find(r => r.type === reaction)?.label) : t('Like')}
          {showReactions && (
            <div className={styles.reactionsPopup}>
              {reactionIcons.map(r => (
                <span
                  key={r.type}
                  onClick={e => { e.stopPropagation(); handleReaction(r.type); }}
                  style={{ cursor: 'pointer', fontSize: 22, margin: '0 2px' }}
                  title={t(r.label)}
                  role="img"
                  aria-label={t(r.label)}
                >
                  {r.icon}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className={styles.actionBtn} aria-label={t('Comment')}>
          <FaRegCommentDots /> {t('Comment')}
        </div>
        <div className={styles.actionBtn} aria-label={t('Share')}>
          <FaShare /> {t('Share')}
        </div>
        <div
          className={styles.actionBtn}
          aria-label={t('Save')}
          onClick={() => setSaved(s => !s)}
        >
          {saved ? <FaBookmark color="#1877F2" /> : <FaRegBookmark />} {t('Save')}
        </div>
      </div>
      <form className={styles.commentBox} onSubmit={handleComment}>
        <input
          className={styles.commentInput}
          type="text"
          placeholder={t('Write a comment...')}
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button type="button" className={styles.emojiBtn}><FaRegSmile /></button>
      </form>
      {comments.length > 0 && (
        <div className={styles.commentList}>
          {comments.map((c) => (
            <div key={c.id} className={styles.commentItem}>
              <button
                type="button"
                className={styles.commentAvatarBtn}
                onClick={() => setActiveProfile(c)}
                aria-label={t('User profile')}
              >
                <img src={c.avatar} alt={c.name} className={styles.commentAvatar} />
              </button>
              <div className={styles.commentBubble}>
                <button
                  type="button"
                  className={styles.commentNameBtn}
                  onClick={() => setActiveProfile(c)}
                >
                  {c.name}
                </button>
                <span>{c.text}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <CommentProfileModal user={activeProfile} onClose={() => setActiveProfile(null)} />
    </article>
  );
};

export default Post;



