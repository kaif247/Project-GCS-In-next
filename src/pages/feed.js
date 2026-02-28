import React from 'react';
import Head from 'next/head';
// ...existing imports...

// Palette variables
const palette = {
  sovereignBlack: '#0A0A0A',
  soulouqueGold: '#D4AF37',
  electricBlue: '#00F5FF',
  bloodlineCrimson: '#B22222',
};

const trinity = [
  {
    name: 'H.S.H. Prince Jean II',
    title: 'Sovereign Architect',
    image: '/H.S.H. Prince Jean II.svg',
  },
  {
    name: 'H.I.H. Prince Thierry',
    title: 'Imperial Steward',
    image: '/H.I.H. Prince Thierry.svg',
  },
  {
    name: 'Cousin Wilson Joseph',
    title: 'Local Foundation',
    image: '/Cousin Wilson Joseph.svg',
  },
];

const FeedPage = () => {
  return (
    <div style={{ background: palette.sovereignBlack, color: palette.soulouqueGold }}>
      <Head>
        <title>House of Dorvilus | Sovereign Intelligence & Imperial Restoration</title>
        <meta name="description" content="Official gateway of the House of Dorvilus. Restoring the Soulouque Legacy through the Digital Lakou and Sovereign Intelligence." />
        <meta property="og:image" content="/imperial-seal.svg" />
      </Head>
      {/* Sticky Sovereign Hero Section */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: palette.sovereignBlack, padding: '2rem 0', boxShadow: `0 0 15px ${palette.electricBlue}` }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          {trinity.map((member) => (
            <div key={member.name} style={{ textAlign: 'center' }}>
              <img src={member.image} alt={member.name} style={{ width: 120, borderRadius: '50%', boxShadow: `0 0 10px ${palette.soulouqueGold}` }} />
              <div style={{ color: palette.electricBlue, fontWeight: 'bold', marginTop: 8 }}>{member.title}</div>
              <div style={{ color: palette.soulouqueGold }}>{member.name}</div>
            </div>
          ))}
        </div>
      </header>
      {/* Divider */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${palette.soulouqueGold}, transparent)`, margin: '40px 0', boxShadow: `0 0 10px ${palette.electricBlue}` }} />
      {/* Registry of Blood & Treasury Progress Bar */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 0' }}>
        <h2 style={{ color: palette.electricBlue }}>Registry of Blood</h2>
        {/* TODO: Insert Registry form component here */}
        <div style={{ margin: '2rem 0' }}>
          <div style={{ width: '100%', height: 50, background: palette.sovereignBlack, border: `1px solid ${palette.soulouqueGold}` }}>
            <div style={{ width: '33%', height: '100%', background: `linear-gradient(90deg, ${palette.soulouqueGold}, ${palette.electricBlue})`, transition: 'width 2s ease-in-out' }}>
              <span style={{ color: '#fff', paddingLeft: 10, fontFamily: 'Serif' }}>TREASURY FREQUENCY: 33% ACTIVATED</span>
            </div>
          </div>
        </div>
      </section>
      {/* Feeds and Stories Section */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 0' }}>
        <h2 style={{ color: palette.soulouqueGold }}>Digital Lakou Feed</h2>
        {/* TODO: Insert Feed and Stories components here */}
      </section>
      {/* Footer with Electric Blue pulse on Dorvilus hover */}
      <footer style={{ background: palette.sovereignBlack, color: palette.soulouqueGold, padding: '2rem 0', textAlign: 'center' }}>
        <span style={{ cursor: 'pointer', color: palette.soulouqueGold }}
          onMouseEnter={e => e.target.style.color = palette.electricBlue}
          onMouseLeave={e => e.target.style.color = palette.soulouqueGold}
        >Dorvilus</span>
        <div style={{ marginTop: 8 }}>
          <a href="https://globalcreolesociety.com" style={{ color: palette.electricBlue }}>globalcreolesociety.com</a>
        </div>
        <div style={{ marginTop: 8, color: palette.soulouqueGold }}>
          Administered under the local oversight of the CASEC of Morn Chandelle, Gressier.
        </div>
        <div style={{ marginTop: 8, fontSize: '0.9em', color: '#fff' }}>
          [Financial and legal disclaimer: This analysis is for informational purposes only and does not constitute financial, legal, or professional advice. Participation in the Registry is a voluntary contribution to a social movement.]
        </div>
      </footer>
    </div>
  );
};

export default FeedPage;
