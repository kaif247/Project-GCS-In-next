import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const ForgotPassword = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Forgot Password Page')}</div>;
};
export default ForgotPassword;
