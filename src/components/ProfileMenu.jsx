import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

const MenuRow = ({ icon, label, meta, onClick }) => (
  <button className="profile-menu__item" onClick={onClick} type="button">
    <span className="profile-menu__icon">{icon}</span>
    <span className="profile-menu__label">
      {label}
      {meta && <span className="profile-menu__meta">{meta}</span>}
    </span>
  </button>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M7 5l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ProfileMenu = ({ open, onClose, user }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={menuRef} className="profile-menu" role="menu" aria-label="Profile menu">
      <div className="profile-menu__header">
        <img src={user.avatar} alt={user.name} />
        <div>
          <div className="profile-menu__name">{user.name}</div>
          <Link href="/profiles" className="profile-menu__profiles" onClick={onClose}>
            See all profiles
          </Link>
        </div>
      </div>

      <div className="profile-menu__section">
        <MenuRow
          icon={<ChevronIcon />}
          label="Settings & privacy"
          onClick={onClose}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label="Help & support"
          onClick={onClose}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label="Display & accessibility"
          onClick={onClose}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label="Give feedback"
          meta="CTRL + B"
          onClick={onClose}
        />
        <MenuRow
          icon={<ChevronIcon />}
          label="Log out"
          onClick={() => {
            console.log('Logged out');
            onClose();
          }}
        />
      </div>

      <div className="profile-menu__footer">
        <button type="button">Privacy</button>
        <span>·</span>
        <button type="button">Terms</button>
        <span>·</span>
        <button type="button">Advertising</button>
        <span>·</span>
        <button type="button">Ad choices</button>
        <span>·</span>
        <button type="button">Cookies</button>
        <span>·</span>
        <button type="button">More</button>
      </div>
    </div>
  );
};

export default ProfileMenu;
