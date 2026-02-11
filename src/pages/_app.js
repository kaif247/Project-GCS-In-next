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
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="app">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
