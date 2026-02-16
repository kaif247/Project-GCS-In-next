import nodemailer from 'nodemailer';

const recipient = 'empirehaiti3@gmail.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, path } = req.body || {};
  if (!name || !email || !path) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Sovereign Registry <no-reply@dorvilus.com>',
      to: recipient,
      subject: `New Sovereign Registry - ${name}`,
      text: `Full Name: ${name}\nEmail: ${email}\nEngagement Path: ${path}`,
      html: `
        <h2>New Sovereign Registry Submission</h2>
        <p><strong>Full Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Engagement Path:</strong> ${path}</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Email send failed' });
  }
}
