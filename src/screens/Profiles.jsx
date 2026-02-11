import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Profiles = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div style={{ padding: 24 }}>
      <h1>{t('Profiles')}</h1>
      <p>{t('All profiles will appear here.')}</p>
    </div>
  );
};

export default Profiles;
