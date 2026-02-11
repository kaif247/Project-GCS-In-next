import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Events = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Events Page')}</div>;
};
export default Events;
