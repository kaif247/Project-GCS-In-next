import React, { useMemo, useState, useEffect, useContext } from 'react';
import MarketplaceSidebar from '../components/Marketplace/MarketplaceSidebar';
import MarketplaceGrid from '../components/Marketplace/MarketplaceGrid';
import ToggleButton from '../components/ToggleButton';
import { LanguageContext } from '../context/LanguageContext';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { MarketplaceMessagingContext } from '../context/MarketplaceMessagingContext';

const categories = [
  'Vehicles',
  'Property for rent',
  'Classifieds',
  'Clothing',
  'Electronics',
  'Entertainment',
  'Family',
  'Free stuff',
];

const MarketplacePage = () => {
  const { t } = useContext(LanguageContext);
  const { products } = useContext(MarketplaceContext);
  const { threads, deleteThread, deleteMessage, sendSellerMessage } = useContext(MarketplaceMessagingContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Browse all');
  const [activeSection, setActiveSection] = useState('browse');
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState('');
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      if (mobile) setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = term === '' || product.title.toLowerCase().includes(term);
      const matchesCategory =
        activeCategory === 'Browse all' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, products]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setActiveSection('browse');
  };

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

  const activeThread = threads.find((thread) => thread.id === activeThreadId) || threads[0];

  const handleSendReply = () => {
    const text = replyText.trim();
    if (!activeThread || !text) return;
    sendSellerMessage({ threadId: activeThread.id, text });
    setReplyText('');
  };

  return (
    <div className="marketplace-page">
      {isMobile && (
        <ToggleButton
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          label={t('Toggle marketplace sidebar')}
        />
      )}
      <div className={`marketplace-sidebar-wrap ${isSidebarOpen ? 'open' : ''}`}>
        <MarketplaceSidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
      {activeSection === 'selling' ? (
        <div className="marketplace-selling">
          <div className="marketplace-panel">
            <div className="marketplace-panel__header">
              <h2>{t('Overview')}</h2>
            </div>
            <div className="marketplace-panel__grid">
              <div className="marketplace-stat">
                <div className="marketplace-stat__value">2</div>
                <div className="marketplace-stat__label">{t('Chats to answer')}</div>
              </div>
              <div className="marketplace-stat">
                <div className="marketplace-stat__value">0</div>
                <div className="marketplace-stat__label">{t('Seller rating')}</div>
                <div className="marketplace-stat__note">0 {t('reviews')}</div>
              </div>
            </div>
          </div>

          <div className="marketplace-panel">
            <div className="marketplace-panel__header">
              <h2>{t('Your listings')}</h2>
              <div className="marketplace-panel__actions">
                <button type="button" className="marketplace-btn">
                  {t('Boost listings')}
                </button>
                <button type="button" className="marketplace-btn marketplace-btn--primary">
                  {t('Create new listing')}
                </button>
              </div>
            </div>
            <div className="marketplace-panel__grid marketplace-panel__grid--three">
              {[
                { value: 0, label: t('Needs attention') },
                { value: 1, label: t('Active and pending') },
                { value: 0, label: t('Sold and out of stock') },
                { value: 0, label: t('Drafts') },
                { value: 0, label: t('To renew') },
                { value: 0, label: t('To delete and relist') },
              ].map((item, index) => (
                <div key={`${item.label}-${index}`} className="marketplace-stat">
                  <div className="marketplace-stat__value">{item.value}</div>
                  <div className="marketplace-stat__label">{item.label}</div>
                </div>
              ))}
            </div>
            <button type="button" className="marketplace-link">
              {t('See all listings')}
            </button>
          </div>

          <div className="marketplace-panel">
            <div className="marketplace-panel__header">
              <h2>{t('Marketplace insights')}</h2>
              <button type="button" className="marketplace-btn marketplace-btn--ghost">
                {t('Last 7 days')}
              </button>
            </div>
            <div className="marketplace-panel__grid marketplace-panel__grid--four">
              {[
                { value: 0, label: t('Clicks on listings') },
                { value: 0, label: t('Listing saves') },
                { value: 0, label: t('Listing shares') },
                { value: 0, label: t('Marketplace followers') },
              ].map((item, index) => (
                <div key={`${item.label}-${index}`} className="marketplace-stat">
                  <div className="marketplace-stat__value">{item.value}</div>
                  <div className="marketplace-stat__label">{item.label}</div>
                </div>
              ))}
            </div>
            <button type="button" className="marketplace-link">
              {t('See more insights')}
            </button>
          </div>
        </div>
      ) : activeSection === 'inbox' ? (
        <div className="marketplace-inbox marketplace-inbox--inline">
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
                      <p>
                        {t('Buyer')}: {activeThread.buyer.name}
                      </p>
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
                      <div
                        key={msg.id}
                        className={`marketplace-inbox__message ${
                          msg.sender === 'seller' ? 'is-seller' : 'is-buyer'
                        }`}
                      >
                        <div>
                          <strong>
                            {msg.sender === 'seller' ? t('You') : activeThread.buyer.name}
                          </strong>
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

                  <div className="marketplace-inbox__composer">
                    <input
                      type="text"
                      placeholder={t('Type a reply...')}
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') handleSendReply();
                      }}
                    />
                    <button type="button" onClick={handleSendReply}>
                      {t('Send')}
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      ) : activeSection === 'notifications' ? (
        <div className="marketplace-inbox marketplace-inbox--inline">
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
        </div>
      ) : (
        <MarketplaceGrid products={filteredProducts} />
      )}
    </div>
  );
};

export default MarketplacePage;
