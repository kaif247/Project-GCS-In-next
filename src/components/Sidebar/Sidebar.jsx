import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaUserFriends, FaUsers, FaStore, FaTv, FaBookmark, FaClock, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import { MdGroups, MdEvent, MdFeed } from 'react-icons/md';
import { CgFeed } from 'react-icons/cg';
import { AuthContext } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const sidebarItems = [
  { to: '/profile', icon: <FaUserFriends />, label: 'Profile' },
  { to: '/friends', icon: <FaUserFriends />, label: 'Friends' },
  { to: '/groups', icon: <MdGroups />, label: 'Groups' },
  { to: '/marketplace', icon: <FaStore />, label: 'Marketplace' },
  { to: '/watch', icon: <FaTv />, label: 'Watch' },
  { to: '/saved', icon: <FaBookmark />, label: 'Saved' },
  { to: '/memories', icon: <FaClock />, label: 'Memories' },
  { to: '/events', icon: <MdEvent />, label: 'Events' },
  { to: '/feeds', icon: <CgFeed />, label: 'Feeds' },
];

const Sidebar = () => {
  const router = useRouter();
  // ...existing code for user context if needed...
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.menu}>
        {sidebarItems.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={`${styles.menuItem} ${router.pathname === item.to ? styles.active : ''}`}
            aria-label={item.label}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
        <button className={styles.menuItem} aria-label="See more">
          <span className={styles.icon}><FaChevronDown /></span>
          <span className={styles.label}>See more</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
