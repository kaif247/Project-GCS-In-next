import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { posts, currentUser } from '../data/facebookData';
import Stories from './Stories';
import PostInput from './PostInput';
import Post from './Post';
import useProfileData from '../hooks/useProfileData';
import useFeedPreferences from '../hooks/useFeedPreferences';
import useLocalPosts from '../hooks/useLocalPosts';

const Feed = () => {
  const router = useRouter();
  const profile = useProfileData();
  const { prefs, unhidePost } = useFeedPreferences();
  const { posts: localPosts, addPost, removePost } = useLocalPosts();

  const resolvedPosts = useMemo(() => {
    const combined = [...localPosts, ...posts];
    return combined.map((post) =>
      post.userId === currentUser.id
        ? {
            ...post,
            userName: profile.name,
            userAvatar: profile.avatar,
          }
        : post
    );
  }, [profile, localPosts]);

  const filteredPosts = useMemo(() => {
    const now = Date.now();
    return resolvedPosts.filter((post) => {
      if (prefs.hiddenAuthors.includes(post.userName)) return false;
      if (prefs.blockedAuthors.includes(post.userName)) return false;
      const snoozeUntil = prefs.snoozedAuthors[post.userName];
      if (snoozeUntil && snoozeUntil > now) return false;
      return true;
    });
  }, [resolvedPosts, prefs]);
  return (
    <div className="feed-container">
      <div className="feed-content">
        {/* Post Input */}
        <PostInput
          username={profile.name}
          avatarUrl={profile.avatar}
          onVideoClick={() => router.push('/live')}
          onPhotoClick={() => {}}
          onEmojiClick={() => {}}
          onCreatePost={(payload) => {
              const newPost = {
                id: `local-${Date.now()}`,
                isLocal: true,
                userId: currentUser.id,
                userName: profile.name,
                userAvatar: profile.avatar,
                content: payload.content || '',
                hashtags: payload.tags || [],
              images: payload.images || [],
              video: payload.video || null,
              textBackground: payload.textBackground || null,
              textColor: payload.textColor || null,
              reactions: {},
              comments: 0,
              shares: 0,
              location: 'Home',
              timestamp: 'Just now',
            };
            addPost(newPost);
          }}
        />

        {/* Stories Section */}
        <Stories />

        {/* Posts Feed */}
        <div className="posts-list">
          {filteredPosts.map((post) =>
            prefs.hiddenPosts.includes(post.id) ? (
              <div key={post.id} className="post-hidden-banner">
                <div>
                  <strong>Hidden</strong>
                  <span>
                    {prefs.hiddenReasons?.[post.id] === 'not_interested'
                      ? 'We will show you fewer posts like this.'
                      : 'Hiding posts helps GCS personalize your Feed.'}
                  </span>
                </div>
                <button type="button" onClick={() => unhidePost(post.id)}>
                  Undo
                </button>
              </div>
            ) : (
                <Post
                  key={post.id}
                  post={post}
                  canDelete={String(post.id).startsWith('local-')}
                  onDelete={removePost}
                />
              )
            )}
        </div>

      </div>
    </div>
  );
};

export default Feed;
