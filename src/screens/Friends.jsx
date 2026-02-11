import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Friends = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Friends Page')}</div>;
};
export default Friends;
