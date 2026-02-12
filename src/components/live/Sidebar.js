import React from 'react';
import { FaVideo, FaRegCommentDots } from 'react-icons/fa';
import Dropdown from './Dropdown';

const Sidebar = ({
  username,
  avatarUrl,
  roleText,
  destinations,
  defaultDestination,
  variant = 'desktop',
  onClose,
}) => {
  const isCollapsed = variant === 'collapsed';
  return (
    <aside className={`live-sidebar-panel live-sidebar-panel--${variant}`}>
      <div className="live-sidebar-scroll">
        <div className="live-sidebar-header">
          {!isCollapsed && <h2>Create live video</h2>}
        </div>

        <div className="live-nav">
          <button className={`live-nav-item ${isCollapsed ? 'is-collapsed' : ''}`}>
            <span className="live-nav-icon">
              <FaVideo />
            </span>
            {!isCollapsed && <span className="live-nav-label">Home</span>}
          </button>
        </div>

        {!isCollapsed && (
          <div className="live-profile">
            <img src={avatarUrl} alt={username} className="live-profile-avatar" />
            <div>
              <div className="live-profile-name">{username}</div>
              <div className="live-profile-role">{roleText}</div>
            </div>
          </div>
        )}

        {!isCollapsed && (
          <div className="live-dropdown-wrap">
            <div className="live-dropdown-label">Choose where to post</div>
            <Dropdown options={destinations} defaultValue={defaultDestination} />
          </div>
        )}
      </div>

      <div className={`live-sidebar-footer ${isCollapsed ? 'is-collapsed' : ''}`}>
        <button className="live-feedback-btn">
          <span className="live-feedback-icon">
            <FaRegCommentDots />
          </span>
          {!isCollapsed && <span>Give feedback</span>}
        </button>
        {variant === 'mobile' && (
          <button onClick={onClose} className="live-close-btn">Close</button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
