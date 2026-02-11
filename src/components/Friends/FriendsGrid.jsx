import React, { useContext } from 'react';
import FriendCard from './FriendCard';
import { LanguageContext } from '../../context/LanguageContext';

const FriendsGrid = ({ friends }) => {
  const { t } = useContext(LanguageContext);
  return (
    <section className="friends-grid">
      <div className="friends-grid__header">
        <h2>{t('People you may know')}</h2>
        <button className="friends-grid__see-all" type="button">
          {t('See all')}
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
