import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FounderCertificate = ({ founderName, activationDate, serialNumber }) => {
  const certRef = useRef();

  const handleDownload = async () => {
    const element = certRef.current;
    const canvas = await html2canvas(element, { backgroundColor: null, scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`FounderCertificate-${serialNumber}.pdf`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        ref={certRef}
        style={{
          width: 800,
          margin: '2rem auto',
          padding: 40,
          background: 'linear-gradient(135deg, #0A0A0A 80%, #1a1a1a 100%)',
          border: '10px double #D4AF37',
          borderRadius: 32,
          boxShadow: '0 0 48px #D4AF37, 0 0 0 12px #0A0A0A inset',
          color: '#FFD700',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
      {/* Gold-embossed Seal */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src="/crowned-hare.svg"
            alt="Crowned Hare & Rooster Seal"
            style={{ width: 120, filter: 'drop-shadow(0 0 24px #D4AF37)' }}
          />
        </div>
      {/* Title */}
        <h1 style={{ textAlign: 'center', color: '#FFD700', fontSize: 40, marginBottom: 8, letterSpacing: 2, textShadow: '0 0 12px #D4AF37' }}>
          Sovereign Founder's Certificate
        </h1>
        <h2 style={{ textAlign: 'center', color: '#00F5FF', fontSize: 26, marginBottom: 32, letterSpacing: 1 }}>
          House of Dorvilus / Digital Lakou
        </h2>
      {/* Certificate Body */}
        <p style={{ fontSize: 22, marginBottom: 32, textAlign: 'center', color: '#FFD700', lineHeight: 1.6 }}>
          This document certifies that <span style={{ color: '#00F5FF', fontWeight: 'bold', fontSize: 24 }}>{founderName}</span> has entered the Third Empire as a Sovereign Founder.<br />
          By committing <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>1,849 units of capital</span>, they have grounded their lineage in the restoration of Morn Chandelle and the expansion of the Digital Lakou.<br />
          They are hereby recognized as a <span style={{ color: '#00F5FF', fontWeight: 'bold' }}>Co-Architect of the House of Dorvilus</span>.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: 18 }}>
          <div>
            <strong>Founder Name:</strong> <span style={{ color: '#00F5FF' }}>{founderName}</span>
          </div>
          <div>
            <strong>Activation Date:</strong> <span style={{ color: '#FFD700' }}>{activationDate}</span>
          </div>
          <div>
            <strong>Serial No.:</strong> <span style={{ color: '#D4AF37' }}>{serialNumber}</span>
          </div>
        </div>
      {/* Watermark Key */}
        <img
          src="/sacred-antique-key.svg"
          alt="Sacred Antique Key Watermark"
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 100,
            opacity: 0.18,
            filter: 'drop-shadow(0 0 32px #00F5FF)',
            pointerEvents: 'none',
          }}
        />
      {/* Border filigree (optional, can be improved with SVG) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '10px double #D4AF37',
            borderRadius: 32,
            pointerEvents: 'none',
          }}
        />
      </div>
      <button
        onClick={handleDownload}
        style={{
          marginTop: 32,
          background: 'linear-gradient(90deg, #D4AF37 60%, #00F5FF 100%)',
          color: '#0A0A0A',
          fontWeight: 'bold',
          fontSize: 18,
          border: 'none',
          borderRadius: 8,
          padding: '12px 32px',
          boxShadow: '0 0 12px #D4AF37',
          cursor: 'pointer',
          letterSpacing: 1,
          transition: 'background 0.3s',
        }}
      >
        Download Certificate (PDF)
      </button>
    </div>
  );
};

export default FounderCertificate;
