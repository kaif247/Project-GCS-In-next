import React from 'react';
import LiveSetupPage from '../components/live/LiveSetupPage';

const LivePage = () => {
  const dummyUser = {
    username: 'Kaif',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  };

  const destinations = ['Post on profile', 'Post on a page', 'Post in a group'];

  return (
    <LiveSetupPage
      username={dummyUser.username}
      avatarUrl={dummyUser.avatarUrl}
      roleText="Host · Your profile"
      destinations={destinations}
      defaultDestination="Post on profile"
      onPrimaryAction={() => console.log('Set up live video')}
    />
  );
};

export default LivePage;
