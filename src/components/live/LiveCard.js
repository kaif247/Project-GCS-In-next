import React from 'react';
import { FaVideo, FaUserFriends, FaBroadcastTower, FaTools } from 'react-icons/fa';
import PrimaryButton from './PrimaryButton';

const LiveCard = ({ onPrimaryAction }) => {
  return (
    <div className="live-card">
      <div className="live-card-icon">
        <FaVideo />
      </div>

      <h3>Go live</h3>

      <ul>
        <li>
          <FaUserFriends />
          <span>Go live by yourself or with others</span>
        </li>
        <li>
          <FaBroadcastTower />
          <span>Choose where to publish your live video</span>
        </li>
        <li>
          <FaTools />
          <span>Explore additional tools to engage your viewers</span>
        </li>
      </ul>

      <div className="live-card-action">
        <PrimaryButton onClick={onPrimaryAction}>
          Set up live video
        </PrimaryButton>
      </div>
    </div>
  );
};

export default LiveCard;
