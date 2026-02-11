import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Notifications = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Notifications Page')}</div>;
};
export default Notifications;
