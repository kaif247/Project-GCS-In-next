import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Memories = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Memories Page')}</div>;
};
export default Memories;
