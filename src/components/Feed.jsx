import React from 'react';
import { useRouter } from 'next/router';
import { posts } from '../data/facebookData';
import Stories from './Stories';
import PostInput from './PostInput';
import Post from './Post';

const Feed = () => {
  const router = useRouter();
  return (
    <div className="feed-container">
      <div className="feed-content">
        {/* Post Input */}
        <PostInput
          username="Kaif"
          avatarUrl="https://i.pravatar.cc/150?img=1"
          onVideoClick={() => router.push('/live')}
          onPhotoClick={() => {}}
          onEmojiClick={() => {}}
        />

        {/* Stories Section */}
        <Stories />

        {/* Posts Feed */}
        <div className="posts-list">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Feed;
