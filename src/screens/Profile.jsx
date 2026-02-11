import React from 'react';
import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Profile = () => {
  const { t } = useContext(LanguageContext);
  return <div>{t('Profile Page')}</div>;
};
export default Profile;
