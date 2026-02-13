import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import LiveCard from './LiveCard';
import ToggleButton from '../ToggleButton';

const LiveSetupPage = ({
  username,
  avatarUrl,
  roleText = 'Host · Your profile',
  destinations,
  defaultDestination,
  onPrimaryAction,
  hideToggle = false,
}) => {
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
    <div className="live-page">
      {isMobile && !hideToggle && (
        <ToggleButton
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          label="Toggle live sidebar"
        />
      )}

      <div className="live-layout">
        {isMobile && isSidebarOpen && (
          <button
            type="button"
            className="live-sidebar-backdrop"
            aria-label="Close live sidebar"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className={`live-sidebar-wrap ${isSidebarOpen ? 'open' : ''}`}>
          <div className="live-sidebar">
            <Sidebar
              username={username}
              avatarUrl={avatarUrl}
              roleText={roleText}
              destinations={destinations}
              defaultDestination={defaultDestination}
              variant="desktop"
            />
          </div>
        </div>

        <main className="live-main">
          <div className="live-main-inner">
            <div className="live-header">
              <h1>Welcome back, {username}!</h1>
              <p>Choose how you want to go live.</p>
            </div>

            <LiveCard onPrimaryAction={onPrimaryAction} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LiveSetupPage;
