import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const STORAGE_KEY = 'gcs-custom-lists';

const loadLists = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    return [];
  }
  return [];
};

const CustomListsPanel = () => {
  const { t } = useContext(LanguageContext);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const stored = loadLists();
    setLists(stored);
  }, []);

  return (
    <section className="friends-panel">
      <header className="friends-panel__header">
        <h1>{t('Custom lists')}</h1>
        <p>{t('Create lists to organize and filter your friends.')}</p>
      </header>

      <div className="friends-panel__card">
        <h2 className="friends-panel__title">{t('Your lists')}</h2>
        {lists.length === 0 ? (
          <div className="friends-panel__empty">{t('No custom lists yet')}</div>
        ) : (
          <div className="friends-panel__lists">
            {lists.map((list) => (
              <div key={list.id} className="friends-panel__list-item">
                <span>{list.name}</span>
                <span className="friends-panel__count">{list.memberIds.length}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomListsPanel;
