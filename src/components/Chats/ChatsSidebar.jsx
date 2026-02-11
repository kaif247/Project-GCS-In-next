import React from 'react';
import Icon from '../Icon';

const ChatsSidebar = ({ chats, activeChatId, onSelectChat }) => {
  return (
    <aside className="chats-sidebar">
      <div className="chats-sidebar__header">
        <h1>Chats</h1>
        <div className="chats-sidebar__actions">
          <button className="chats-icon-btn" aria-label="More">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="6" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="18" cy="12" r="2" fill="currentColor" />
            </svg>
          </button>
          <button className="chats-icon-btn" aria-label="New message">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 17.5V20h2.5L18 8.5l-2.5-2.5L4 17.5z" fill="currentColor" />
              <path d="M15.5 6l2.5 2.5 1-1a1.5 1.5 0 0 0 0-2.1l-.4-.4a1.5 1.5 0 0 0-2.1 0l-1 1z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <div className="chats-sidebar__search">
        <Icon name="search (1)" size={14} className="search-icon" aria-hidden="true" />
        <input type="text" placeholder="Search Messenger" aria-label="Search Messenger" />
      </div>

      <div className="chats-sidebar__tabs">
        <button className="chats-tab active">All</button>
        <button className="chats-tab">Unread</button>
        <button className="chats-tab">Groups</button>
        <button className="chats-tab">Communities</button>
      </div>

      <div className="chats-sidebar__list">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`chats-item ${activeChatId === chat.id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <img src={chat.avatar} alt={chat.name} />
            <div>
              <div className="chats-item__title">{chat.name}</div>
              <div className="chats-item__meta">{chat.meta}</div>
            </div>
            {chat.online && <span className="chats-item__dot" />}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default ChatsSidebar;
