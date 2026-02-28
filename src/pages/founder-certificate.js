import { useRouter } from 'next/router';
import FounderCertificate from '../components/FounderCertificate';

const FounderCertificatePage = () => {
  const router = useRouter();
  const { founderName, activationDate, serialNumber } = router.query;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', padding: '2rem 0' }}>
      <FounderCertificate
        founderName={founderName || 'Founder'}
        activationDate={activationDate || new Date().toLocaleDateString()}
        serialNumber={serialNumber || 'HD-2026-0000'}
      />
    </div>
  );
};

export default FounderCertificatePage;
