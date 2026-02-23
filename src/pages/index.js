import React, { useEffect, useRef, useState } from 'react';
import LeftSidebar from '../components/LeftSidebar';
import Feed from '../components/Feed';
import RightSidebar from '../components/RightSidebar';
import HomeHero from '../components/HomeHero';

const HomePage = () => {
  const heroRef = useRef(null);
  const [heroCollapsed, setHeroCollapsed] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    document.body.classList.add('home-hero');

    const onScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || 0;
      const collapsed = window.scrollY > Math.max(80, heroHeight - 140);
      setHeroCollapsed(collapsed);
      document.body.classList.toggle('hero-collapsed', collapsed);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      document.body.classList.remove('home-hero');
      document.body.classList.remove('hero-collapsed');
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <HomeHero ref={heroRef} />
      <div className={`app-container ${heroCollapsed ? 'app-container--hero-collapsed' : ''}`}>
        <LeftSidebar />
        <Feed />
        <RightSidebar />
      </div>
    </>
  );
};

export default HomePage;
