import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaRegThumbsUp, FaRegCommentDots, FaShare, FaPlay, FaVolumeUp } from 'react-icons/fa';
import styles from './Reels.module.css';

const dummyReels = [
  {
    id: 1,
    user: 'Kaif Islam',
    avatar: 'https://i.pravatar.cc/150?img=1',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    caption: 'Enjoying the moment! #reels',
    music: 'Original Audio',
    likes: 1200,
    comments: 98,
    shares: 12,
  },
  {
    id: 2,
    user: 'Fatima Khan',
    avatar: 'https://i.pravatar.cc/150?img=2',
    video: 'https://www.w3schools.com/html/movie.mp4',
    caption: 'Nature is beautiful 🌿',
    music: 'Nature Sounds',
    likes: 900,
    comments: 45,
    shares: 7,
  },
];


const Reels = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!router.isReady) return;
    const raw = Array.isArray(router.query.start)
      ? router.query.start[0]
      : router.query.start;
    const idx = parseInt(raw || '0', 10);
    const safeIdx = isNaN(idx) ? 0 : Math.max(0, Math.min(idx, dummyReels.length - 1));
    setCurrent(safeIdx);
  }, [router.isReady, router.query.start]);
  const reel = dummyReels[current];

  const nextReel = () => setCurrent((c) => (c + 1) % dummyReels.length);
  const prevReel = () => setCurrent((c) => (c - 1 + dummyReels.length) % dummyReels.length);

  return (
    <div className={styles.reelsContainer}>
      <video className={styles.video} src={reel.video} controls autoPlay loop muted />
      <div className={styles.overlay}>
        <div className={styles.userInfo}>
          <img src={reel.avatar} alt={reel.user} className={styles.avatar} />
          <span className={styles.user}>{reel.user}</span>
        </div>
        <div className={styles.caption}>{reel.caption}</div>
        <div className={styles.music}><FaPlay /> {reel.music}</div>
        <div className={styles.actions}>
          <button className={styles.actionBtn}><FaRegThumbsUp /> {reel.likes}</button>
          <button className={styles.actionBtn}><FaRegCommentDots /> {reel.comments}</button>
          <button className={styles.actionBtn}><FaShare /> {reel.shares}</button>
        </div>
        <div className={styles.navBtns}>
          <button onClick={prevReel} aria-label="Previous Reel">↑</button>
          <button onClick={nextReel} aria-label="Next Reel">↓</button>
        </div>
        <button className={styles.volumeBtn}><FaVolumeUp /></button>
      </div>
    </div>
  );
};

export default Reels;
