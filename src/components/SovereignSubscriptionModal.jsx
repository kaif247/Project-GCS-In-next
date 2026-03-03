import React from "react";
import styles from "./SovereignSubscriptionModal.module.css";

export default function SovereignSubscriptionModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalWrap}>
        <button className={styles.closeBtn} onClick={onClose} title="Close">&times;</button>
        <h2>
          <span role="img" aria-label="crown">👑</span> Sovereign Subscription Model
        </h2>
        <p>
          Unlock full participation in the Digital Lakou! Move beyond the Citizen tier and activate exclusive paths—<b>Innovator</b>, <b>Architect</b>—with a monthly <b>Sovereign Contribution</b>.
        </p>
        <ul className={styles.subscriptionList}>
          <li>
            <b>Citizen:</b> Free entry. Access to the Digital Lakou and the basic Sovereign Sigil.
          </li>
          <li>
            <b>Innovator:</b> <span className={styles.paidTier}>Paid (Monthly)</span>. Early access to sovereign assets, digital regalia, and Registry certificate.
          </li>
          <li>
            <b>Architect:</b> <span className={styles.paidTier}>Paid (Monthly)</span>. Founders status and council seat.
          </li>
        </ul>
        <div className={styles.impactNote}>
          <b>Strategic Benefit:</b> Your Sovereign Subscription powers annual recurring revenue (ARR), the public market’s key growth metric. Every contribution fuels the national restoration through the Digital Lakou and is publicly recognized in DAIC’s 2026 guidance.
        </div>
        <button className={styles.payNowBtn} onClick={() => alert('Integrate payment here!')}>
          Pay Now & Activate
        </button>
      </div>
    </div>
  );
}