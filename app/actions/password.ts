'use server'
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

const resetRateLimitMap = new Map<string, { count: number, resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function hashToken(token: string): string {
  const secret = process.env.OTP_SECRET || 'knowly-otp-fallback-secret';
  return createHash('sha256').update(token + secret).digest('hex');
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = resetRateLimitMap.get(key);
  if (entry) {
    if (now < entry.resetTime) {
      if (entry.count >= MAX_ATTEMPTS) return false;
      entry.count++;
    } else {
      resetRateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
    }
  } else {
    resetRateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
  }
  return true;
}

export async function requestPasswordReset(email: string, appUrl: string) {
  if (!email || typeof email !== 'string' || email.length > 255) {
    return { success: false, message: "Invalid email format." };
  }
  const cleanEmail = email.toLowerCase().trim();

  if (!checkRateLimit(cleanEmail)) {
    return { success: false, message: "Too many requests. Please try again later." };
  }

  if (!process.env.RESEND_API_KEY) {
    return { success: false, message: "Email service not configured." };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const user = await prisma.teacher.findUnique({ where: { email: cleanEmail } });
    // Always return success to prevent email enumeration
    if (!user) return { success: true, message: "If an account exists, a reset link has been sent." };

    // Cryptographically secure token
    const resetToken = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.teacher.update({
      where: { email: cleanEmail },
      data: { otpCode: hashToken(resetToken), otpExpires: expires }
    });

    const resetLink = `${appUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(cleanEmail)}`;

    await resend.emails.send({
      from: 'Knowly Team <contact@knowly.uz>',
      to: cleanEmail,
      subject: 'Reset your Knowly Password',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Knowly – Reset Password</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #f4f4f4; font-family: 'Inter', Arial, sans-serif; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; padding: 48px 16px; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .header { background-color: #c92826; padding: 36px 48px 32px; }
    .header-rule { margin-top: 22px; border: none; border-top: 1px solid rgba(255,255,255,0.2); }
    .header-label { margin-top: 16px; font-size: 10.5px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.6); }
    .body { padding: 40px 48px 36px; }
    .salutation { font-size: 15px; font-weight: 500; color: #1a1a1a; margin-bottom: 20px; }
    .body p { font-size: 14px; line-height: 1.78; color: #3a3a3a; margin-bottom: 16px; font-weight: 300; }
    .body p strong { font-weight: 600; color: #1a1a1a; }
    .highlight-box { margin: 24px 0; border-left: 3px solid #c92826; padding: 13px 18px; background: #fdf8f8; }
    .highlight-box p { margin: 0; font-size: 13.5px; }
    .cta-wrap { margin: 28px 0 24px; }
    .cta-btn { display: inline-block; background: #c92826; color: #fff; text-decoration: none; font-size: 12.5px; font-weight: 500; letter-spacing: 0.5px; padding: 12px 28px; border-radius: 2px; }
    .divider { border: none; border-top: 1px solid #ebebeb; margin: 28px 0; }
    .signature { font-size: 14px; line-height: 1.7; color: #3a3a3a; font-weight: 300; }
    .signature .brand { font-size: 12.5px; color: #c92826; font-weight: 500; }
    .footer { background: #f9f9f9; border-top: 1px solid #ebebeb; padding: 20px 48px; display: flex; align-items: center; justify-content: space-between; }
    .footer-left { font-size: 11px; color: #aaa; line-height: 1.6; }
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
      <p class="header-label">Password Reset</p>
    </div>
    <div class="body">
      <p class="salutation">Hello, ${user.name}</p>
      <p>We received a request to reset the password for your Knowly account. Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.</p>
      <div class="cta-wrap">
        <a href="${resetLink}" class="cta-btn">Reset My Password →</a>
      </div>
      <div class="highlight-box">
        <p>If you did not request a password reset, please ignore this email. Your account remains secure.</p>
      </div>
      <p>For security, this link can only be used once. Contact us at <a href="mailto:contact@knowly.uz" style="color:#c92826;text-decoration:none;font-weight:500;">contact@knowly.uz</a> if you need help.</p>
      <hr class="divider" />
      <div class="signature">
        <p>The Knowly Team</p><br/>
        <p class="brand">Knowly</p>
      </div>
    </div>
    <div class="footer">
      <div class="footer-left">
        &copy; 2026 Knowly &nbsp;·&nbsp; <a href="https://www.knowly.uz" style="color:#c92826;text-decoration:none;font-weight:500;">www.knowly.uz</a><br/>
        If you did not request this, no action is needed.
      </div>
      <div class="footer-dot"></div>
    </div>
  </div>
</div>
</body>
</html>`
    });

    return { success: true, message: "If an account exists, a reset link has been sent." };
  } catch (error: any) {
    console.error("Password reset error:", error?.message);
    return { success: false, message: "Failed to process request." };
  }
}

export async function executePasswordReset(email: string, token: string, newPassword: string) {
  try {
    if (!email || typeof email !== 'string' || email.length > 255) return { success: false, message: "Invalid input." };
    if (!token || typeof token !== 'string' || token.length > 200) return { success: false, message: "Invalid input." };
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 255) {
      return { success: false, message: "Password must be at least 8 characters." };
    }

    const cleanEmail = decodeURIComponent(email).toLowerCase().trim();

    if (!checkRateLimit(cleanEmail)) {
      return { success: false, message: "Too many reset attempts." };
    }

    const user = await prisma.teacher.findUnique({ where: { email: cleanEmail } });
    if (!user) return { success: false, message: "Invalid reset link." };
    if (!user.otpCode || !user.otpExpires) return { success: false, message: "Invalid or expired reset link." };
    if (new Date() > user.otpExpires) return { success: false, message: "Reset link has expired." };
    if (user.otpCode !== hashToken(token)) return { success: false, message: "Invalid reset link." };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.teacher.update({
      where: { email: cleanEmail },
      data: { password: hashedPassword, otpCode: null, otpExpires: null }
    });

    return { success: true, message: "Password updated successfully." };
  } catch (error: any) {
    console.error("Password reset execution error:", error?.message);
    return { success: false, message: "Server error during reset." };
  }
}
