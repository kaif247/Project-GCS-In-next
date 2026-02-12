import React from 'react';
import { FaBars } from 'react-icons/fa';

const MobileHeader = ({ title, isOpen, onToggle }) => {
  return (
    <header className="live-mobile-header">
      <button type="button" onClick={onToggle} className="live-mobile-toggle" aria-label="Toggle menu">
        <FaBars />
      </button>
      <h2>{title}</h2>
      <div className="live-mobile-spacer" />
    </header>
  );
};

export default MobileHeader;
