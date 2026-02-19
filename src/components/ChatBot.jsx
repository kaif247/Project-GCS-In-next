import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

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

  const respond = (text) => {
    const message = text.toLowerCase();

    const pageMatch = pageCatalog
      .map((page) => {
        const hits = page.keywords.filter((word) => message.includes(word)).length;
        return { page, hits };
      })
      .sort((a, b) => b.hits - a.hits)
      .find((item) => item.hits > 0);

    if (pageMatch) {
      return {
        text: `${pageMatch.page.title.en}: ${pageMatch.page.guidance.join(' ')}`,
        links: buildPageLinks(pageMatch.page),
      };
    }

    const featureMatch = featureCatalog.find((feature) =>
      feature.keywords.some((word) => message.includes(word))
    );

    if (featureMatch) {
      const pages = featureMatch.pages
        .map((id) => pageCatalog.find((page) => page.id === id))
        .filter(Boolean);
      return {
        text: featureMatch.guidance.join(' '),
        links: pages.flatMap((page) => buildPageLinks(page)),
      };
    }

    if (contextHint !== 'general') {
      const currentPage = pageCatalog.find((page) => page.id === contextHint);
      if (currentPage) {
        return {
          text: `${currentPage.title.en}: ${currentPage.guidance.join(' ')}`,
          links: buildPageLinks(currentPage),
        };
      }
    }

    return {
      text:
        'I can guide you anywhere on the site. Try asking about Home, Friends, Marketplace, Profile, Live, or Admin.',
      links: [
        ...buildPageLinks(pageCatalog[0]),
        ...buildPageLinks(pageCatalog[2]),
        ...buildPageLinks(pageCatalog[3]),
      ],
    };
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
