import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Groups = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Groups Page')}</div>;
};
export default Groups;
