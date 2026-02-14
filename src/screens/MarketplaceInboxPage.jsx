import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MarketplaceMessagingContext } from '../context/MarketplaceMessagingContext';
import { LanguageContext } from '../context/LanguageContext';

const MarketplaceInboxPage = () => {
  const { t } = useContext(LanguageContext);
  const { threads, deleteThread, deleteMessage } = useContext(MarketplaceMessagingContext);
  const router = useRouter();
  const tab = router.query.tab === 'notifications' ? 'notifications' : 'inbox';
  const [activeThreadId, setActiveThreadId] = useState(threads[0]?.id || '');

  useEffect(() => {
    if (threads.length === 0) {
      setActiveThreadId('');
      return;
    }
    if (!threads.find((thread) => thread.id === activeThreadId)) {
      setActiveThreadId(threads[0].id);
    }
  }, [threads, activeThreadId]);

  const activeThread = threads.find((thread) => thread.id === activeThreadId) || threads[0];

  const notifications = useMemo(() => {
    const entries = [];
    threads.forEach((thread) => {
      thread.messages.forEach((message) => {
        if (message.sender === 'buyer') {
          entries.push({
            threadId: thread.id,
            productTitle: thread.productTitle,
            buyer: thread.buyer,
            text: message.text,
            createdAt: message.createdAt,
          });
        }
      });
    });
    return entries.sort((a, b) => b.createdAt - a.createdAt);
  }, [threads]);

  return (
    <div className="marketplace-inbox">
      <div className="marketplace-inbox__header">
        <div>
          <h1>{t('Marketplace Inbox')}</h1>
          <p>{t('Buyer messages and notifications')}</p>
        </div>
        <Link className="marketplace-inbox__back" href="/marketplace">
          {t('Back to Marketplace')}
        </Link>
      </div>

      <div className="marketplace-inbox__tabs">
        <button
          type="button"
          className={tab === 'inbox' ? 'active' : ''}
          onClick={() => router.push('/marketplace/inbox')}
        >
          {t('Inbox')}
        </button>
        <button
          type="button"
          className={tab === 'notifications' ? 'active' : ''}
          onClick={() => router.push('/marketplace/inbox?tab=notifications')}
        >
          {t('Notifications')}
        </button>
      </div>

      {tab === 'notifications' && (
        <div className="marketplace-inbox__panel">
          {notifications.length === 0 ? (
            <div className="marketplace-inbox__empty">{t('No buyer notifications yet.')}</div>
          ) : (
            <div className="marketplace-inbox__notifications">
              {notifications.map((note) => (
                <div key={`${note.threadId}-${note.createdAt}`} className="marketplace-note">
                  <img src={note.buyer.avatar} alt={note.buyer.name} />
                  <div>
                    <strong>{note.buyer.name}</strong>
                    <span>{note.text}</span>
                    <small>{note.productTitle}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'inbox' && (
        <div className="marketplace-inbox__layout">
          <aside className="marketplace-inbox__list">
            {threads.length === 0 && (
              <div className="marketplace-inbox__empty">{t('No buyer messages yet.')}</div>
            )}
            {threads.map((thread) => (
              <button
                type="button"
                key={thread.id}
                className={`marketplace-inbox__thread ${
                  activeThread?.id === thread.id ? 'active' : ''
                }`}
                onClick={() => setActiveThreadId(thread.id)}
              >
                <img src={thread.buyer.avatar} alt={thread.buyer.name} />
                <div>
                  <strong>{thread.buyer.name}</strong>
                  <span>{thread.lastMessage}</span>
                  <small>{thread.productTitle}</small>
                </div>
              </button>
            ))}
          </aside>

          <section className="marketplace-inbox__chat">
            {!activeThread ? (
              <div className="marketplace-inbox__empty">{t('Select a conversation')}</div>
            ) : (
              <>
                <div className="marketplace-inbox__chat-header">
                  <div>
                    <h2>{activeThread.productTitle}</h2>
                    <p>{t('Buyer')}: {activeThread.buyer.name}</p>
                  </div>
                  <button
                    type="button"
                    className="marketplace-inbox__delete"
                    onClick={() => deleteThread(activeThread.id)}
                  >
                    {t('Delete thread')}
                  </button>
                </div>

                <div className="marketplace-inbox__messages">
                  {activeThread.messages.map((msg) => (
                    <div key={msg.id} className="marketplace-inbox__message">
                      <div>
                        <strong>{activeThread.buyer.name}</strong>
                        <span>{msg.text}</span>
                        <small>{new Date(msg.createdAt).toLocaleString()}</small>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteMessage(activeThread.id, msg.id)}
                      >
                        {t('Delete')}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default MarketplaceInboxPage;
