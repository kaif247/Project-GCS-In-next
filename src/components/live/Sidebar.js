import React from 'react';
import { FaVideo } from 'react-icons/fa';
import Dropdown from './Dropdown';

const Sidebar = ({ username, avatarUrl, roleText, destinations, defaultDestination }) => {
  return (
    <aside className="live-sidebar-panel">
      <div className="live-sidebar-scroll">
        <div className="live-sidebar-header">
          <h2>Create live video</h2>
        </div>

        <div className="live-nav">
          <button className="live-nav-item">
            <span className="live-nav-icon">
              <FaVideo />
            </span>
            <span className="live-nav-label">Home</span>
          </button>
        </div>

        <div className="live-profile">
          <img src={avatarUrl} alt={username} className="live-profile-avatar" />
          <div>
            <div className="live-profile-name">{username}</div>
            <div className="live-profile-role">{roleText}</div>
          </div>
        </div>

        <div className="live-dropdown-wrap">
          <div className="live-dropdown-label">Choose where to post</div>
          <Dropdown options={destinations} defaultValue={defaultDestination} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
