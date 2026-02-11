import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ThemeContext } from '../../context/ThemeContext';
import { FaHome, FaUserFriends, FaUsers, FaStore, FaTv, FaVideo, FaBell, FaFacebookMessenger, FaPlusCircle } from 'react-icons/fa';
import { MdReels } from 'react-icons/md';
import { AuthContext } from '../../context/AuthContext';
import Icon from '../Icon';
import styles from './Navbar.module.css';

const navItems = [
  { to: '/', icon: <FaHome />, label: 'Home' },
  { to: '/friends', icon: <FaUserFriends />, label: 'Friends' },
  { to: '/groups', icon: <FaUsers />, label: 'Groups' },
  { to: '/marketplace', icon: <FaStore />, label: 'Marketplace' },
  { to: '/watch', icon: <FaTv />, label: 'Watch' },
  { to: '/reels', icon: <MdReels />, label: 'Reels' },
];

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo} aria-label="Facebook Home">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#1877F2" />
            <path d="M23 12h3v3h-3v3h3v3h-3v3h3v3h-3v3h-3v-3h-3v-3h3v-3h-3v-3h3v-3h-3v-3h3v-3h3v3z" fill="#fff" />
          </svg>
        </Link>
        <div className={styles.searchWrap}>
          <Icon name="search (1)" size={14} className={styles.searchIcon} aria-hidden="true" />
          <input className={styles.search} type="text" placeholder="Search Facebook" aria-label="Search Facebook" />
        </div>
      </div>
      <nav className={styles.center}>
        {navItems.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={`${styles.navItem} ${router.pathname === item.to ? styles.active : ''}`}
            aria-label={item.label}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
      <div className={styles.right}>
        <Link href="/create" className={styles.iconBtn} aria-label="Create">
          <FaPlusCircle />
        </Link>
        <Link href="/messenger" className={styles.iconBtn} aria-label="Messenger">
          <FaFacebookMessenger />
        </Link>
        <Link href="/notifications" className={styles.iconBtn} aria-label="Notifications">
          <FaBell />
        </Link>
        <Link href="/profile" className={styles.profileBtn} aria-label="Profile">
          <img src={user.avatar} alt={user.name} className={styles.avatar} />
        </Link>
        <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle dark mode">
          <Icon
            name={isDarkMode ? 'lightmode' : 'night-mode'}
            size={18}
            className="icon--no-circle"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
};

export default Navbar;

