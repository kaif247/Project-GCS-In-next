import React, { useState, useContext } from 'react';
import SuggestionCard from './SuggestionCard';
import styles from './friendsSuggestions.module.css';
import { LanguageContext } from '../../context/LanguageContext';

const SuggestionsSidebar = ({ suggestions, selectedId, onSelect, onRemove, onToggleRequest }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useContext(LanguageContext);

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <div>
          <div className={styles.heading}>{t('Friends')}</div>
          <div className={styles.subheading}>{t('Suggestions')}</div>
          <div className={styles.label}>{t('People you may know')}</div>
        </div>
        <button
          className={styles.collapseBtn}
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={t('Toggle sidebar')}
        >
          {isCollapsed ? '›' : '‹'}
        </button>
      </div>

      <div className={styles.suggestionsList} role="list">
        {suggestions.map((item) => (
          <SuggestionCard
            key={item.id}
            suggestion={item}
            isSelected={item.id === selectedId}
            onClick={() => onSelect(item.id)}
            onRemove={() => onRemove(item.id)}
            onToggleRequest={() => onToggleRequest(item.id)}
          />
        ))}
      </div>
    </aside>
  );
};

export default React.memo(SuggestionsSidebar);
