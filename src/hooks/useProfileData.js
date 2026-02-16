import { useEffect, useState } from 'react';
import { currentUser } from '../data/facebookData';

const STORAGE_KEY = 'gcs-profile';

const getStoredProfile = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

const useProfileData = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const handleStorage = () => setProfile(getStoredProfile());
    const handleCustom = () => setProfile(getStoredProfile());
    setProfile(getStoredProfile());
    window.addEventListener('storage', handleStorage);
    window.addEventListener('gcs-profile-updated', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('gcs-profile-updated', handleCustom);
    };
  }, []);

  return {
    name: profile?.name || currentUser.name,
    avatar: profile?.avatarUrl || currentUser.avatar,
  };
};

export default useProfileData;
