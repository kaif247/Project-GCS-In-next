import { useEffect, useState } from 'react';

const STORAGE_KEY = 'gcs-local-posts';

const loadPosts = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const stripHeavyMedia = (posts) =>
  posts.map((post) => {
    if ((post.images && post.images.length > 0) || post.video) {
      return {
        ...post,
        images: [],
        video: null,
        mediaUnavailable: true,
      };
    }
    return post;
  });

const broadcastPosts = (posts) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('gcs-local-posts-updated', { detail: { posts } })
  );
};

const savePosts = (posts) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    const trimmed = stripHeavyMedia(posts).slice(0, 20);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // If quota still exceeded, skip persistence.
    }
  }
  broadcastPosts(posts);
};

const useLocalPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const sync = (event) => {
      const detailPosts = event?.detail?.posts;
      if (detailPosts) {
        setPosts(detailPosts);
        return;
      }
      setPosts(loadPosts());
    };
    sync();
    window.addEventListener('gcs-local-posts-updated', sync);
    return () => window.removeEventListener('gcs-local-posts-updated', sync);
  }, []);

  const addPost = (post) => {
    const next = [post, ...posts];
    setPosts(next);
    savePosts(next);
  };

  const removePost = (postId) => {
    const next = posts.filter((post) => post.id !== postId);
    setPosts(next);
    savePosts(next);
  };

  return { posts, addPost, removePost };
};

export default useLocalPosts;
