import React, { useEffect, useState } from "react";
import styles from "./FounderActivationAnimation.module.css";

export default function FounderActivationAnimation({ show, onComplete }) {
  if (!show) return null;
  return <FounderActivationSequence onComplete={onComplete} />;
}

function FounderActivationSequence({ onComplete }) {
  const [phase, setPhase] = useState("black"); // "black" | "key"

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("key"), 3000);
    const t2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div className={styles.overlay}>
      {phase === "black" ? (
        <div className={styles.sovereignBlack} />
      ) : (
        <div className={styles.keyWrap}>
          <img
            src="/Sacred Antique Key.svg"
            alt="Sacred Antique Key Turning"
            className={styles.keyAnim}
          />
          <div className={styles.activatedText}>
            Founder Status Activated
          </div>
        </div>
      )}
    </div>
  );
}
