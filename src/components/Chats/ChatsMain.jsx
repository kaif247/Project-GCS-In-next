import React, { useEffect, useRef, useState, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const ChatsMain = ({ chat, onSend, onBack, showBack }) => {
  const [message, setMessage] = useState('');
  const threadRef = useRef(null);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [chat]);

  if (!chat) {
    return (
      <section className="chats-main">
        <div className="chats-thread chats-thread--empty">
          {t('Select a chat to start messaging.')}
        </div>
      </section>
    );
  }

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(chat.id, trimmed);
    setMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="chats-main">
      <div className="chats-main__card">
        <div className="chats-main__header">
          {showBack && (
            <button className="chats-back" type="button" onClick={onBack} aria-label={t('Back')}>
              ←
            </button>
          )}
          <img src={chat.avatar} alt={chat.name} />
          <div>
            <div className="chats-main__title">{chat.name}</div>
            <div className="chats-main__meta">{t(chat.meta)}</div>
          </div>
        </div>
      </div>

      <div className="chats-thread" ref={threadRef}>
        {chat.messages.map((message) => (
          <article
            key={message.id}
            className={`chats-message ${message.from === 'me' ? 'chats-message--outgoing' : ''}`}
          >
            {message.from !== 'me' && (
              <div className="chats-message__header">
                <img src={chat.avatar} alt={chat.name} />
                <div>
                  <div className="chats-message__title">{chat.name}</div>
                  {message.time && <div className="chats-message__meta">{t(message.time)}</div>}
                </div>
              </div>
            )}
            <div className="chats-message__body">
              <div className={`chats-bubble ${message.from === 'me' ? 'chats-bubble--outgoing' : ''}`}>
                {message.image && <img src={message.image} alt={message.text ? t(message.text) : t('Attachment')} />}
                {message.text && <p>{t(message.text)}</p>}
              </div>
            </div>
          </article>
        ))}
        {message.trim().length > 0 && (
          <div className="chats-typing">{t('Typing...')}</div>
        )}
      </div>

      <div className="chats-input">
        <button className="chats-input__icon" aria-label={t('Add')}>＋</button>
        <input
          type="text"
          placeholder={t('Type a message')}
          aria-label={t('Type a message')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chats-input__icon" aria-label={t('Emoji')}>🙂</button>
        <button className="chats-input__send" aria-label={t('Send')} onClick={handleSend}>➤</button>
      </div>
    </section>
  );
};

export default ChatsMain;



