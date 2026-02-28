import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Fuse from 'fuse.js';
const STORAGE_KEY = 'gcs-site-chatbot';

const defaultMessages = [
  {
    id: 'welcome',
    role: 'bot',
    text: 'Hi! I can guide you across the entire site. Ask about any page, feature, or action.',
    ts: Date.now(),
  },
];

const quickActions = [
  { label: 'Home', action: 'go_home' },
  { label: 'Friends', action: 'go_friends' },
  { label: 'Marketplace', action: 'go_marketplace' },
  { label: 'Profile', action: 'go_profile' },
  { label: 'Live', action: 'go_live' },
];

const getStoredMessages = () => defaultMessages;

const pageCatalog = [
  {
    id: 'home',
    path: '/',
    title: { en: 'Home', fr: 'Accueil', es: 'Inicio', ht: 'Akey' },
    keywords: ['home', 'feed', 'timeline', 'posts'],
    guidance: [
      'Browse the main feed, create posts, and interact with reactions and comments.',
      'Use the top navbar for search, language, and notifications.',
    ],
  },
  {
    id: 'friends',
    path: '/friends',
    title: { en: 'Friends', fr: 'Amis', es: 'Amigos', ht: 'Zanmi' },
    keywords: ['friends', 'requests', 'birthdays', 'custom list'],
    guidance: [
      'See friend suggestions, requests, and birthdays.',
      'Use the sidebar to switch sections and manage people.',
    ],
  },
  {
    id: 'friends_suggestions',
    path: '/friends/suggestions',
    title: { en: 'Friend Suggestions', fr: "Suggestions d'amis", es: 'Sugerencias de amigos', ht: 'Sijesyon zanmi' },
    keywords: ['suggestions', 'people you may know', 'add friend'],
    guidance: [
      'Open a suggested profile, view posts, and send requests.',
    ],
  },
  {
    id: 'marketplace',
    path: '/marketplace',
    title: { en: 'Marketplace', fr: 'Marketplace', es: 'Marketplace', ht: 'Marketplace' },
    keywords: ['marketplace', 'buy', 'sell', 'listing', 'listings'],
    guidance: [
      'Search listings, filter categories, or open seller chat.',
      'Use the sidebar to jump between browse, selling, and inbox.',
    ],
  },
  {
    id: 'products',
    path: '/products',
    title: { en: 'Create Listing', fr: 'Creer une annonce', es: 'Crear anuncio', ht: 'Kreye anons' },
    keywords: ['create listing', 'product', 'sell', 'publish', 'listing form'],
    guidance: [
      'Add title, price, location, and images, then publish.',
    ],
  },
  {
    id: 'cart',
    path: '/cart',
    title: { en: 'Cart', fr: 'Panier', es: 'Carrito', ht: 'Panier' },
    keywords: ['cart', 'checkout', 'order'],
    guidance: [
      'Review items, adjust quantities, and proceed to checkout.',
    ],
  },
  {
    id: 'chats',
    path: '/chats',
    title: { en: 'Chats', fr: 'Messages', es: 'Mensajes', ht: 'Mesaj' },
    keywords: ['chat', 'message', 'dm', 'inbox'],
    guidance: [
      'Use chats to talk with friends and sellers.',
    ],
  },
  {
    id: 'profile',
    path: '/profile',
    title: { en: 'Profile', fr: 'Profil', es: 'Perfil', ht: 'Pwofil' },
    keywords: ['profile', 'bio', 'avatar', 'cover'],
    guidance: [
      'View your profile, update cover and avatar, and see your posts.',
    ],
  },
  {
    id: 'profile_create',
    path: '/profile/create',
    title: { en: 'Edit Profile', fr: 'Modifier le profil', es: 'Editar perfil', ht: 'Modifye pwofil' },
    keywords: ['edit profile', 'create profile', 'update profile'],
    guidance: [
      'Add a bio, update username, and upload cover or avatar.',
    ],
  },
  {
    id: 'live',
    path: '/live',
    title: { en: 'Live', fr: 'En direct', es: 'En vivo', ht: 'An direk' },
    keywords: ['live', 'stream', 'broadcast'],
    guidance: [
      'Start a live session, configure camera and microphone, and go live.',
    ],
  },
  {
    id: 'admin',
    path: '/admin',
    title: { en: 'Admin Panel', fr: 'Panneau admin', es: 'Panel admin', ht: 'Panno admin' },
    keywords: ['admin', 'moderation', 'dashboard'],
    guidance: [
      'Admin login required. Manage reports, users, policies, and alerts.',
    ],
  },
  {
    id: 'settings',
    path: '/settings',
    title: { en: 'Settings', fr: 'Parametres', es: 'Configuracion', ht: 'Paramet' },
    keywords: ['settings', 'preferences', 'privacy'],
    guidance: [
      'Manage account preferences and site settings.',
    ],
  },
];

