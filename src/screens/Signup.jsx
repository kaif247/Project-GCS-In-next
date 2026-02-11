import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Signup = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Signup Page')}</div>;
};
export default Signup;
