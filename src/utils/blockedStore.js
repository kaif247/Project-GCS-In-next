const STORAGE_KEY = 'gcs-blocked-users';

export const loadBlockedUsers = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveBlockedUsers = (items) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('gcs-blocking-updated'));
};

export const addBlockedUser = (user) => {
  const current = loadBlockedUsers();
  const next = [...current.filter((entry) => entry.id !== user.id), user];
  saveBlockedUsers(next);
  return next;
};

export const removeBlockedUser = (userId) => {
  const current = loadBlockedUsers();
  const next = current.filter((entry) => entry.id !== userId);
  saveBlockedUsers(next);
  return next;
};