const featureCatalog = [
  {
    id: 'language',
    keywords: ['language', 'translate', 'english', 'francais', 'french', 'espanol', 'spanish', 'kreyol'],
    guidance: [
      'Use the language icon in the navbar to switch site language.',
    ],
    pages: ['home'],
  },
  {
    id: 'search',
    keywords: ['search', 'find', 'filter'],
    guidance: [
      'Use the search bar in the navbar or in section sidebars to filter content.',
    ],
    pages: ['home', 'marketplace', 'friends', 'chats'],
  },
  {
    id: 'post',
    keywords: ['post', 'share', 'upload', 'photo', 'video'],
    guidance: [
      'Use the post composer on the home feed to share text, photos, or video.',
    ],
    pages: ['home'],
  },
  {
    id: 'story',
    keywords: ['story', 'stories'],
    guidance: [
      'Open Stories from the home feed and tap a story to view it.',
    ],
    pages: ['home'],
  },
  {
    id: 'comment',
    keywords: ['comment', 'reply'],
    guidance: [
      'Use the comment box under a post or inside the post popup.',
    ],
    pages: ['home'],
  },
  {
    id: 'login_admin',
    keywords: ['admin login', 'moderation login', 'dashboard login'],
    guidance: [
      'Open the admin login page and sign in to access the dashboard.',
    ],
    pages: ['admin'],
  },
];

const getContextHint = (path) => {
  const match = pageCatalog.find((page) => path === page.path || path.startsWith(`${page.path}/`));
  return match?.id || 'general';
};

const buildPageLinks = (page) => ([
  { label: `${page.title.en} (EN)`, path: page.path },
  { label: `${page.title.fr} (FR)`, path: page.path },
  { label: `${page.title.es} (ES)`, path: page.path },
  { label: `${page.title.ht} (Kreyol)`, path: page.path },
]);

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

  const pushMessage = (role, text, links = []) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role,
        text,
        links,
        ts: Date.now(),
      },
    ]);
  };
// Add this to your pageCatalog to include more features:

const pageCatalog = [
  // ... existing pages ...
  {
    id: 'live_streaming',
    path: '/live',
    title: { en: 'Live Streaming', fr: 'Streaming en direct', es: 'Transmisión en vivo', ht: 'Diffizyon dirèk' },
    keywords: ['live', 'stream', 'broadcast', 'watch live', 'go live'],
    guidance: [
      'Start a live stream by clicking the "Go Live" button.',
      'Viewers can watch, comment, and react in real-time.',
      'Save your streams for later viewing.'
    ],
  },

  {
    id: 'account_settings',
    path: '/settings',
    title: { en: 'Settings', fr: 'Paramètres', es: 'Configuración', ht: 'Anviwònman' },
    keywords: ['settings', 'account', 'password', 'email', 'privacy', 'notifications'],
    guidance: [
      'Update your profile information and avatar.',
      'Change password and manage security settings.',
      'Configure notification preferences.'
    ],
  },
];
// Add a feature catalog to handle questions spanning multiple pages:

