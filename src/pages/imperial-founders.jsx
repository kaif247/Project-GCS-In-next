import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Founders.module.css";

const FoundersPage = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasAccess(window.localStorage.getItem("imperialFounderAccess") === "granted");
  }, []);

  useEffect(() => {
    if (!hasAccess) {
      setLoading(false);
      return;
    }

    const fetchFounders = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/imperial-founders");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load founders wall.");
        setFounders(Array.isArray(data.founders) ? data.founders : []);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load founders wall.");
      } finally {
        setLoading(false);
      }
    };

    fetchFounders();
  }, [hasAccess]);

  return (
    <>
      <Head>
        <title>House of Dorvilus | Imperial Founders</title>
        <meta name="description" content="High-tier Imperial Founders registry wall." />
        <link rel="icon" href="/crowned-hare.svg" />
      </Head>
      <main className={styles.page}>
        <header className={styles.header}>
          <h1>Imperial Founders Wall</h1>
          <p>Honoring verified founders who signed the sovereign contract.</p>
        </header>

        {!hasAccess && (
          <section className={styles.locked}>
            <h2>High-Tier Access Required</h2>
            <p>
              This page unlocks only after verified Sovereign Founder activation through
              an approved high-security gateway.
            </p>
            <Link href="/landing" className={styles.cta}>
              Return to Activation Portal
            </Link>
          </section>
        )}

        {hasAccess && loading && <p className={styles.state}>Loading founders wall...</p>}
        {hasAccess && error && <p className={styles.state}>{error}</p>}

        {hasAccess && !loading && !error && (
          <section className={styles.grid}>
            {founders.length === 0 && <p className={styles.state}>No founders recorded yet.</p>}
            {founders.map((founder) => (
              <article key={founder.id} className={styles.card}>
                <h3>{founder.name}</h3>
                <p>{founder.tier}</p>
                <p>Gateway: {founder.gateway}</p>
                <p>Activated: {new Date(founder.activatedAt).toLocaleString()}</p>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
};

export default FoundersPage;
