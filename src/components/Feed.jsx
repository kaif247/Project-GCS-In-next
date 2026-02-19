import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { posts, currentUser, friendSuggestions } from '../data/facebookData';
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
  const suggestionsScrollRef = useRef(null);

  const suggestionList = useMemo(() => {
    const items = [];
    while (items.length < 10) {
      items.push(...friendSuggestions);
    }
    return items.slice(0, 10).map((item, idx) => ({
      ...item,
      id: `${item.id}-${idx}`,
      isRequestSent: false,
    }));
  }, []);
  const [visibleSuggestions, setVisibleSuggestions] = useState(suggestionList);

  const scrollSuggestions = (direction) => {
    if (!suggestionsScrollRef.current) return;
    const amount = direction === 'left' ? -280 : 280;
    suggestionsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

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
          {filteredPosts.map((post, index) =>
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
                <React.Fragment key={post.id}>
                  <Post
                    post={post}
                    canDelete={String(post.id).startsWith('local-')}
                    onDelete={removePost}
                  />
                  {index === 1 && (
                    <section className="feed-suggestions">
                      <div className="feed-suggestions__header">
                        <div>
                          <div className="feed-suggestions__title">People you may know</div>
                          <div className="feed-suggestions__subtitle">Suggestions based on mutuals</div>
                        </div>
                        <button
                          type="button"
                          className="feed-suggestions__more"
                          onClick={() => router.push('/friends/suggestions')}
                        >
                          See all
                        </button>
                      </div>
                      <div className="feed-suggestions__body">
                        <button
                          type="button"
                          className="feed-suggestions__nav feed-suggestions__nav--left"
                          aria-label="Scroll suggestions left"
                          onClick={() => scrollSuggestions('left')}
                        >
                          &#8249;
                        </button>
                        <div className="feed-suggestions__list" ref={suggestionsScrollRef}>
                          {visibleSuggestions.map((suggestion) => (
                            <div key={suggestion.id} className="feed-suggestions__card">
                              <button
                                type="button"
                                className="feed-suggestions__remove"
                                aria-label="Remove"
                                onClick={() =>
                                  setVisibleSuggestions((prev) =>
                                    prev.filter((item) => item.id !== suggestion.id)
                                  )
                                }
                              >
                                &times;
                              </button>
                              <img src={suggestion.avatar} alt={suggestion.name} />
                              <div className="feed-suggestions__name">{suggestion.name}</div>
                              <div className="feed-suggestions__mutuals">
                                {suggestion.mutualFriends} mutual friends
                              </div>
                              <button
                                type="button"
                                className="feed-suggestions__cta"
                                onClick={() =>
                                  setVisibleSuggestions((prev) =>
                                    prev.map((item) =>
                                      item.id === suggestion.id
                                        ? { ...item, isRequestSent: !item.isRequestSent }
                                        : item
                                    )
                                  )
                                }
                              >
                                {suggestion.isRequestSent ? 'Cancel request' : 'Add friend'}
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="feed-suggestions__nav feed-suggestions__nav--right"
                          aria-label="Scroll suggestions right"
                          onClick={() => scrollSuggestions('right')}
                        >
                          &#8250;
                        </button>
                      </div>
                    </section>
                  )}
                </React.Fragment>
              )
            )}
        </div>

      </div>
    </div>
  );
};

export default Feed;
