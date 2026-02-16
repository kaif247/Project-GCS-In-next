import React, { useMemo } from 'react';
import Link from 'next/link';
import { currentUser, posts as feedPosts } from '../data/facebookData';
import useProfileData from '../hooks/useProfileData';
import useLocalPosts from '../hooks/useLocalPosts';
import Post from '../components/Post';

const ProfilePosts = () => {
  const profile = useProfileData();
  const { posts: localPosts, removePost } = useLocalPosts();

  const myPosts = useMemo(() => {
    const combined = [...localPosts, ...feedPosts].filter((post) => post.userId === currentUser.id);
    return combined.map((post) => ({
      ...post,
      userName: profile.name,
      userAvatar: profile.avatar,
    }));
  }, [localPosts, profile]);

  return (
    <div className="profile-posts-page">
      <div className="profile-posts-header">
        <Link href="/profile" className="profile-posts-back">
          Back to profile
        </Link>
        <h1>My Posts</h1>
      </div>
      <div className="posts-list">
        {myPosts.length ? (
          myPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              canDelete={String(post.id).startsWith('local-')}
              onDelete={removePost}
            />
          ))
        ) : (
          <div className="profile-posts-empty">No posts yet.</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePosts;
