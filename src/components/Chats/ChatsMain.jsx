import React, { useEffect, useRef, useState, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const ChatsMain = ({ chat, onSend, onBack, showBack }) => {
  const [message, setMessage] = useState('');
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  const threadRef = useRef(null);
  const attachMenuRef = useRef(null);
  const docInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    if (!isAttachOpen) return undefined;
    const handleClickOutside = (event) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target)) {
        setIsAttachOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAttachOpen]);

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
    onSend(chat.id, { text: trimmed });
    setMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handlePick = (type) => {
    if (type === 'doc') docInputRef.current?.click();
    if (type === 'image') imageInputRef.current?.click();
    if (type === 'video') videoInputRef.current?.click();
  };

  const handleFileSelected = (event, kind) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPendingAttachment({
      kind,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      mime: file.type,
    });
    setCaption('');
    event.target.value = '';
    setIsAttachOpen(false);
  };

  const handleCancelAttachment = () => {
    if (pendingAttachment?.url) URL.revokeObjectURL(pendingAttachment.url);
    setPendingAttachment(null);
    setCaption('');
  };

  const handleSendAttachment = () => {
    if (!pendingAttachment) return;
    onSend(chat.id, {
      attachment: {
        kind: pendingAttachment.kind,
        url: pendingAttachment.url,
        name: pendingAttachment.name,
        mime: pendingAttachment.mime,
      },
      text: caption.trim() ? caption.trim() : undefined,
    });
    setPendingAttachment(null);
    setCaption('');
  };

  const handleOpenImage = (msg) => {
    const isMine = msg.from === 'me';
    const previewUrl = msg.image || msg.attachment?.url;
    if (!previewUrl) return;
    setImagePreview({
      url: previewUrl,
      name: isMine ? t('You') : chat.name,
      avatar: isMine ? (chat.avatar || '') : chat.avatar,
      text: msg.text || '',
    });
    setImageZoom(1);
    setIsImageMenuOpen(false);
  };

  const handleCloseImage = () => {
    setImagePreview(null);
    setImageZoom(1);
    setIsImageMenuOpen(false);
  };

  const handleSaveImage = () => {
    if (!imagePreview?.url) return;
    const link = document.createElement('a');
    link.href = imagePreview.url;
    link.download = 'image';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setIsImageMenuOpen(false);
  };

  return (
    <section className="chats-main">
      <div className="chats-main__card">
        <div className="chats-main__header">
          {showBack && (
            <button className="chats-back" type="button" onClick={onBack} aria-label={t('Back')}>
              &lt;-
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
        {chat.messages.map((msg) => {
          const attachment = msg.attachment;
          return (
          <article
            key={msg.id}
            className={`chats-message ${msg.from === 'me' ? 'chats-message--outgoing' : ''}`}
          >
            {msg.from !== 'me' && (
              <div className="chats-message__header">
                <img src={chat.avatar} alt={chat.name} />
                <div>
                  <div className="chats-message__title">{chat.name}</div>
                  {msg.time && <div className="chats-message__meta">{t(msg.time)}</div>}
                </div>
              </div>
            )}
            <div className="chats-message__body">
              <div className={`chats-bubble ${msg.from === 'me' ? 'chats-bubble--outgoing' : ''}`}>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt={msg.text ? t(msg.text) : t('Attachment')}
                    className="chats-attachment__image"
                    onClick={() => handleOpenImage(msg)}
                    role="button"
                    tabIndex={0}
                  />
                )}
                {attachment?.kind === 'image' && (
                  <img
                    src={attachment.url}
                    alt={attachment.name || t('Attachment')}
                    className="chats-attachment__image"
                    onClick={() => handleOpenImage(msg)}
                    role="button"
                    tabIndex={0}
                  />
                )}
                {attachment?.kind === 'video' && (
                  <video className="chats-attachment__video" controls src={attachment.url} />
                )}
                {attachment?.kind === 'doc' && (
                  <a
                    className="chats-attachment__doc"
                    href={attachment.url}
                    download={attachment.name}
                  >
                    <span className="chats-attachment__doc-icon">DOC</span>
                    <span className="chats-attachment__doc-name">{attachment.name || t('Document')}</span>
                  </a>
                )}
                {msg.text && (
                  <p className={`chats-message__text ${attachment ? 'chats-message__text--caption' : ''}`}>
                    {t(msg.text)}
                  </p>
                )}
              </div>
            </div>
          </article>
        );
        })}
        {message.trim().length > 0 && (
          <div className="chats-typing">{t('Typing...')}</div>
        )}
      </div>

      <div className="chats-input">
        <div className="chats-input__attach" ref={attachMenuRef}>
          <button
            className="chats-input__icon"
            aria-label={t('Add')}
            type="button"
            onClick={() => setIsAttachOpen((prev) => !prev)}
          >
            +
          </button>
          {isAttachOpen && (
            <div className="chats-attach-menu" role="menu" aria-label={t('Choose upload')}>
              <button type="button" className="chats-attach-item" onClick={() => handlePick('doc')}>
                {t('Document')}
              </button>
              <button type="button" className="chats-attach-item" onClick={() => handlePick('image')}>
                {t('Photo')}
              </button>
              <button type="button" className="chats-attach-item" onClick={() => handlePick('video')}>
                {t('Video')}
              </button>
            </div>
          )}
          <input
            ref={docInputRef}
            type="file"
            className="chats-input__file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            onChange={(event) => handleFileSelected(event, 'doc')}
          />
          <input
            ref={imageInputRef}
            type="file"
            className="chats-input__file"
            accept="image/*"
            onChange={(event) => handleFileSelected(event, 'image')}
          />
          <input
            ref={videoInputRef}
            type="file"
            className="chats-input__file"
            accept="video/*"
            onChange={(event) => handleFileSelected(event, 'video')}
          />
        </div>
        <input
          type="text"
          placeholder={t('Type a message')}
          aria-label={t('Type a message')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chats-input__icon" aria-label={t('Emoji')}>:)</button>
        <button className="chats-input__send" aria-label={t('Send')} onClick={handleSend}>&gt;</button>
      </div>

      {pendingAttachment && (
        <div className="chats-attach-overlay" role="presentation">
          <div className="chats-attach-modal" role="dialog" aria-label={t('Add description')}>
            <div className="chats-attach-preview">
              {pendingAttachment.kind === 'image' && (
                <img src={pendingAttachment.url} alt={pendingAttachment.name || t('Attachment')} />
              )}
              {pendingAttachment.kind === 'video' && (
                <video controls src={pendingAttachment.url} />
              )}
              {pendingAttachment.kind === 'doc' && (
                <div className="chats-attach-doc">
                  <span className="chats-attach-doc__icon">DOC</span>
                  <span className="chats-attach-doc__name">{pendingAttachment.name}</span>
                </div>
              )}
            </div>
            <input
              type="text"
              className="chats-attach-caption"
              placeholder={t('Add a description')}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <div className="chats-attach-actions">
              <button type="button" className="chats-attach-btn" onClick={handleCancelAttachment}>
                {t('Cancel')}
              </button>
              <button
                type="button"
                className="chats-attach-btn chats-attach-btn--primary"
                onClick={handleSendAttachment}
              >
                {t('Send')}
              </button>
            </div>
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="chats-image-overlay" role="presentation" onClick={handleCloseImage}>
          <div className="chats-image-modal" role="dialog" aria-label={t('Image preview')} onClick={(e) => e.stopPropagation()}>
            <div className="chats-image-header">
              {imagePreview.avatar && (
                <img src={imagePreview.avatar} alt={imagePreview.name} />
              )}
              <div className="chats-image-title">{imagePreview.name}</div>
              <div className="chats-image-actions">
                <button
                  type="button"
                  className="chats-image-zoom"
                  onClick={() => setImageZoom((z) => Math.min(3, z + 0.25))}
                  aria-label={t('Zoom in')}
                >
                  +
                </button>
                <button
                  type="button"
                  className="chats-image-zoom"
                  onClick={() => setImageZoom((z) => Math.max(1, z - 0.25))}
                  aria-label={t('Zoom out')}
                >
                  −
                </button>
                <div className="chats-image-menu">
                  <button
                    type="button"
                    className="chats-image-menu-btn"
                    onClick={() => setIsImageMenuOpen((prev) => !prev)}
                    aria-label={t('More options')}
                  >
                    ⋮
                  </button>
                  {isImageMenuOpen && (
                    <div className="chats-image-menu-dropdown" role="menu">
                      <button type="button" onClick={handleSaveImage}>
                        {t('Save image')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button type="button" className="chats-image-close" onClick={handleCloseImage} aria-label={t('Close')}>
                ×
              </button>
            </div>
            <div className="chats-image-body">
              <img
                src={imagePreview.url}
                alt={imagePreview.text || t('Attachment')}
                style={{ transform: `scale(${imageZoom})` }}
              />
            </div>
            {imagePreview.text && (
              <div className="chats-image-caption">{t(imagePreview.text)}</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ChatsMain;
