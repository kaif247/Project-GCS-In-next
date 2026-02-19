import React, { useContext } from 'react';
import Icon from '../Icon';
import { LanguageContext } from '../../context/LanguageContext';

const ChatsSidebar = ({ chats, activeChatId, onSelectChat }) => {
  const { t } = useContext(LanguageContext);
  return (
    <aside className="chats-sidebar">
      <div className="chats-sidebar__header">
        <img
          src="https://i.pravatar.cc/100?img=64"
          alt={t('Profile')}
          className="chats-sidebar__avatar"
        />
        <h1>{t('Chats')}</h1>
        <div className="chats-sidebar__actions">
          <button className="chats-icon-btn" aria-label={t('Search')}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button className="chats-icon-btn" aria-label={t('New message')}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 17.5V20h2.5L18 8.5l-2.5-2.5L4 17.5z" fill="currentColor" />
              <path d="M15.5 6l2.5 2.5 1-1a1.5 1.5 0 0 0 0-2.1l-.4-.4a1.5 1.5 0 0 0-2.1 0l-1 1z" fill="currentColor" />
            </svg>
          </button>
          <button className="chats-icon-btn" aria-label={t('More')}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="6" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="18" cy="12" r="2" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <div className="chats-sidebar__search">
        <Icon name="search (1)" size={18} className="search-icon" aria-hidden="true" />
        <input type="text" placeholder={t('Search Messenger')} aria-label={t('Search Messenger')} />
      </div>

      <div className="chats-sidebar__list">
        {chats.map((chat) => {
          const lastMessage = chat.messages?.[chat.messages.length - 1];
          const previewText = lastMessage?.text || t('Attachment');
          return (
          <button
            key={chat.id}
            className={`chats-item ${activeChatId === chat.id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="chats-item__avatar">
              <img src={chat.avatar} alt={chat.name} />
              {chat.online && <span className="chats-item__dot" />}
            </div>
            <div className="chats-item__body">
              <div className="chats-item__title">{chat.name}</div>
              <div className="chats-item__meta">{previewText}</div>
            </div>
            <div className="chats-item__time">{lastMessage?.time || ''}</div>
          </button>
        );
        })}
      </div>
    </aside>
  );
};

export default ChatsSidebar;
