import React from 'react';
import FriendCard from './FriendCard';

const FriendsGrid = ({ friends }) => {
  return (
    <section className="friends-grid">
      <div className="friends-grid__header">
        <h2>People you may know</h2>
        <button className="friends-grid__see-all" type="button">
          See all
        </button>
      </div>
      <div className="friends-grid__list">
        {friends.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
    </section>
  );
};

export default FriendsGrid;
