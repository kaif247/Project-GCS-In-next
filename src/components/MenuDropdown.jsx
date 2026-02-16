import React, { useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { LanguageContext } from '../context/LanguageContext';

const socialItems = [
  { name: 'Landing page', icon: 'saved', link: '/landing' },
  { name: 'Meta AI', icon: 'meta', link: '/meta' },
  { name: 'Friends', icon: 'friends', link: '/friends' },
  { name: 'Saved', icon: 'saved', link: '/saved' },
  { name: 'Marketplace', icon: 'marketplace (2)', link: '/marketplace' },
];

const createItems = [
  { name: 'Post', icon: 'post', link: '/post' },
  { name: 'Story', icon: 'story', link: '/story' },
  { name: 'Marketplace', icon: 'marketplace (2)', link: '/marketplace' },
];

const MenuDropdown = ({ open, onClose }) => {
  const menuRef = useRef(null);
  const { t } = useContext(LanguageContext);

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
    <div className="menu-dropdown-overlay" role="presentation">
      <button
        type="button"
        className="menu-dropdown-backdrop"
        aria-label={t('Close menu')}
        onClick={onClose}
      />
      <div ref={menuRef} className="menu-dropdown" role="menu" aria-label={t('Menu')}>
        <div className="menu-dropdown__section">
          <div className="menu-dropdown__title">{t('Social')}</div>
          {socialItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="menu-dropdown__item"
              onClick={onClose}
            >
              <Icon name={item.icon} size={20} />
              <div>
                <div className="menu-dropdown__label">{t(item.name)}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="menu-dropdown__section menu-dropdown__section--create">
          <div className="menu-dropdown__title">{t('Create')}</div>
          {createItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="menu-dropdown__item"
              onClick={onClose}
            >
              <Icon name={item.icon} size={20} />
              <div className="menu-dropdown__label">{t(item.name)}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuDropdown;
