import React, { useEffect, useMemo, useRef, useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const iconMap = {
  reel: '▶',
  event: '📅',
  birthday: '🎂',
  friend: '👥',
};

const NotificationDropdown = ({ open, onClose, initialNotifications }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const dropdownRef = useRef(null);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  const { newNotifications, earlierNotifications } = useMemo(() => {
    const newOnes = notifications.filter((n) => !n.isRead);
    const earlierOnes = notifications.filter((n) => n.isRead);
    return { newNotifications: newOnes, earlierNotifications: earlierOnes };
  }, [notifications]);

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  if (!open) return null;

  return (
    <div ref={dropdownRef} className="notifications-dropdown" role="menu" aria-label={t('Notifications')}>
      <div className="notifications-dropdown__section">
        <div className="notifications-dropdown__title">
          {t('New')} <span>({newNotifications.length})</span>
        </div>
        {newNotifications.map((notif) => (
          <button
            key={notif.id}
            className="notification-item"
            onClick={() => toggleRead(notif.id)}
            type="button"
          >
            <span className={`notification-icon notification-icon--${notif.type}`}>
              {iconMap[notif.type] || '•'}
            </span>
            <span className="notification-content">
              <strong>{notif.name}</strong> {t(notif.message)}
              <span className="notification-time">{t(notif.timeAgo)}</span>
            </span>
            {!notif.isRead && <span className="notification-dot" />}
          </button>
        ))}
      </div>

      <div className="notifications-dropdown__section">
        <div className="notifications-dropdown__title">
          {t('Earlier')} <span>({earlierNotifications.length})</span>
        </div>
        {earlierNotifications.map((notif) => (
          <button
            key={notif.id}
            className="notification-item"
            onClick={() => toggleRead(notif.id)}
            type="button"
          >
            <span className={`notification-icon notification-icon--${notif.type}`}>
              {iconMap[notif.type] || '•'}
            </span>
            <span className="notification-content">
              <strong>{notif.name}</strong> {t(notif.message)}
              <span className="notification-time">{t(notif.timeAgo)}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="notifications-dropdown__footer">
        {t('See previous notifications')}
      </div>
    </div>
  );
};

export default NotificationDropdown;
