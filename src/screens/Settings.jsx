import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Settings = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Settings Page')}</div>;
};
export default Settings;
