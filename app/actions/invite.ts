'use server'
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

export async function sendTeacherInvite(name: string, email: string, currName: string, subName: string, subId: string, appUrl: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY missing. Invite NOT sent for:", email);
    return { success: false, message: "Missing Resend API Key. Check .env" };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // 1. Check if user already exists
    let teacher = await prisma.teacher.findUnique({ where: { email } });
    if (teacher && teacher.isVerified) return { success: false, message: "Teacher is already active." };

    // 2. Generate a secure activation token
    const activationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // 3. Create or update the teacher in the database
    teacher = await prisma.teacher.upsert({
      where: { email },
      update: { name, subjectId: subId, otpCode: activationToken, otpExpires: expires, isVerified: false },
      create: { name, email, role: 'TEACHER', subjectId: subId, otpCode: activationToken, otpExpires: expires, isVerified: false }
    });

    // 4. Construct Activation Link
    const activateLink = `${appUrl}/activate?token=${activationToken}&email=${encodeURIComponent(email)}`;

    // 5. Send Professional Email
    await resend.emails.send({
      from: 'Knowly Team <contact@knowly.uz>',
      to: email,
      subject: 'You are invited to teach on Knowly',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Knowly – Educator Invitation</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: #f4f4f4;
      font-family: 'Inter', Arial, sans-serif;
      color: #1a1a1a;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      width: 100%;
      padding: 48px 16px;
      background-color: #f4f4f4;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 2px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }

    /* ── Header ── */
    .header {
      background-color: #c92826;
      padding: 36px 48px 32px;
      text-align: left;
    }

    .header-logo {
      display: block;
      height: 32px;
      width: auto;
    }

    .header-rule {
      margin-top: 24px;
      border: none;
      border-top: 1px solid rgba(255,255,255,0.2);
    }

    .header-label {
      margin-top: 18px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.65);
    }

    /* ── Body ── */
    .body {
      padding: 44px 48px 40px;
    }

    .salutation {
      font-size: 15px;
      font-weight: 500;
      color: #1a1a1a;
      margin-bottom: 20px;
    }

    .body p {
      font-size: 14.5px;
      line-height: 1.75;
      color: #3a3a3a;
      margin-bottom: 18px;
      font-weight: 300;
    }

    .highlight-box {
      margin: 28px 0;
      border-left: 3px solid #c92826;
      padding: 14px 20px;
      background-color: #fdf8f8;
    }

    .highlight-box p {
      margin-bottom: 0;
      font-size: 14px;
      color: #3a3a3a;
    }

    /* ── CTA Button ── */
    .cta-wrap {
      margin: 32px 0 28px;
      text-align: left;
    }

    .cta-btn {
      display: inline-block;
      background-color: #c92826;
      color: #ffffff;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.5px;
      padding: 13px 30px;
      border-radius: 2px;
    }

    /* ── Divider ── */
    .divider {
      border: none;
      border-top: 1px solid #ebebeb;
      margin: 32px 0;
    }

    /* ── Signature ── */
    .signature {
      font-size: 14px;
      line-height: 1.7;
      color: #3a3a3a;
      font-weight: 300;
    }

    .signature .name {
      font-weight: 600;
      color: #1a1a1a;
      font-size: 14.5px;
    }

    .signature .title {
      font-size: 12.5px;
      color: #888;
      letter-spacing: 0.2px;
    }

    .signature .brand {
      font-size: 12.5px;
      color: #c92826;
      font-weight: 500;
    }

    /* ── Footer ── */
    .footer {
      background-color: #f9f9f9;
      border-top: 1px solid #ebebeb;
      padding: 24px 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .footer-left {
      font-size: 11.5px;
      color: #aaa;
      line-height: 1.6;
    }

    .footer-left a {
      color: #c92826;
      text-decoration: none;
    }

    .footer-accent {
      width: 6px;
      height: 6px;
      background-color: #f5d439;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .header, .body { padding-left: 28px; padding-right: 28px; }
      .footer { flex-direction: column; gap: 12px; align-items: flex-start; padding: 20px 28px; }
    }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="container">

    <!-- Header -->
    <div class="header">
      <!-- Inline SVG logo (white version rendered from brand paths) -->
      <img src="${appUrl}/knowlylogo.png" alt="Knowly" style="height: 32px; width: auto; display: block;" />
      <hr class="header-rule" />
      <p class="header-label">Official Educator Invitation</p>
    </div>

    <!-- Body -->
    <div class="body">

      <p class="salutation">Dear ${name},</p>

      <p>
        You are hereby formally invited to join the Knowly team as an official
        <strong>Educator</strong> for <strong>${currName} — ${subName}</strong>.
      </p>

      <div class="highlight-box">
        <p>
          At Knowly, we are committed to providing high-quality and accessible learning
          experiences for every student. Your expertise and background make you a strong
          fit for contributing to that mission.
        </p>
      </div>

      <p>
        As an Educator on our platform, you will design and deliver structured lessons,
        offer guidance and support to students, and help make complex <strong>${subName}</strong>
        concepts clear and approachable.
      </p>

      <p>
        For a full overview of what Knowly offers, you are welcome to visit our website at
        <a href="https://www.knowly.uz" style="color:#c92826;text-decoration:none;font-weight:500;">www.knowly.uz</a>.
        An account activation link has been included with this invitation to help you get started.
      </p>

      <div class="cta-wrap">
        <a href="${activateLink}" class="cta-btn">Activate Your Account →</a>
      </div>

      <hr class="divider" />

      <div class="signature">
        <p>Yours sincerely,</p>
        <br />
        <p class="name">Ismatulloh Bakhtiyorov</p>
        <p class="title">Founder &amp; CEO</p>
        <p class="brand">Knowly</p>
      </div>

    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">
        &copy; 2025 Knowly &nbsp;·&nbsp;
        <a href="https://www.knowly.uz" style="color:#c92826; text-decoration: none !important; font-weight: 500;">www.knowly.uz</a><br/>
        This is an official communication from the Knowly team.
      </div>
      <div class="footer-accent"></div>
    </div>

  </div>
</div>
</body>
</html>

`
    });

    return { success: true, message: "Invitation sent successfully!" };
  } catch (error: any) {
    console.error("Invite error:", error);
    return { success: false, message: error.message || "Failed to send invite." };
  }
}
