import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const PlaceholderPage = ({ title }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div style={{ padding: 24 }}>
      <h1>{t(title)}</h1>
      <p>{t('Content coming soon.')}</p>
    </div>
  );
};

export default PlaceholderPage;
