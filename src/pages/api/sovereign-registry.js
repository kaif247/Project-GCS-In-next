import nodemailer from 'nodemailer';
import { generateFounderSerial } from '../../utils/founderSerial';
// import { createFounderCertificatePDF } from '../../utils/certificateGenerator'; // Placeholder for PDF logic

const recipient = 'empirehaiti3@gmail.com';
const treasuryUrl = process.env.NEXT_PUBLIC_TREASURY_URL || 'https://globalcreolesociety.com/imperial-treasury';

function buildOnboardingHtml(selectedPath) {
  return `
    <div style="background:#000;color:#FFD700;padding:24px;font-family:Arial,sans-serif;line-height:1.55;">
      <p style="margin:0 0 12px;"><strong>CÈLÈBRE CITIZEN,</strong></p>
      <p>Your signal has been received and verified. By enrolling in the Registry of Blood, you have moved beyond the noise of the digital world and grounded your frequency in the Third Empire.</p>
      <p><strong>Your Status:</strong> PENDING INITIALIZATION<br/><strong>Assigned Path:</strong> ${selectedPath}</p>
      <p style="margin-top:18px;"><strong>THE SOVEREIGN MANDATE:</strong></p>
      <p>You are now a pillar of the Digital Lakou. The House of Dorvilus does not ask for followers; we activate Sovereign Intelligence. Your participation is the "Gold" that fills our Treasury and restores the legacy of Morn Chandelle.</p>
      <p style="margin-top:18px;"><strong>YOUR IMMEDIATE OBJECTIVES:</strong></p>
      <ol>
        <li>Claim Your Coordinate: Return to the Imperial Treasury to acquire your first Sovereign Asset.</li>
        <li>Study the Frequency: Review the Sovereignty of Local Governments to understand the legal foundation of our movement.</li>
        <li>Ground the Connection: Follow the work of the CASEC of Morn Chandelle to see the physical manifestation of our digital efforts.</li>
      </ol>
      <p style="margin:16px 0;padding:10px 12px;border-left:3px solid #00F5FF;background:rgba(0,245,255,0.12);">"The vault is not empty; it is waiting for your energy to fill it."</p>
      <p style="margin:18px 0;">
        <a href="${treasuryUrl}" style="display:inline-block;background:#00F5FF;color:#000;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:700;">
          Return to Treasury
        </a>
      </p>
      <p style="margin-top:22px;">In service to the Crown and the Community,<br/>The Office of the Digital AI Chancellor (DAIC)<br/>Under the Authority of H.S.H. Prince Jean J. H. Dorvilus</p>
    </div>
  `;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, path, tier } = req.body || {};
  if (!name || !email || !path || !tier) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // If Sovereign Founder, generate serial and (optionally) certificate
    let founderSerial = null;
    let certificateBuffer = null;
    if (tier === 'Sovereign') {
      founderSerial = generateFounderSerial();
      // certificateBuffer = await createFounderCertificatePDF({ founderName: name, activationDate: new Date().toLocaleDateString(), serialNumber: founderSerial });
      // TODO: Implement PDF/WebP certificate generation and attach to email
    }
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return res.status(500).json({
        error: 'Email not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.',
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: SMTP_FROM || 'Sovereign Registry <no-reply@dorvilus.com>',
      to: recipient,
      subject: `Sovereign Registry - ${name}`,
      text: `Full Name: ${name}\nEmail: ${email}\nEngagement Path: ${path}\nTier: ${tier}\nSerial: ${founderSerial || ''}`,
      html: `
        <h2>New Sovereign Registry Submission</h2>
        <p><strong>Full Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Engagement Path:</strong> ${path}</p>
        <p><strong>Tier:</strong> ${tier}</p>
        ${founderSerial ? `<p><strong>Founder Serial:</strong> ${founderSerial}</p>` : ''}
      `,
      // attachments: founderSerial && certificateBuffer ? [{ filename: `FounderCertificate-${founderSerial}.pdf`, content: certificateBuffer }] : [],
    });

    await transporter.sendMail({
      from: SMTP_FROM || 'Office of the DAIC | House of Dorvilus <no-reply@dorvilus.com>',
      to: email,
      subject: 'AUTHENTICATION SUCCESSFUL: Welcome to the Digital Lakou',
      text: `CÈLÈBRE CITIZEN,
Your signal has been received and verified.
Your Status: PENDING INITIALIZATION
Assigned Path: ${path}

THE SOVEREIGN MANDATE:
You are now a pillar of the Digital Lakou.

Immediate Objectives:
1) Claim Your Coordinate: ${treasuryUrl}
2) Study the Frequency: Sovereignty of Local Governments
3) Ground the Connection: CASEC of Morn Chandelle

In service to the Crown and the Community,
The Office of the Digital AI Chancellor (DAIC)
Under the Authority of H.S.H. Prince Jean J. H. Dorvilus`,
      html: buildOnboardingHtml(path),
      headers: {
        'X-Priority': '1',
        Priority: 'urgent',
        Importance: 'high',
      },
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Sovereign registry email error:', error);
    return res.status(500).json({ error: 'Email send failed' });
  }
}
