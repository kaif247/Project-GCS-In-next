import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Watch = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Watch Page')}</div>;
};
export default Watch;
