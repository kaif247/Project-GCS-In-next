import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'gcs-marketplace-messages';

export const buildThreadId = (productId, sellerEmail, sellerPhone) => {
  const sellerKey = sellerEmail || sellerPhone || 'seller';
  return `${sellerKey}::${productId}`;
};

export const MarketplaceMessagingContext = createContext({
  threads: [],
  sendBuyerMessage: () => {},
  sendSellerMessage: () => {},
  deleteThread: () => {},
  deleteMessage: () => {},
});

const defaultBuyer = {
  id: 'buyer-1',
  name: 'GCS Buyer',
  avatar: 'https://i.pravatar.cc/150?img=32',
};

const loadStoredThreads = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const MarketplaceMessagingProvider = ({ children }) => {
  const [threads, setThreads] = useState(loadStoredThreads);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads]);

  const sendBuyerMessage = useCallback((payload) => {
    const {
      productId,
      productTitle,
      productImage,
      sellerEmail,
      sellerPhone,
      sellerName,
      buyer = defaultBuyer,
      text,
    } = payload;

    const message = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sender: 'buyer',
      text,
      createdAt: Date.now(),
    };

    const threadId = buildThreadId(productId, sellerEmail, sellerPhone);

    setThreads((prev) => {
      const existing = prev.find((thread) => thread.id === threadId);
      if (existing) {
        return prev.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                messages: [...thread.messages, message],
                lastMessageAt: message.createdAt,
                lastMessage: message.text,
              }
            : thread
        );
      }

      const newThread = {
        id: threadId,
        productId,
        productTitle,
        productImage,
        seller: {
          name: sellerName || 'Marketplace Seller',
          email: sellerEmail || '',
          phone: sellerPhone || '',
        },
        buyer,
        messages: [message],
        lastMessageAt: message.createdAt,
        lastMessage: message.text,
      };

      return [newThread, ...prev];
    });
  }, []);

  const sendSellerMessage = useCallback((payload) => {
    const { threadId, text } = payload;
    const message = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sender: 'seller',
      text,
      createdAt: Date.now(),
    };

    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              messages: [...thread.messages, message],
              lastMessageAt: message.createdAt,
              lastMessage: message.text,
            }
          : thread
      )
    );
  }, []);

  const deleteThread = useCallback((threadId) => {
    setThreads((prev) => prev.filter((thread) => thread.id !== threadId));
  }, []);

  const deleteMessage = useCallback((threadId, messageId) => {
    setThreads((prev) =>
      prev
        .map((thread) => {
          if (thread.id !== threadId) return thread;
          const nextMessages = thread.messages.filter((msg) => msg.id !== messageId);
          const last = nextMessages[nextMessages.length - 1];
          return {
            ...thread,
            messages: nextMessages,
            lastMessageAt: last ? last.createdAt : 0,
            lastMessage: last ? last.text : '',
          };
        })
        .filter((thread) => thread.messages.length > 0)
    );
  }, []);

  const value = useMemo(
    () => ({
      threads,
      sendBuyerMessage,
      sendSellerMessage,
      deleteThread,
      deleteMessage,
    }),
    [threads, sendBuyerMessage, sendSellerMessage, deleteThread, deleteMessage]
  );

  return (
    <MarketplaceMessagingContext.Provider value={value}>
      {children}
    </MarketplaceMessagingContext.Provider>
  );
};
