import React, { useContext } from 'react';
import ProfilePreview from './FriendsSuggestions/ProfilePreview';
import buildProfilePreview from '../utils/buildProfilePreview';
import { LanguageContext } from '../context/LanguageContext';

const CommentProfileModal = ({ user, onClose }) => {
  if (!user) return null;
  const { t } = useContext(LanguageContext);
  const profile = buildProfilePreview(user);

  return (
    <div className="post-modal-backdrop" onClick={onClose}>
      <div className="post-modal post-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="post-modal__header">
          <h3>{t('User profile')}</h3>
          <button type="button" className="post-modal__close" onClick={onClose}>x</button>
        </div>
        <div className="post-modal__body">
          <ProfilePreview profile={profile} onToggleRequest={() => {}} onMessage={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default CommentProfileModal;
