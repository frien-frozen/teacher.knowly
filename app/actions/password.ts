'use server'
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import bcrypt from 'bcrypt';

const resetRateLimitMap = new Map<string, { count: number, resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function requestPasswordReset(email: string, appUrl: string) {
  if (!email || typeof email !== 'string' || email.length > 255) {
    return { success: false, message: "Invalid email format." };
  }
  const cleanEmail = email.toLowerCase().trim();

  const now = Date.now();
  const rateLimit = resetRateLimitMap.get(cleanEmail);
  if (rateLimit) {
    if (now < rateLimit.resetTime) {
      if (rateLimit.count >= MAX_ATTEMPTS) {
        return { success: false, message: "Too many requests. Please try again later." };
      }
      rateLimit.count++;
    } else {
      resetRateLimitMap.set(cleanEmail, { count: 1, resetTime: now + WINDOW_MS });
    }
  } else {
    resetRateLimitMap.set(cleanEmail, { count: 1, resetTime: now + WINDOW_MS });
  }
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY missing. Reset email NOT sent for:", email);
    return { success: false, message: "Missing Resend API Key." };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const user = await prisma.teacher.findUnique({ where: { email: cleanEmail } });
    // For security, always return success even if user doesn't exist to prevent email enumeration
    if (!user) return { success: true, message: "If an account exists, a reset link has been sent." };

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour expiry

    await prisma.teacher.update({
      where: { email },
      data: { otpCode: resetToken, otpExpires: expires }
    });

    const resetLink = `${appUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    await resend.emails.send({
      from: 'Knowly Team <contact@knowly.uz>',
      to: email,
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
    .header-logo { display: block; height: 28px; width: auto; }
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
      <p class="header-label">Password Reset</p>
    </div>
    <div class="body">
      <p class="salutation">Hello, ${user.name}</p>
      <p>We received a request to reset the password associated with your Knowly account. Click the button below to set a new password. This link is valid for <strong>30 minutes</strong>.</p>
      <div class="cta-wrap">
        <a href="${resetLink}" class="cta-btn">Reset My Password →</a>
      </div>
      <div class="highlight-box">
        <p>If you did not request a password reset, please disregard this email. Your current password will remain unchanged and your account is safe.</p>
      </div>
      <p>For security, this link can only be used once. If you need further assistance, please contact us at <a href="mailto:contact@knowly.uz" style="color:#c92826;text-decoration:none;font-weight:500;">contact@knowly.uz</a>.</p>
      <hr class="divider" />
      <div class="signature">
        <p>The Knowly Team</p>
        <br/>
        <p class="brand">Knowly</p>
      </div>
    </div>
    <div class="footer">
      <div class="footer-left">
        &copy; 2025 Knowly &nbsp;·&nbsp; <a href="https://www.knowly.uz" style="color:#c92826; text-decoration: none !important; font-weight: 500;">www.knowly.uz</a><br/>
        If you did not request this, no action is needed.
      </div>
      <div class="footer-dot"></div>
    </div>
  </div>
</div>
</body>
</html>

`
    });

    return { success: true, message: "If an account exists, a reset link has been sent." };
  } catch (error: any) {
    console.error("FATAL ERROR IN PASSWORD RESET:", error);
    return { success: false, message: "Failed to process request." };
  }
}

export async function executePasswordReset(email: string, token: string, newPassword: string) {
  try {
    if (!email || typeof email !== 'string' || email.length > 255) return { success: false, message: "Invalid input." };
    if (!token || typeof token !== 'string' || token.length > 100) return { success: false, message: "Invalid input." };
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length > 255) return { success: false, message: "Invalid input." };

    const cleanEmail = decodeURIComponent(email).toLowerCase().trim();
    console.log(`Attempting reset for: ${cleanEmail}`);

    const now = Date.now();
    const rateLimit = resetRateLimitMap.get(cleanEmail);
    if (rateLimit) {
      if (now < rateLimit.resetTime) {
        if (rateLimit.count >= MAX_ATTEMPTS) return { success: false, message: "Too many reset attempts." };
        rateLimit.count++;
      } else {
        resetRateLimitMap.set(cleanEmail, { count: 1, resetTime: now + WINDOW_MS });
      }
    } else {
      resetRateLimitMap.set(cleanEmail, { count: 1, resetTime: now + WINDOW_MS });
    }

    const user = await prisma.teacher.findUnique({ where: { email: cleanEmail } });
    
    if (!user) return { success: false, message: "User not found." };
    if (user.otpCode !== token) return { success: false, message: "Invalid reset token." };
    if (!user.otpExpires || new Date() > user.otpExpires) return { success: false, message: "Link expired." };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`Saving new hashed password for ${cleanEmail}...`);

    await prisma.teacher.update({
      where: { email: cleanEmail },
      data: { 
        password: hashedPassword, 
        otpCode: null, 
        otpExpires: null 
      }
    });

    return { success: true, message: "Password updated successfully." };
  } catch (error: any) {
    console.error("FATAL RESET ERROR:", error);
    return { success: false, message: "Server error during reset." };
  }
}