const featureCatalog = [
  {
    id: 'messaging',
    title: 'Messaging & Chats',
    keywords: ['message', 'chat', 'inbox', 'text', 'send message'],
    guidance: [
      'Click on a friend or seller to open a chat.',
      'Type your message and press Enter or click Send.',
      'Use attachments to share images, videos, or files.',
      'You\'ll get notifications for new messages.',
    ],
    pages: ['chats', 'marketplace', 'friends'],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    keywords: ['notification', 'notify', 'alert', 'remind', 'notification settings'],
    guidance: [
      'Check the bell icon in the top navigation bar.',
      'Click on any notification to go directly to that content.',
      'Manage notification preferences in Settings.',
    ],
    pages: ['home', 'settings'],
  },
  {
    id: 'search',
    title: 'Search',
    keywords: ['search', 'find', 'look for', 'search people', 'search products'],
    guidance: [
      'Use the search bar in the top navigation.',
      'Search for people, products, posts, or content.',
      'Filter results to narrow down your search.',
    ],
    pages: ['home', 'marketplace', 'friends'],
  },
  {
    id: 'safety_reporting',
    title: 'Safety & Reporting',
    keywords: ['report', 'safety', 'block', 'abuse', 'spam', 'offensive', 'harassment'],
    guidance: [
      'Click the three-dots menu on any post or profile.',
      'Select "Report" and choose the reason.',
      'Provide details about the issue.',
      'Our moderation team will review and take action.',
    ],
    pages: ['home', 'marketplace', 'friends', 'profile'],
  },
];

// Replace the current respond function with this improved version:

const respond = (text) => {
  const message = text.toLowerCase().trim();

  // 1. Try exact page match
  const pageMatch = pageCatalog
    .map((page) => {
      const hits = page.keywords.filter((word) => message.includes(word)).length;
      return { page, hits };
    })
    .sort((a, b) => b.hits - a.hits)
    .find((item) => item.hits > 0);

  if (pageMatch) {
    return {
      text: `📍 ${pageMatch.page.title.en}: ${pageMatch.page.guidance.join(' ')}`,
      links: buildPageLinks(pageMatch.page),
    };
  }

  // 2. Try feature match
  const featureMatch = featureCatalog.find((feature) =>
    feature.keywords.some((word) => message.includes(word))
  );

  if (featureMatch) {
    const pages = featureMatch.pages
      .map((id) => pageCatalog.find((page) => page.id === id))
      .filter(Boolean);
    return {
      text: `✨ ${featureMatch.title}\n\n${featureMatch.guidance.join('\n\n')}`,
      links: pages.flatMap((page) => buildPageLinks(page)),
    };
  }

  // 3. Try context-based response
  if (contextHint !== 'general') {
    const currentPage = pageCatalog.find((page) => page.id === contextHint);
    if (currentPage) {
      return {
        text: `📌 You're on ${currentPage.title.en}. ${currentPage.guidance.join(' ')}`,
        links: buildPageLinks(currentPage),
      };
    }
  }

  // 4. Default response with suggestions
  return {
    text:
      "🤖 I can guide you through the site! Try asking about:\n• Home (Feed & Posts)\n• Friends\n• Marketplace\n• Profile\n• Chat & Messaging\n• Live Streaming\n• Account Settings\n\nOr ask me about specific actions like 'How do I send a message?' or 'How do I report something?'",
    links: pageCatalog.slice(0, 4).flatMap(buildPageLinks),
  };
};
// Add this FAQ catalog:

const faqCatalog = [
  {
    id: 'how_to_post',
    question: ['how to post', 'create post', 'make post', 'post something'],
    answer: 'To create a post: 1) Go to Home 2) Click "What\'s on your mind?" 3) Type or add media 4) Click "Post"',
    keywords: ['home'],
  },
  {
    id: 'how_to_message',
    question: ['how to message', 'send message', 'dm someone', 'text someone'],
    answer: 'To send a message: 1) Go to Chats 2) Click "New Message" 3) Select a person 4) Type your message 5) Press Enter',
    keywords: ['chats'],
  },
  {
    id: 'how_to_buy',
    question: ['how to buy', 'purchase', 'checkout', 'pay'],
    answer: 'To buy an item: 1) Go to Marketplace 2) Find an item 3) Click "Buy Now" or "Add to Cart" 4) Review and checkout 5) Complete payment',
    keywords: ['marketplace'],
  },
  {
    id: 'how_to_sell',
    question: ['how to sell', 'create listing', 'list item', 'post listing'],
    answer: 'To create a listing: 1) Go to Create Listing 2) Add title, price, and description 3) Upload photos 4) Set location 5) Click "Publish"',
    keywords: ['marketplace', 'products'],
  },
  {
    id: 'change_password',
    question: ['change password', 'reset password', 'forgot password'],
    answer: 'To change your password: 1) Go to Settings 2) Click "Security" 3) Select "Change Password" 4) Enter old and new password 5) Save',
    keywords: ['settings'],
  },
];

