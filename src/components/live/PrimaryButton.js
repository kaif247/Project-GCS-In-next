import React from 'react';

const PrimaryButton = ({ children, onClick }) => (
  <button type="button" onClick={onClick} className="live-primary-btn">
    {children}
  </button>
);

export default PrimaryButton;
