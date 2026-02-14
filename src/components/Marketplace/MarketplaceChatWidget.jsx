import React, { useContext, useMemo, useState } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import {
  MarketplaceMessagingContext,
  buildThreadId,
} from '../../context/MarketplaceMessagingContext';

const MarketplaceChatWidget = ({ product, isOpen, onClose }) => {
  const { t } = useContext(LanguageContext);
  const { threads, sendBuyerMessage } = useContext(MarketplaceMessagingContext);
  const [message, setMessage] = useState('');

  const sellerEmail = product?.details?.contactEmail || '';
  const sellerPhone = product?.details?.contactPhone || '';
  const sellerName = product?.details?.contactName || 'Marketplace Seller';

  const threadId = useMemo(
    () => buildThreadId(product.id, sellerEmail, sellerPhone),
    [product.id, sellerEmail, sellerPhone]
  );

  const thread = threads.find((item) => item.id === threadId);

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    sendBuyerMessage({
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      sellerEmail,
      sellerPhone,
      sellerName,
      text,
    });
    setMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="marketplace-chat">
      <div className="marketplace-chat__header">
        <div>
          <strong>{t('Contact seller')}</strong>
          <span>{product.title}</span>
        </div>
        <button type="button" onClick={onClose} aria-label={t('Close chat')}>
          ×
        </button>
      </div>

      <div className="marketplace-chat__seller">
        <div>
          <span>{t('Seller')}</span>
          <strong>{sellerName}</strong>
        </div>
        <div>
          <span>{t('Email')}</span>
          <strong>{sellerEmail || t('Not provided')}</strong>
        </div>
        <div>
          <span>{t('Phone')}</span>
          <strong>{sellerPhone || t('Not provided')}</strong>
        </div>
        <div className="marketplace-chat__seller-actions">
          <a href="/profiles">{t('View seller profile')}</a>
          {sellerPhone && <a href={`tel:${sellerPhone}`}>{t('Call seller')}</a>}
        </div>
      </div>

      <div className="marketplace-chat__messages">
        {(thread?.messages || []).map((msg) => (
          <div key={msg.id} className="marketplace-chat__message">
            <span>{msg.text}</span>
            <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
        {(!thread || thread.messages.length === 0) && (
          <div className="marketplace-chat__empty">{t('Start the conversation')}</div>
        )}
      </div>

      <div className="marketplace-chat__composer">
        <textarea
          rows="2"
          placeholder={t('Write a message to the seller...')}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="button" onClick={handleSend}>
          {t('Send')}
        </button>
      </div>
    </div>
  );
};

export default MarketplaceChatWidget;
