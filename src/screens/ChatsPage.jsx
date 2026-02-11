import React, { useEffect, useMemo, useState, useContext } from 'react';
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
    const safeName = decodeURIComponent(name);
    const safeAvatar = avatar ? decodeURIComponent(avatar) : undefined;

    setChats((prev) => {
      const existing = prev.find((chat) => chat.name === safeName);
      if (existing) {
        setActiveChatId(existing.id);
        return prev;
      }
      const nextId = prev.length ? Math.max(...prev.map((chat) => chat.id)) + 1 : 1;
      const newChat = {
        id: nextId,
        name: safeName,
        avatar: safeAvatar || 'https://i.pravatar.cc/100?img=1',
        meta: 'Active now',
        online: true,
        messages: [],
      };
      setActiveChatId(nextId);
      return [newChat, ...prev];
    });
  }, [router.query.name, router.query.avatar]);

  const handleSend = (chatId, text) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { id: `${chatId}-${Date.now()}`, from: 'me', text },
              ],
            }
          : chat
      )
    );
  };

  return (
    <div className="chats-page">
      {isMobile && (
        <ToggleButton
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          label={t('Toggle chats list')}
        />
      )}
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
    </div>
  );
};

export default ChatsPage;
