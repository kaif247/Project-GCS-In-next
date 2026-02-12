import React, { useState } from 'react';
import Sidebar from './Sidebar';
import LiveCard from './LiveCard';
import MobileHeader from './MobileHeader';

const LiveSetupPage = ({
  username,
  avatarUrl,
  roleText = 'Host · Your profile',
  destinations,
  defaultDestination,
  onPrimaryAction,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="live-page">
      <MobileHeader
        title="Create live video"
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      <div className="live-layout">
        <div className="live-sidebar live-sidebar--desktop">
          <Sidebar
            username={username}
            avatarUrl={avatarUrl}
            roleText={roleText}
            destinations={destinations}
            defaultDestination={defaultDestination}
            variant="desktop"
          />
        </div>

        {isMobileMenuOpen && (
          <div className="live-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="live-drawer" onClick={(e) => e.stopPropagation()}>
              <Sidebar
                username={username}
                avatarUrl={avatarUrl}
                roleText={roleText}
                destinations={destinations}
                defaultDestination={defaultDestination}
                variant="mobile"
                onClose={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

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
