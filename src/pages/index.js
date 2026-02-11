import React from 'react';
import LeftSidebar from '../components/LeftSidebar';
import Feed from '../components/Feed';
import RightSidebar from '../components/RightSidebar';

const HomePage = () => (
  <div className="app-container">
    <LeftSidebar />
    <Feed />
    <RightSidebar />
  </div>
);

export default HomePage;
