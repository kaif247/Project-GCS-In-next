import React, { useEffect } from 'react';
import Head from 'next/head';
import LeftSidebar from '../components/LeftSidebar';
import Feed from '../components/Feed';
import RightSidebar from '../components/RightSidebar';
import SovereignHero from '../components/SovereignHero';

const FeedPage = () => {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    document.body.classList.add('sovereign-feed-route');

    return () => {
      document.body.classList.remove('sovereign-feed-route');
    };
  }, []);

  return (
    <>
      <Head>
        <title>House of Dorvilus | Sovereign Feed</title>
        <meta
          name="description"
          content="High-priority sovereign feed with Imperial Hero and registry-first social stream."
        />
      </Head>

      <SovereignHero sticky />

      <div className="app-container app-container--sovereign-feed">
        <LeftSidebar />
        <Feed />
        <RightSidebar />
      </div>
    </>
  );
};

export default FeedPage;
