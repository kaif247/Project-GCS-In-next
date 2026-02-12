import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Dropdown = ({ options, defaultValue }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || options?.[0]);

  return (
    <div className="live-dropdown">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="live-dropdown-btn"
      >
        <span>{selected}</span>
        <FaChevronDown className={`live-dropdown-chevron ${open ? 'is-open' : ''}`} />
      </button>

      <div
        className={`live-dropdown-menu ${open ? 'is-open' : ''}`}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setSelected(option);
              setOpen(false);
            }}
            className="live-dropdown-option"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
