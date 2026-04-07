'use server'
import prisma from '@/lib/prisma';

export async function submitApplication(data: { fullName: string, email: string, phone: string, subject: string, experience: string }) {
  try {
    const existing = await prisma.application.findUnique({ where: { email: data.email } });
    if (existing) return { success: false, message: "An application with this email already exists." };

    await prisma.application.create({ data });
    return { success: true, message: "Application submitted successfully!" };
  } catch (error) {
    console.error("Application error:", error);
    return { success: false, message: "Failed to submit application." };
  }
}

export async function getPendingApplications() {
  try {
    const apps = await prisma.application.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: apps };
  } catch (error) {
    return { success: false, data: [] };
  }
}

import { Resend } from 'resend';

export async function resolveApplication(id: string, email: string, name: string, subject: string, status: 'APPROVED' | 'REJECTED', appUrl: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await prisma.application.update({ where: { id }, data: { status } });

    if (status === 'APPROVED') {
      // 1. Generate Token
      const activationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
      
      // 2. We need to find the subject ID based on the string name from the form (Fuzzy match)
      const subRecord = await prisma.subject.findFirst({ where: { name: { contains: subject, mode: 'insensitive' } } });

      // 3. Create Teacher
      await prisma.teacher.upsert({
        where: { email },
        update: { otpCode: activationToken, otpExpires: expires, isVerified: false },
        create: { name, email, role: 'TEACHER', subjectId: subRecord?.id, otpCode: activationToken, otpExpires: expires, isVerified: false, password: '' }
      });

      // 4. Send Welcome/Activation Email
      const activateLink = `${appUrl}/activate?token=${activationToken}&email=${encodeURIComponent(email)}`;
      await resend.emails.send({
        from: 'Knowly Team <contact@knowly.uz>',
        to: email,
        subject: 'Welcome to Knowly! Activate your Educator Account',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Knowly – Welcome, Educator!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #f4f4f4; font-family: 'Inter', Arial, sans-serif; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; padding: 48px 16px; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .header { background-color: #1b5e3b; padding: 36px 48px 32px; }
    .header-logo { display: block; height: 28px; width: auto; }
    .header-rule { margin-top: 22px; border: none; border-top: 1px solid rgba(255,255,255,0.2); }
    .header-label { margin-top: 16px; font-size: 10.5px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.6); }
    .body { padding: 40px 48px 36px; }
    .salutation { font-size: 15px; font-weight: 500; color: #1a1a1a; margin-bottom: 20px; }
    .body p { font-size: 14px; line-height: 1.78; color: #3a3a3a; margin-bottom: 16px; font-weight: 300; }
    .body p strong { font-weight: 600; color: #1a1a1a; }
    .highlight-box { margin: 24px 0; border-left: 3px solid #1b5e3b; padding: 13px 18px; background: #f4faf7; }
    .highlight-box p { margin: 0; font-size: 13.5px; }
    .role-list { margin: 20px 0; padding: 0; list-style: none; }
    .role-list li { font-size: 13.5px; font-weight: 300; color: #3a3a3a; padding: 10px 0; border-bottom: 1px solid #ebebeb; display: flex; align-items: flex-start; gap: 10px; line-height: 1.6; }
    .role-list li:last-child { border-bottom: none; }
    .role-list li::before { content: ''; display: block; width: 6px; height: 6px; border-radius: 50%; background: #f5d439; flex-shrink: 0; margin-top: 6px; }
    .cta-wrap { margin: 28px 0 24px; }
    .cta-btn { display: inline-block; background: #1b5e3b; color: #fff; text-decoration: none; font-size: 12.5px; font-weight: 500; letter-spacing: 0.5px; padding: 12px 28px; border-radius: 2px; }
    .divider { border: none; border-top: 1px solid #ebebeb; margin: 28px 0; }
    .signature { font-size: 14px; line-height: 1.7; color: #3a3a3a; font-weight: 300; }
    .signature .name { font-weight: 600; color: #1a1a1a; font-size: 14.5px; }
    .signature .role { font-size: 12.5px; color: #888; }
    .signature .brand { font-size: 12.5px; color: #c92826; font-weight: 500; }
    .footer { background: #f9f9f9; border-top: 1px solid #ebebeb; padding: 20px 48px; display: flex; align-items: center; justify-content: space-between; }
    .footer-left { font-size: 11px; color: #aaa; line-height: 1.6; }
    .footer-left a { color: #c92826; text-decoration: none; }
    .footer-dot { width: 6px; height: 6px; border-radius: 50%; background: #f5d439; flex-shrink: 0; }
    @media (max-width: 480px) {
      .header, .body { padding-left: 28px; padding-right: 28px; }
      .footer { flex-direction: column; gap: 10px; align-items: flex-start; padding: 18px 28px; }
    }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="container">
    <div class="header">
      <img src="${appUrl}/knowlylogo.png" alt="Knowly" style="height: 32px; width: auto; display: block;" />
      <hr class="header-rule" />
      <p class="header-label">Official Welcome Letter</p>
    </div>
    <div class="body">
      <p class="salutation">Dear ${name},</p>
      <p>On behalf of the entire Knowly team, it is our sincere pleasure to formally welcome you as an official <strong>Educator</strong> for <strong>${subject}</strong>.</p>
      <p>Your application has been carefully reviewed, and we are delighted to confirm that you have been accepted. We look forward to the knowledge and dedication you will bring to our students.</p>
      <div class="highlight-box">
        <p>Your educator account is now active. You may log in at any time to begin setting up your profile, lessons, and course materials.</p>
      </div>
      <p>As a Knowly Educator, you will be able to:</p>
      <ul class="role-list">
        <li>Curate and build out the curriculum for your assigned subject</li>
        <li>Link high-quality video lessons directly to specific curriculum topics</li>
        <li>Provide students with a structured, easy-to-follow learning path</li>
        <li>Collaborate with the Knowly administration to expand educational access</li>
      </ul>
      <div class="cta-wrap">
        <a href="${activateLink}" class="cta-btn">Go to My Dashboard →</a>
      </div>
      <p>Should you have any questions, our team is available at <a href="mailto:contact@knowly.uz" style="color:#1b5e3b;text-decoration:none;font-weight:500;">contact@knowly.uz</a>. We are here to help you settle in.</p>
      <hr class="divider" />
      <div class="signature">
        <p>Yours sincerely,</p>
        <br/>
        <p class="name">Ismatulloh Bakhtiyorov</p>
        <p class="role">Founder &amp; CEO</p>
        <p class="brand">Knowly</p>
      </div>
    </div>
    <div class="footer">
      <div class="footer-left">
        &copy; 2025 Knowly &nbsp;·&nbsp; <a href="https://www.knowly.uz" style="color:#c92826; text-decoration: none !important; font-weight: 500;">www.knowly.uz</a><br/>
        This is an official communication from the Knowly team.
      </div>
      <div class="footer-dot"></div>
    </div>
  </div>
</div>
</body>
</html>

`
      });
    } else {
      // Send Rejection Email
      await resend.emails.send({
        from: 'Knowly Team <contact@knowly.uz>',
        to: email,
        subject: 'Update on your Knowly Application',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Knowly – Application Update</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #f4f4f4; font-family: 'Inter', Arial, sans-serif; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; padding: 48px 16px; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .header { background-color: #ffffff; border-bottom: 1px solid #ebebeb; padding: 36px 48px 32px; }
    .header-logo { display: block; height: 28px; width: auto; }
    .header-rule { margin-top: 22px; border: none; border-top: 1px solid #ebebeb; }
    .header-label { margin-top: 16px; font-size: 10.5px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: #888; }
    .body { padding: 40px 48px 36px; }
    .salutation { font-size: 15px; font-weight: 500; color: #1a1a1a; margin-bottom: 20px; }
    .body p { font-size: 14px; line-height: 1.78; color: #3a3a3a; margin-bottom: 16px; font-weight: 300; }
    .body p strong { font-weight: 600; color: #1a1a1a; }
    .sorry-box { margin: 24px 0; padding: 18px 20px; border: 1px solid #e8d0d0; background: #fdf5f5; border-radius: 2px; }
    .sorry-box p { margin: 0; font-size: 13.5px; color: #3a3a3a; font-weight: 300; line-height: 1.7; }
    .cta-wrap { margin: 28px 0 24px; }
    .cta-btn { display: inline-block; background: transparent; color: #c92826; text-decoration: none; font-size: 12.5px; font-weight: 500; letter-spacing: 0.5px; padding: 11px 27px; border-radius: 2px; border: 1.5px solid #c92826; }
    .divider { border: none; border-top: 1px solid #ebebeb; margin: 28px 0; }
    .signature { font-size: 14px; line-height: 1.7; color: #3a3a3a; font-weight: 300; }
    .signature .name { font-weight: 600; color: #1a1a1a; font-size: 14.5px; }
    .signature .role { font-size: 12.5px; color: #888; }
    .signature .brand { font-size: 12.5px; color: #c92826; font-weight: 500; }
    .footer { background: #f9f9f9; border-top: 1px solid #ebebeb; padding: 20px 48px; display: flex; align-items: center; justify-content: space-between; }
    .footer-left { font-size: 11px; color: #aaa; line-height: 1.6; }
    .footer-left a { color: #c92826; text-decoration: none; }
    .footer-dot { width: 6px; height: 6px; border-radius: 50%; background: #f5d439; flex-shrink: 0; }
    @media (max-width: 480px) {
      .header, .body { padding-left: 28px; padding-right: 28px; }
      .footer { flex-direction: column; gap: 10px; align-items: flex-start; padding: 18px 28px; }
    }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="container">
    <div class="header">
      <img src="${appUrl}/knowlylogo.png" alt="Knowly" style="height: 32px; width: auto; display: block;" />
      <hr class="header-rule" />
      <p class="header-label">Application Update</p>
    </div>
    <div class="body">
      <p class="salutation">Dear ${name},</p>
      <p>Thank you for your interest in joining Knowly as an Educator and for the time you invested in your application for <strong>${subject}</strong>.</p>
      <p>After careful review, we regret to inform you that we are unable to move forward with your application at this time. This decision was not made lightly, and we genuinely appreciate the effort you put into the process.</p>
      <div class="sorry-box">
        <p>Our selections are based on a number of criteria including curriculum alignment, platform capacity, and current student demand. Not being selected does not reflect on your qualifications or expertise.</p>
      </div>
      <p>We encourage you to reapply in the future as our platform grows and new positions become available. We will keep your profile on record and may reach out if a suitable opportunity arises.</p>
      <p>If you have questions about this decision, please do not hesitate to contact us at <a href="mailto:contact@knowly.uz" style="color:#c92826;text-decoration:none;font-weight:500;">contact@knowly.uz</a>. We wish you every success in your endeavours.</p>
      <div class="cta-wrap">
        <a href="https://www.knowly.uz" class="cta-btn">Visit Knowly →</a>
      </div>
      <hr class="divider" />
      <div class="signature">
        <p>Yours sincerely,</p>
        <br/>
        <p class="name">Ismatulloh Bakhtiyorov</p>
        <p class="role">Founder &amp; CEO</p>
        <p class="brand">Knowly</p>
      </div>
    </div>
    <div class="footer">
      <div class="footer-left">
        &copy; 2025 Knowly &nbsp;·&nbsp; <a href="https://www.knowly.uz" style="color:#c92826; text-decoration: none !important; font-weight: 500;">www.knowly.uz</a><br/>
        This is an official communication from the Knowly team.
      </div>
      <div class="footer-dot"></div>
    </div>
  </div>
</div>
</body>
</html>

`
      });
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to resolve application." };
  }
}
