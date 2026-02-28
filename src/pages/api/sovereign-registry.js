import nodemailer from 'nodemailer';
import { generateFounderSerial } from '../../utils/founderSerial';
// import { createFounderCertificatePDF } from '../../utils/certificateGenerator'; // Placeholder for PDF logic

const recipient = 'empirehaiti3@gmail.com';

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

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Sovereign registry email error:', error);
    return res.status(500).json({ error: 'Email send failed' });
  }
}
