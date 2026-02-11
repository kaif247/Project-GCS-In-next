import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { MdReels } from 'react-icons/md';
import styles from './ReelsSection.module.css';
import { LanguageContext } from '../../context/LanguageContext';

const reelsPreview = [
  {
    id: 1,
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400',
    user: 'Kaif Islam',
  },
  {
    id: 2,
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400',
    user: 'Fatima Khan',
  },
];

const ReelsSection = () => {
  const router = useRouter();
  const { t } = useContext(LanguageContext);
  return (
    <div className={styles.reelsSection}>
      <button className={styles.reelsEntry} onClick={() => router.push('/reels')} aria-label={t('View Reels')}>
        <MdReels className={styles.reelsIcon} />
        <span>{t('Reels')}</span>
      </button>
      <div className={styles.reelsPreviewList}>
        {reelsPreview.map((reel, idx) => (
          <div
            key={reel.id}
            className={styles.reelPreview}
            onClick={() => router.push(`/reels?start=${idx}`)}
            tabIndex={0}
            role="button"
            aria-label={t('Watch reel by {name}', { name: reel.user })}
          >
            <img src={reel.thumbnail} alt={reel.user} className={styles.thumbnail} />
            <span className={styles.user}>{reel.user}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsSection;
