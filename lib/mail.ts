import { Resend } from 'resend';

export async function sendOTPEmail(to: string, otp: string, name?: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://teacher.knowly.uz";
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured.");
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Knowly Team <contact@knowly.uz>',
      to,
      subject: 'Your Knowly Security Code',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Knowly – OTP Verification</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #f4f4f4; font-family: 'Inter', Arial, sans-serif; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; padding: 48px 16px; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .header { background-color: #721707; padding: 36px 48px 32px; }
    .header-logo { display: block; height: 28px; width: auto; }
    .header-rule { margin-top: 22px; border: none; border-top: 1px solid rgba(255,255,255,0.2); }
    .header-label { margin-top: 16px; font-size: 10.5px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.6); }
    .body { padding: 40px 48px 36px; }
    .salutation { font-size: 15px; font-weight: 500; color: #1a1a1a; margin-bottom: 20px; }
    .body p { font-size: 14px; line-height: 1.78; color: #3a3a3a; margin-bottom: 16px; font-weight: 300; }
    .body p strong { font-weight: 600; color: #1a1a1a; }
    .otp-box { margin: 28px 0; text-align: center; padding: 28px 24px; background: #f4f4f4; border: 1px solid #ebebeb; border-radius: 2px; }
    .otp-label { font-size: 10.5px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: #888; margin-bottom: 14px; }
    .otp-code { font-size: 40px; font-weight: 600; letter-spacing: 12px; color: #c92826; font-feature-settings: "tnum"; }
    .otp-expiry { margin-top: 12px; font-size: 12px; color: #888; font-weight: 300; }
    .security-note { font-size: 12px !important; color: #888 !important; font-style: italic; margin-top: 4px !important; }
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
      .otp-code { font-size: 32px; letter-spacing: 8px; }
    }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="container">
    <div class="header">
      <img src="${appUrl}/knowlylogo.png" alt="Knowly" style="height: 32px; width: auto; display: block;" />
      <hr class="header-rule" />
      <p class="header-label">Verification Code</p>
    </div>
    <div class="body">
      <p class="salutation">${name ? 'Hello, ' + name : 'Hello'}</p>
      <p>We received a request to verify your identity on Knowly. Use the code below to complete your verification. Do <strong>not</strong> share this code with anyone.</p>
      <div class="otp-box">
        <p class="otp-label">Your verification code</p>
        <p class="otp-code">${otp}</p>
        <p class="otp-expiry">This code expires in <strong>10 minutes</strong></p>
      </div>
      <p>If you did not request this code, you can safely ignore this email. Your account will remain secure and no changes will be made.</p>
      <p class="security-note">For your security, Knowly will never ask for this code by phone or email.</p>
      <hr class="divider" />
      <div class="signature">
        <p>The Knowly Team</p>
        <br/>
        <p class="brand">Knowly</p>
      </div>
    </div>
    <div class="footer">
      <div class="footer-left">
        &copy; 2025 Knowly &nbsp;·&nbsp; <a href="https://www.knowly.uz" style="color: #c92826; text-decoration: none !important; font-weight: 500;">www.knowly.uz</a><br/>
        If you did not request this, please ignore.
      </div>
      <div class="footer-dot"></div>
    </div>
  </div>
</div>
</body>
</html>

`,
    });
    return { success: true };
  } catch (error) {
    console.error("Resend API Error:", error);
    throw new Error("Email sending failed");
  }
}
