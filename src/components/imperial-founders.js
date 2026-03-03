import React from "react";
import styles from "../styles/SovereignHome.module.css";

const founders = [
  // Replace with real backend or database fetch
  { name: "Marie Jean-Pierre", joined: "2026-02-24" },
  { name: "Alix Lafleur", joined: "2026-02-25" },
  // ...
];

export default function ImperialFoundersPage() {
  return (
    <main className={styles.foundersWall}>
      <h1>The Founders Wall</h1>
      <p>
        These visionaries have signed the High-Frequency Covenant and provided the Imperial Seed Equity that builds our future.<br/>
        <b>Status: Sovereign Founder</b>
      </p>
      <section>
        <ul className={styles.foundersList}>
          {founders.map((f, idx) => (
            <li key={idx}>
              <span className={styles.founderName}>{f.name}</span> –{" "}
              <span className={styles.founderDate}>Joined {f.joined}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}