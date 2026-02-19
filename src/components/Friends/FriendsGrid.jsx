import React, { useContext, useEffect, useState } from 'react';
import FriendCard from './FriendCard';
import { LanguageContext } from '../../context/LanguageContext';

const FriendsGrid = ({ friends }) => {
  const { t } = useContext(LanguageContext);
  const [visibleFriends, setVisibleFriends] = useState(friends);

  useEffect(() => {
    setVisibleFriends(friends);
  }, [friends]);

  const handleRemove = (id) => {
    setVisibleFriends((prev) => prev.filter((friend) => friend.id !== id));
  };
  return (
    <section className="friends-grid">
      <div className="friends-grid__header">
        <h2>{t('People you may know')}</h2>
        <button className="friends-grid__see-all" type="button">
          {t('See all')}
        </button>
      </div>
      <div className="friends-grid__list">
        {visibleFriends.map((friend) => (
          <FriendCard key={friend.id} friend={friend} onRemove={handleRemove} />
        ))}
      </div>
    </section>
  );
};

export default FriendsGrid;
