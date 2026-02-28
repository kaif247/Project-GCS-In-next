import FounderCertificate from '../components/FounderCertificate';

// Utility to generate a unique serial number for Founders
export function generateFounderSerial(date = new Date()) {
  // Example: HD-2026-0001
  const year = date.getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `HD-${year}-${rand}`;
}

<FounderCertificate
  founderName="Your Name"
  activationDate="2026-02-25"
  serialNumber="HD-2026-1234"
/>
