import React from 'react';

const normalizeText = (text) => {
  if (!text) return '';
  let cleaned = text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if (!cleaned) return '';
  if (!cleaned.includes(' ')) {
    cleaned = cleaned.replace(/\s+/g, '');
    return cleaned;
  }
  return cleaned.replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n');
};

const isSingleEmoji = (text) => {
  if (!text) return false;
  const trimmed = normalizeText(text);
  const graphemes = Array.from(trimmed);
  return graphemes.length === 1;
};

const MessageBubble = ({
  message,
  meta,
  senderName,
  highlightRanges = [],
}) => {
  const displayText = normalizeText(message.text);
  const isEmojiOnly = isSingleEmoji(displayText);
  const showLabel = meta.groupPosition === 'first';
  const reply = message.reply || null;
  const audio = message.attachment?.kind === 'audio' ? message.attachment : null;
  const bubbleClasses = [
    'msg-bubble',
    message.isSelf ? 'msg-bubble--out' : 'msg-bubble--in',
    `msg-bubble--${meta.groupPosition}`,
    meta.tailVisible ? 'msg-bubble--tail' : '',
    isEmojiOnly ? 'msg-bubble--emoji' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const renderText = () => {
    if (!displayText) return null;
    if (!highlightRanges.length) return displayText;

    const parts = [];
    let lastIndex = 0;
    highlightRanges.forEach(([start, end], idx) => {
      if (start > lastIndex) {
        parts.push(displayText.slice(lastIndex, start));
      }
      parts.push(
        <mark key={`${message.id}-h-${idx}`} className="msg-highlight">
          {displayText.slice(start, end)}
        </mark>
      );
      lastIndex = end;
    });
    if (lastIndex < displayText.length) {
      parts.push(displayText.slice(lastIndex));
    }
    return parts;
  };

  return (
    <div
      className="msg-row"
      style={{ marginTop: meta.gapAbove }}
      data-self={message.isSelf}
    >
      <div className="msg-row__inner">
        {!message.isSelf && meta.avatarVisible && (
          <img className="msg-avatar" src={message.avatar} alt={senderName} />
        )}
        <div
          className="msg-bubble-wrap"
          role="group"
          tabIndex={0}
          aria-label={`${senderName} ${new Date(message.timestamp).toLocaleTimeString()}`}
        >
          <div className={bubbleClasses}>
            {showLabel && (
              <div className="msg-label">
                {message.isSelf ? 'You' : senderName}
              </div>
            )}
            {reply && (
              <div className="msg-reply">
                <span className="msg-reply__name">
                  {reply.from || (message.isSelf ? senderName : 'You')}
                </span>
                <span className="msg-reply__text">
                  {normalizeText(reply.text) || 'Attachment'}
                </span>
              </div>
            )}
            {audio && (
              <div className="msg-audio">
                <audio controls src={audio.url} className="msg-audio__player" />
              </div>
            )}
            <div className="msg-content">
              {displayText && <span className="msg-text">{renderText()}</span>}
            </div>
            <div className="msg-timestamp">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          {message.isSelf && (
            <div className={`msg-ticks msg-ticks--${message.status || 'sent'}`}>
              {message.status === 'sent' && '✓'}
              {message.status !== 'sent' && '✓✓'}
            </div>
          )}
          <div className="msg-reactions" aria-hidden="true">
            {message.reactions?.map((r) => (
              <span key={`${message.id}-${r}`}>{r}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
