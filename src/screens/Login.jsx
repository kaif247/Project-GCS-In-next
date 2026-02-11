import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Login = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Login Page')}</div>;
};
export default Login;
