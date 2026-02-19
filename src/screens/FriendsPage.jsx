import React, { useEffect, useState, useContext } from 'react';
import FriendsSidebar from '../components/Friends/FriendsSidebar';
import FriendsGrid from '../components/Friends/FriendsGrid';
import BirthdaysPage from './BirthdaysPage';
import { friendsData } from '../data/friendsData';
import ToggleButton from '../components/ToggleButton';
import { LanguageContext } from '../context/LanguageContext';

const FriendsPage = () => {
  const { t } = useContext(LanguageContext);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

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

  return (
    <div className="friends-page">
      {/* Friends layout: sidebar + content grid */}
      {isMobile && (
        <ToggleButton
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          label={t('Toggle friends sidebar')}
        />
      )}
      <div className={`friends-sidebar-wrap ${isSidebarOpen ? 'open' : ''}`}>
        <FriendsSidebar
          activeSection={activeSection}
          onSelectSection={(section) => {
            setActiveSection(section);
            if (isMobile) setIsSidebarOpen(false);
          }}
        />
      </div>
      {activeSection === 'birthdays' ? (
        <BirthdaysPage />
      ) : (
        <FriendsGrid friends={friendsData} />
      )}
    </div>
  );
};

export default FriendsPage;
