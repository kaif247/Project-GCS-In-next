import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Saved = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Saved Posts Page')}</div>;
};
export default Saved;
