import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

const STORAGE_KEY = 'gcs-site-chatbot';

const defaultMessages = [
  {
    id: 'welcome',
    role: 'bot',
    text: 'Hi! I can help you with Marketplace, listings, cart, inbox, settings, and more. Ask me anything.',
    ts: Date.now(),
  },
];

const quickActions = [
  { label: 'Go to Marketplace', action: 'go_marketplace' },
  { label: 'Create listing', action: 'go_products' },
  { label: 'Open cart', action: 'go_cart' },
  { label: 'Marketplace inbox', action: 'go_inbox' },
  { label: 'Help with listing', action: 'help_listing' },
];

const getStoredMessages = () => defaultMessages;

const getContextHint = (path) => {
  if (path.startsWith('/marketplace')) return 'marketplace';
  if (path.startsWith('/products')) return 'products';
  if (path.startsWith('/cart')) return 'cart';
  if (path.startsWith('/chats')) return 'chats';
  return 'general';
};

const ChatBot = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(getStoredMessages);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const contextHint = useMemo(() => getContextHint(router.pathname), [router.pathname]);

  const pushMessage = (role, text) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, role, text, ts: Date.now() },
    ]);
  };

  const respond = (text) => {
    const message = text.toLowerCase();

    if (message.includes('marketplace')) {
      router.push('/marketplace');
      return 'Opening Marketplace for you.';
    }
    if (message.includes('product') || message.includes('listing') || message.includes('sell')) {
      router.push('/products');
      return 'Opening the Create Listing page.';
    }
    if (message.includes('cart') || message.includes('checkout')) {
      router.push('/cart');
      return 'Taking you to your cart.';
    }
    if (message.includes('inbox') || message.includes('notifications')) {
      router.push('/marketplace/inbox');
      return 'Opening Marketplace Inbox.';
    }
    if (message.includes('settings')) {
      router.push('/settings');
      return 'Opening Settings.';
    }
    if (message.includes('profile')) {
      router.push('/profiles');
      return 'Opening Profiles.';
    }
    if (message.includes('friends')) {
      router.push('/friends');
      return 'Opening Friends.';
    }
    if (message.includes('home')) {
      router.push('/');
      return 'Taking you back home.';
    }

    if (message.includes('publish') || message.includes('create listing')) {
      return 'Go to Products, fill all required fields, add images, then click “Publish to Marketplace”.';
    }
    if (message.includes('add image') || message.includes('image')) {
      return 'In Create Listing, you can upload images or paste image links. The preview shows how your listing looks.';
    }
    if (message.includes('message seller') || message.includes('contact seller')) {
      return 'Open a product, click “Message seller” or the chat button. Messages appear in Marketplace Inbox.';
    }
    if (message.includes('dark mode') || message.includes('theme')) {
      return 'Use the moon/sun icon in the navbar to toggle light/dark mode.';
    }
    if (message.includes('language')) {
      return 'Use the language icon in the navbar to switch languages.';
    }
    if (message.includes('search') || message.includes('filter')) {
      return 'Use Marketplace search and category buttons on the left sidebar to filter listings.';
    }
    if (message.includes('notifications')) {
      return 'Marketplace notifications from buyers show up in Marketplace Inbox > Notifications.';
    }
    if (message.includes('help')) {
      return 'I can navigate, explain features, and guide you through listing, cart, inbox, and settings. Ask me what you need.';
    }

    if (contextHint === 'marketplace') {
      return 'You are in Marketplace. Try: “create listing”, “open inbox”, or “filter by category”.';
    }
    if (contextHint === 'products') {
      return 'You are on Create Listing. Add title, price, location, and images, then publish.';
    }
    if (contextHint === 'cart') {
      return 'You are in Cart. You can change quantity or remove items before checkout.';
    }

    return 'I can help with Marketplace, listings, cart, inbox, settings, and more. Try “open marketplace” or “create listing”.';
  };

  const handleSend = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    pushMessage('user', trimmed);
    const reply = respond(trimmed);
    pushMessage('bot', reply);
    setInput('');
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'go_marketplace':
        handleSend('open marketplace');
        break;
      case 'go_products':
        handleSend('create listing');
        break;
      case 'go_cart':
        handleSend('open cart');
        break;
      case 'go_inbox':
        handleSend('open inbox');
        break;
      case 'help_listing':
        handleSend('help with listing');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <button
        type="button"
        className="site-chatbot-fab"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open help chat"
      >
        ?
      </button>

      {open && (
        <div className="site-chatbot">
          <div className="site-chatbot__header">
            <div>
              <strong>GCS Helper</strong>
              <span>Ask anything about this website</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>

          <div className="site-chatbot__quick">
            {quickActions.map((item) => (
              <button
                key={item.action}
                type="button"
                onClick={() => handleQuickAction(item.action)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="site-chatbot__messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`site-chatbot__message site-chatbot__message--${msg.role}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="site-chatbot__composer">
            <input
              type="text"
              placeholder="Ask about listings, cart, inbox..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSend(input);
              }}
            />
            <button type="button" onClick={() => handleSend(input)}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
