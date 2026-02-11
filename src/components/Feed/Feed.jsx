
import React from 'react';
import Post from '../Post/Post';
import StoriesSection from './StoriesSection';
import ReelsSection from './ReelsSection';
import styles from './Feed.module.css';
import { posts } from '../../data/facebookData';


const Feed = () => {
  return (
    <section className={styles.feed}>
      <StoriesSection />
      <ReelsSection />
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </section>
  );
};

export default Feed;
