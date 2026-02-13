import React from 'react';
import { FaVideo, FaRegCommentDots, FaCog, FaMagic, FaCheckCircle } from 'react-icons/fa';

const LiveProducerSidebar = ({
  permissionGranted,
  permissionDenied,
  activeSection,
  onSectionChange,
  onGoLive,
  isGoLiveDisabled,
  isLive,
  onBack,
}) => {
  return (
    <aside className="live-producer-sidebar">
      <div className="live-producer-sidebar__header">
        <h2>Create live video</h2>
        <div className="live-producer-sidebar__tools">
          <button type="button" className="lp-icon-btn" aria-label="Help">?</button>
          <button type="button" className="lp-icon-btn" aria-label="Settings">
            <FaCog />
          </button>
          <button type="button" className="lp-icon-btn" aria-label="Create">
            +
          </button>
        </div>
      </div>

      <div className="live-producer-steps">
        <div className="live-producer-progress">
          <span style={{ width: permissionGranted ? '66%' : '33%' }} />
        </div>
        <div className="live-producer-step">
          <span className={`live-producer-step__dot ${permissionGranted ? 'done' : ''}`} />
          <span>Connect video source</span>
        </div>
        <div className="live-producer-step">
          <span className={`live-producer-step__dot ${permissionGranted ? 'done' : ''}`} />
          <span>Complete post details</span>
        </div>
        <div className="live-producer-step">
          <span className={`live-producer-step__dot ${isLive ? 'done' : ''}`} />
          <span>Go live</span>
        </div>
      </div>

      <div className="live-producer-profile">
        <img
          src="https://i.pravatar.cc/150?img=1"
          alt="Kaif Islam"
          className="live-producer-profile__avatar"
        />
        <div>
          <div className="live-producer-profile__name">Kaif Islam</div>
          <div className="live-producer-profile__role">Host � Your profile</div>
        </div>
      </div>

      <div className="live-producer-select">
        <label>Choose where to post</label>
        <select>
          <option>Post on profile</option>
          <option>Post on a page</option>
          <option>Post in a group</option>
        </select>
      </div>

      <div className="live-producer-select">
        <label>When are you going live?</label>
        <select>
          <option>Now</option>
          <option>Schedule for later</option>
        </select>
      </div>

      <button type="button" className="lp-secondary-chip">
        <FaRegCommentDots />
        Friends
      </button>

      <div className="live-producer-nav">
        <button
          type="button"
          className={`live-producer-nav__item ${activeSection === 'setup' ? 'active' : ''}`}
          onClick={() => onSectionChange('setup')}
        >
          <span className="live-producer-nav__icon"><FaVideo /></span>
          Stream Setup
        </button>
        <button
          type="button"
          className={`live-producer-nav__item ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => onSectionChange('dashboard')}
        >
          <span className="live-producer-nav__icon"><FaCheckCircle /></span>
          Dashboard
        </button>
        <button
          type="button"
          className={`live-producer-nav__item ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => onSectionChange('settings')}
        >
          <span className="live-producer-nav__icon"><FaCog /></span>
          Settings
        </button>
        <button type="button" className="live-producer-nav__item">
          <span className="live-producer-nav__icon"><FaMagic /></span>
          Interactivity
        </button>
      </div>

      <div className="live-producer-footer">
        <button type="button" className="lp-btn-secondary" onClick={onBack}>Back</button>
        <button
          type="button"
          className="lp-btn-primary"
          onClick={onGoLive}
          disabled={isGoLiveDisabled}
        >
          Go Live
        </button>
      </div>

      {permissionDenied && (
        <div className="live-producer-warning">
          Permission denied. Enable camera/microphone to go live.
        </div>
      )}
    </aside>
  );
};

export default LiveProducerSidebar;

