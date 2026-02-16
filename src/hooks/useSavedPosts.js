import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'gcs-saved-posts';

const loadSaved = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const useSavedPosts = () => {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    setSaved(loadSaved());
    const handleSync = () => setSaved(loadSaved());
    window.addEventListener('gcs-saved-updated', handleSync);
    return () => window.removeEventListener('gcs-saved-updated', handleSync);
  }, []);

  const saveAll = (next) => {
    setSaved(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('gcs-saved-updated'));
    }
  };

  const isSaved = useMemo(
    () => (id) => saved.some((item) => item.id === id),
    [saved]
  );

  const toggleSave = (post) => {
    if (!post) return;
    const exists = saved.find((item) => item.id === post.id);
    if (exists) {
      saveAll(saved.filter((item) => item.id !== post.id));
    } else {
      saveAll([{ ...post, savedAt: Date.now() }, ...saved]);
    }
  };

  return { saved, isSaved, toggleSave };
};

export default useSavedPosts;
