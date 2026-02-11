import React, { useEffect, useState } from 'react';
import FriendsSidebar from '../components/Friends/FriendsSidebar';
import FriendsGrid from '../components/Friends/FriendsGrid';
import { friendsData } from '../data/friendsData';
import ToggleButton from '../components/ToggleButton';

const FriendsPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          label="Toggle friends sidebar"
        />
      )}
      <div className={`friends-sidebar-wrap ${isSidebarOpen ? 'open' : ''}`}>
        <FriendsSidebar />
      </div>
      <FriendsGrid friends={friendsData} />
    </div>
  );
};

export default FriendsPage;
