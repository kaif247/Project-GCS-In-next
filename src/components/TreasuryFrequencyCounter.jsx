import React, { useState, useEffect } from 'react';
import styles from './TreasuryFrequencyCounter.module.css';

const TreasuryFrequencyCounter = () => {
  const [frequency, setFrequency] = useState(742);
  const [stability, setStability] = useState('High Stability');

  useEffect(() => {
    // Simulate live frequency updates
    const interval = setInterval(() => {
      const newFreq = Math.floor(Math.random() * (800 - 700) + 700);
      setFrequency(newFreq);

      if (newFreq >= 750) {
        setStability('High Stability');
      } else if (newFreq >= 720) {
        setStability('Stable');
      } else {
        setStability('Calibrating');
      }
    }, Math.random() * 2000 + 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.counter}>
      <div className={styles.frequencyDisplay}>
        <span className={styles.number}>{frequency}Hz</span>
        <span className={styles.stability}>{stability}</span>
      </div>
      <div className={styles.pulse} aria-hidden="true" />
    </div>
  );
};

export default TreasuryFrequencyCounter;