// Update respond function to check FAQ:
const respondWithFAQ = (text) => {
  const message = text.toLowerCase().trim();

  // Check FAQ first
  const faqMatch = faqCatalog.find((faq) =>
    faq.question.some((q) => message.includes(q))
  );

  if (faqMatch) {
    return {
      text: `✅ ${faqMatch.answer}`,
      links: faqMatch.keywords
        .map((keyword) => pageCatalog.find((p) => p.keywords.includes(keyword)))
        .filter(Boolean)
        .map(buildPageLinks)
        .flat(),
    };
  }

  // Fall back to original respond function
  return respond(text);
};
const getSuggestionsForPage = (pageId) => {
  const suggestions = {
    home: [
      'How do I create a post?',
      'How do I react to posts?',
      'How do I search for people?',
    ],
    friends: [
      'How do I add a friend?',
      'How do I view friend requests?',
      'How do I create a custom list?',
    ],
    marketplace: [
      'How do I search listings?',
      'How do I create a listing?',
      'How do I contact a seller?',
      'How do I checkout?',
    ],
    chats: [
      'How do I start a new chat?',
      'How do I attach a file?',
      'How do I block someone?',
    ],
    settings: [
      'How do I change my password?',
      'How do I update my profile?',
      'How do I manage privacy?',
    ],
  };
  return suggestions[pageId] || [];
};
// Install: npm install fuse.js
// Then use in your respond function:



const getAllKeywords = () => {
  const keywords = [
    ...pageCatalog.flatMap(p => p.keywords),
    ...featureCatalog.flatMap(f => f.keywords),
    ...faqCatalog.flatMap(f => f.question),
  ];
  return keywords;
};

const fuzzySearchKeyword = (input) => {
  const keywords = getAllKeywords();
  const fuse = new Fuse(keywords, {
    threshold: 0.6,
  });
  const results = fuse.search(input);
  return results.length > 0 ? results[0].item : null;
};

// Keep track of conversation context
const [conversationContext, setConversationContext] = useState({
  lastTopicId: null,
  messageCount: 0,
  userAskedAbout: [],
});

const updateContext = (topicId) => {
  setConversationContext(prev => ({
    ...prev,
    lastTopicId: topicId,
    messageCount: prev.messageCount + 1,
    userAskedAbout: [...prev.userAskedAbout, topicId],
  }));
};
  const handleSend = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    pushMessage('user', trimmed);
    const reply = respond(trimmed);
    pushMessage('bot', reply.text, reply.links || []);
    setInput('');
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'go_home':
        handleSend('home');
        break;
      case 'go_friends':
        handleSend('friends');
        break;
      case 'go_marketplace':
        handleSend('marketplace');
        break;
      case 'go_profile':
        handleSend('profile');
        break;
      case 'go_live':
        handleSend('live');
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
              x
            </button>
          </div>
// In the render section, add:
{open && !messages.some(m => m.role === 'user') && (
  <div className="chatbot-suggestions">
    {getSuggestionsForPage(contextHint).map((suggestion) => (
      <button
        key={suggestion}
        className="suggestion-chip"
        onClick={() => handleSend(suggestion)}
      >
        {suggestion}
      </button>
    ))}
  </div>
)}
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
                <div className="site-chatbot__message-text">{msg.text}</div>
                {msg.links?.length > 0 && (
                  <div className="site-chatbot__links">
                    {msg.links.map((link) => (
                      <button
                        key={`${msg.id}-${link.label}`}
                        type="button"
                        className="site-chatbot__link"
                        onClick={() => router.push(link.path)}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="site-chatbot__composer">
            <input
              type="text"
              placeholder="Ask about any page or feature..."
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
