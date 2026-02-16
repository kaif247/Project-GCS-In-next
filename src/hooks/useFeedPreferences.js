import { useEffect, useState } from 'react';

const STORAGE_KEY = 'gcs-feed-preferences';

const loadPrefs = () => {
  if (typeof window === 'undefined') {
    return {
      hiddenPosts: [],
      hiddenReasons: {},
      hiddenAuthors: [],
      snoozedAuthors: {},
      blockedAuthors: [],
      notifications: {},
      feedback: {},
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      hiddenPosts: parsed.hiddenPosts || [],
      hiddenReasons: parsed.hiddenReasons || {},
      hiddenAuthors: parsed.hiddenAuthors || [],
      snoozedAuthors: parsed.snoozedAuthors || {},
      blockedAuthors: parsed.blockedAuthors || [],
      notifications: parsed.notifications || {},
      feedback: parsed.feedback || {},
    };
  } catch {
    return {
      hiddenPosts: [],
      hiddenReasons: {},
      hiddenAuthors: [],
      snoozedAuthors: {},
      blockedAuthors: [],
      notifications: {},
      feedback: {},
    };
  }
};

const savePrefs = (prefs) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new Event('gcs-feed-updated'));
};

const useFeedPreferences = () => {
  const [prefs, setPrefs] = useState({
    hiddenPosts: [],
    hiddenReasons: {},
    hiddenAuthors: [],
    snoozedAuthors: {},
    blockedAuthors: [],
    notifications: {},
    feedback: {},
  });

  useEffect(() => {
    const sync = () => setPrefs(loadPrefs());
    sync();
    window.addEventListener('gcs-feed-updated', sync);
    return () => window.removeEventListener('gcs-feed-updated', sync);
  }, []);

  const update = (next) => {
    setPrefs(next);
    savePrefs(next);
  };

  const hidePost = (postId, reason = 'hide') =>
    update({
      ...prefs,
      hiddenPosts: [...new Set([...prefs.hiddenPosts, postId])],
      hiddenReasons: { ...prefs.hiddenReasons, [postId]: reason },
    });
  const unhidePost = (postId) =>
    update({
      ...prefs,
      hiddenPosts: prefs.hiddenPosts.filter((id) => id !== postId),
      hiddenReasons: Object.fromEntries(
        Object.entries(prefs.hiddenReasons).filter(([key]) => key !== String(postId))
      ),
    });

  const hideAuthor = (author) =>
    update({ ...prefs, hiddenAuthors: [...new Set([...prefs.hiddenAuthors, author])] });
  const unhideAuthor = (author) =>
    update({ ...prefs, hiddenAuthors: prefs.hiddenAuthors.filter((name) => name !== author) });

  const blockAuthor = (author) =>
    update({ ...prefs, blockedAuthors: [...new Set([...prefs.blockedAuthors, author])] });
  const unblockAuthor = (author) =>
    update({ ...prefs, blockedAuthors: prefs.blockedAuthors.filter((name) => name !== author) });

  const snoozeAuthor = (author) => {
    const until = Date.now() + 30 * 24 * 60 * 60 * 1000;
    update({ ...prefs, snoozedAuthors: { ...prefs.snoozedAuthors, [author]: until } });
  };
  const unsnoozeAuthor = (author) => {
    const next = { ...prefs.snoozedAuthors };
    delete next[author];
    update({ ...prefs, snoozedAuthors: next });
  };

  const toggleNotifications = (postId) =>
    update({
      ...prefs,
      notifications: { ...prefs.notifications, [postId]: !prefs.notifications[postId] },
    });

  const setFeedback = (postId, value) =>
    update({
      ...prefs,
      feedback: { ...prefs.feedback, [postId]: value },
    });

  return {
    prefs,
    hidePost,
    unhidePost,
    hideAuthor,
    unhideAuthor,
    blockAuthor,
    unblockAuthor,
    snoozeAuthor,
    unsnoozeAuthor,
    toggleNotifications,
    setFeedback,
  };
};

export default useFeedPreferences;
