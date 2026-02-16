import { useEffect, useMemo, useState } from 'react';
import { stories as baseStories } from '../data/facebookData';

const STORAGE_KEY = 'gcs-stories';
const STORY_LIFETIME_MS = 24 * 60 * 60 * 1000;

const loadStories = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    return parsed.filter((story) => !story.expiresAt || story.expiresAt > now);
  } catch {
    return [];
  }
};

const stripHeavyMedia = (items) =>
  items.map((story) => ({
    ...story,
    image: null,
    video: null,
    mediaUnavailable: true,
  }));

const saveStories = (stories) => {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  const cleaned = stories.filter((story) => !story.expiresAt || story.expiresAt > now);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch (error) {
    const trimmed = stripHeavyMedia(cleaned).slice(0, 20);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // If quota still exceeded, skip persistence.
    }
  } finally {
    window.dispatchEvent(new Event('gcs-stories-updated'));
  }
};

const useStories = () => {
  const [localStories, setLocalStories] = useState([]);

  useEffect(() => {
    const sync = () => setLocalStories(loadStories());
    sync();
    window.addEventListener('gcs-stories-updated', sync);
    return () => window.removeEventListener('gcs-stories-updated', sync);
  }, []);

  const addStory = (story) => {
    const withMeta = {
      ...story,
      id: story.id || `story-${Date.now()}`,
      createdAt: Date.now(),
      expiresAt: Date.now() + STORY_LIFETIME_MS,
    };
    const next = [withMeta, ...localStories];
    setLocalStories(next);
    saveStories(next);
  };

  const removeStory = (storyId) => {
    setLocalStories((prev) => {
      const next = prev.filter((story) => String(story.id) !== String(storyId));
      saveStories(next);
      return next;
    });
  };

  const mergedStories = useMemo(() => {
    const base = baseStories
      .filter((story) => story.type !== 'create')
      .map((story) => ({ ...story, id: `base-${story.id}` }));
    return [...localStories, ...base];
  }, [localStories]);

  return { stories: mergedStories, addStory, removeStory };
};

export default useStories;
