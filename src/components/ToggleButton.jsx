import React from 'react';

const ToggleButton = ({ isOpen, onToggle, label }) => {
  return (
    <button className="sidebar-toggle" type="button" onClick={onToggle} aria-label={label}>
      {isOpen ? '✕' : '☰'}
    </button>
  );
};

export default ToggleButton;
