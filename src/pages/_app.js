import '../index.css';
import '../App.css';
import '../components/Navbar.css';
import '../components/LeftSidebar.css';
import '../components/RightSidebar.css';
import '../components/Feed.css';
import '../components/Post.css';
import '../components/Stories.css';
import '../components/CreatePost.css';
import '../components/CommentSection.css';
import '../components/PostUpload.css';
import '../components/PostInput.css';
import '../components/NotificationDropdown.css';
import '../components/MenuDropdown.css';
import '../components/ProfileMenu.css';
import '../components/Icon.css';
import '../components/ToggleButton.css';
import '../components/Chats/chats.css';
import '../components/Marketplace/marketplace.css';
import '../components/Products/products.css';
import '../components/ChatBot.css';
import '../components/ProfileCreate.css';
import '../components/ProfileView.css';
import '../components/Friends/friends.css';
import '../components/live/live.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { MarketplaceProvider } from '../context/MarketplaceContext';
import { CartProvider } from '../context/CartContext';
import { MarketplaceMessagingProvider } from '../context/MarketplaceMessagingContext';
import Navbar from '../components/Navbar';
import InitialLoader from '../components/InitialLoader';
import LiveProducerSection from '../components/live/producer/LiveProducerSection';
import ChatBot from '../components/ChatBot';

export default function App({ Component, pageProps }) {
  const [showLoader, setShowLoader] = useState(true);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isLiveSession, setIsLiveSession] = useState(false);
  const [leavePrompt, setLeavePrompt] = useState({ open: false, target: null, action: null });
  const router = useRouter();

  useEffect(() => {
    const start = Date.now();
    const hideLoader = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 2000 - elapsed);
      setTimeout(() => setShowLoader(false), remaining);
    };

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        hideLoader();
      } else {
        window.addEventListener('load', hideLoader);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', hideLoader);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLiveOpen) setIsLiveSession(false);
  }, [isLiveOpen]);

  const handleNavigateAttempt = (path) => {
    if (isLiveOpen && !isLiveSession) {
      setIsLiveOpen(false);
      setIsLiveSession(false);
      return true;
    }
    if (!isLiveOpen || !isLiveSession) return true;
    setLeavePrompt({ open: true, target: path, action: 'navigate' });
    return false;
  };

  const handleToggleLive = () => {
    if (isLiveOpen && isLiveSession) {
      setLeavePrompt({ open: true, target: null, action: 'close' });
      return;
    }
    setIsLiveOpen((prev) => !prev);
  };

  const handleLiveCloseRequest = () => {
    if (isLiveSession) {
      setLeavePrompt({ open: true, target: null, action: 'close' });
      return;
    }
    setIsLiveOpen(false);
  };

  const handleConfirmLeave = () => {
    const target = leavePrompt.target;
    setIsLiveOpen(false);
    setIsLiveSession(false);
    setLeavePrompt({ open: false, target: null, action: null });
    if (target) router.push(target);
  };

  const handleCancelLeave = () => {
    setLeavePrompt({ open: false, target: null, action: null });
  };


  const isLanding = router.pathname === '/landing';

  return (
    <ThemeProvider>
      <LanguageProvider>
        <MarketplaceProvider>
          <CartProvider>
            <MarketplaceMessagingProvider>
              <div className="app">
                <Head>
                  <title>House of Dorvilus — Imperial Haiti Restoration</title>
                  <meta
                    name="description"
                    content="Join the Sovereign Intelligence movement. Ground your frequency in the Digital Lakou."
                  />
                  <meta
                    name="keywords"
                    content="House of Dorvilus, Imperial Haiti Restoration, Sovereign Intelligence, Digital Lakou, Sovereign Authority"
                  />
                  <link rel="icon" href="/imperial-seal.svg" />
                </Head>
                {showLoader && <InitialLoader />}
                <Navbar
                  isLiveOpen={isLiveOpen}
                  onToggleLive={handleToggleLive}
                  onNavigateAttempt={handleNavigateAttempt}
                  hideThemeToggle={isLanding}
                />
                <Component
                  {...pageProps}
                  onOpenLiveProducer={() => setIsLiveOpen(true)}
                  isLiveProducerOpen={isLiveOpen}
                />
                <ChatBot />
                {isLiveOpen && (
                  <LiveProducerSection
                    onRequestClose={handleLiveCloseRequest}
                    onLiveStateChange={setIsLiveSession}
                  />
                )}
                {leavePrompt.open && (
                  <div className="live-leave-overlay" role="dialog" aria-modal="true">
                    <div className="live-leave-card">
                      <h3 className="live-leave-title">End live session?</h3>
                      <p className="live-leave-text">
                        You are currently live. Leaving this page will end your live session and turn off
                        your camera and microphone.
                      </p>
                      <div className="live-leave-actions">
                        <button type="button" className="lp-btn-secondary" onClick={handleCancelLeave}>
                          Stay live
                        </button>
                        <button type="button" className="lp-btn-primary" onClick={handleConfirmLeave}>
                          End live
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </MarketplaceMessagingProvider>
          </CartProvider>
        </MarketplaceProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
