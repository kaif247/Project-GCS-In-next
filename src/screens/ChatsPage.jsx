import React, { useEffect, useMemo, useRef, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import ChatsSidebar from '../components/Chats/ChatsSidebar';
import ChatsMain from '../components/Chats/ChatsMain';
import { chatsFeed } from '../data/chatsFeed';
import ToggleButton from '../components/ToggleButton';
import { LanguageContext } from '../context/LanguageContext';

const ChatsPage = () => {
  const { t } = useContext(LanguageContext);
  const router = useRouter();
  const [chats, setChats] = useState(chatsFeed);
  const [activeChatId, setActiveChatId] = useState(chatsFeed[0]?.id);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sentMessageKeys = useRef(new Set());
  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId),
    [activeChatId, chats]
  );

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

  useEffect(() => {
    const rawName = router.query.name;
    if (!rawName) return;
    const name = Array.isArray(rawName) ? rawName[0] : rawName;
    const rawAvatar = router.query.avatar;
    const avatar = Array.isArray(rawAvatar) ? rawAvatar[0] : rawAvatar;
    const rawMessage = router.query.message;
    const message = rawMessage ? (Array.isArray(rawMessage) ? rawMessage[0] : rawMessage) : '';
    const safeName = decodeURIComponent(name);
    const safeAvatar = avatar ? decodeURIComponent(avatar) : undefined;
    const safeMessage = message ? decodeURIComponent(message) : '';
    const messageKey = safeMessage ? `${safeName}::${safeMessage}` : '';

    setChats((prev) => {
      const existing = prev.find((chat) => chat.name === safeName);
      if (existing) {
        setActiveChatId(existing.id);
        if (safeMessage && !sentMessageKeys.current.has(messageKey)) {
          sentMessageKeys.current.add(messageKey);
          return prev.map((chat) =>
            chat.id === existing.id
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    { id: `${existing.id}-${Date.now()}`, from: 'me', text: safeMessage },
                  ],
                }
              : chat
          );
        }
        return prev;
      }
      const nextId = prev.length ? Math.max(...prev.map((chat) => chat.id)) + 1 : 1;
      const newChat = {
        id: nextId,
        name: safeName,
        avatar: safeAvatar || 'https://i.pravatar.cc/100?img=1',
        meta: 'Active now',
        online: true,
        messages: safeMessage
          ? [{ id: `${nextId}-${Date.now()}`, from: 'me', text: safeMessage }]
          : [],
      };
      setActiveChatId(nextId);
      return [newChat, ...prev];
    });
  }, [router.query.name, router.query.avatar, router.query.message]);

  const handleSend = (chatId, payload) => {
    const data = typeof payload === 'string' ? { text: payload } : payload || {};
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { id: `${chatId}-${Date.now()}`, from: 'me', ...data },
              ],
            }
          : chat
      )
    );
  };

  return (
    <div className="chats-page">
      <div className={`chats-sidebar-wrap ${isSidebarOpen ? 'open' : ''}`}>
        <ChatsSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            setActiveChatId(id);
            if (isMobile) setIsSidebarOpen(false);
          }}
        />
      </div>
      <ChatsMain
        chat={activeChat}
        onSend={handleSend}
        onBack={() => setIsSidebarOpen(true)}
        showBack={isMobile}
      />
      <aside className="chats-info">
        <div className="chats-info__card">
          <img src={activeChat?.avatar} alt={activeChat?.name} />
          <div className="chats-info__name">{activeChat?.name}</div>
          <div className="chats-info__status">{activeChat?.online ? 'Online' : 'Offline'}</div>
          <div className="chats-info__actions">
            <button type="button" aria-label="Call">Call</button>
            <button type="button" aria-label="Video call">Video</button>
          </div>
        </div>
        <div className="chats-info__controls">
          <button type="button" aria-label="Mute notifications">Mute notifications</button>
          <button type="button" aria-label="Pin chat">Pin chat</button>
          <button type="button" aria-label="Star messages">Starred messages</button>
          <button type="button" aria-label="Disappearing messages">Disappearing messages</button>
          <button type="button" aria-label="View once media">View once media</button>
          <button type="button" aria-label="Block or report">Block / Report</button>
        </div>
        <div className="chats-info__section">
          <h4>Shared Media</h4>
          <div className="chats-info__media">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ChatsPage;
