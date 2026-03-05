import React from 'react';

const ToggleButton = ({ isOpen, onToggle, label, className = '', style }) => {
  return (
    <button
      className={`sidebar-toggle ${className}`.trim()}
      type="button"
      onClick={onToggle}
      aria-label={label}
      style={style}
    >
      {isOpen ? 'X' : '\u2261'}
    </button>
  );
};

export default ToggleButton;
