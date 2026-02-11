import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Marketplace = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Marketplace Page')}</div>;
};
export default Marketplace;
