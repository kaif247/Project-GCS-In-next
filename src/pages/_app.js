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
import '../components/Friends/friends.css';
import '../components/live/live.css';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import InitialLoader from '../components/InitialLoader';

export default function App({ Component, pageProps }) {
  const [showLoader, setShowLoader] = useState(true);

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

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="app">
          {showLoader && <InitialLoader />}
          <Navbar />
          <Component {...pageProps} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
