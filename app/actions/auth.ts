'use server'
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { sendOTPEmail } from '@/lib/mail';
import bcrypt from 'bcrypt';

const loginRateLimitMap = new Map<string, { count: number, resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function initiateLogin(email: string, password?: string) {
  try {
    if (!email || typeof email !== 'string' || email.length > 255) {
      return { success: false, message: "Invalid email format." };
    }
    if (password && (typeof password !== 'string' || password.length > 255)) {
      return { success: false, message: "Invalid password format." };
    }

    const cleanEmail = email.toLowerCase().trim();
    
    // Rate Limiting
    const now = Date.now();
    const rateLimit = loginRateLimitMap.get(cleanEmail);
    if (rateLimit) {
      if (now < rateLimit.resetTime) {
        if (rateLimit.count >= MAX_ATTEMPTS) {
          return { success: false, message: "Too many login attempts. Please try again in 15 minutes." };
        }
        rateLimit.count++;
      } else {
        loginRateLimitMap.set(cleanEmail, { count: 1, resetTime: now + WINDOW_MS });
      }
    } else {
      loginRateLimitMap.set(cleanEmail, { count: 1, resetTime: now + WINDOW_MS });
    }

    console.log("--> Secure login attempt for:", cleanEmail);
    
    // 1. GOD ACCOUNT LOGIC
    if (process.env.ADMIN_EMAIL && cleanEmail === process.env.ADMIN_EMAIL.toLowerCase().trim()) {
      if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return { success: false, message: "Invalid credentials." };
      const existing = await prisma.teacher.findUnique({ where: { email: cleanEmail } });
      if (!existing) {
        const hashedAdmin = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await prisma.teacher.create({ data: { name: 'Admin', email: cleanEmail, password: hashedAdmin, role: 'ADMIN', isVerified: true } });
      }
    } else {
      // 2. REGULAR TEACHER
      const user = await prisma.teacher.findUnique({ where: { email: cleanEmail } });
      if (!user || !user.password) return { success: false, message: "Invalid credentials." };
      
      // CRITICAL: MUST use bcrypt.compare
      const isMatch = await bcrypt.compare(password || '', user.password);
      if (!isMatch) return { success: false, message: "Invalid credentials." };
    }

    // 3. GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); 

    const updatedUser = await prisma.teacher.update({ 
      where: { email: cleanEmail }, 
      data: { otpCode: otp, otpExpires: expires } 
    });

    // 4. SEND EMAIL & FALLBACK
    try {
      await sendOTPEmail(cleanEmail, otp, updatedUser.name);
    } catch (emailErr) {
      console.warn("⚠️ Email failed to send via Resend. FALLBACK OTP IS:", otp);
    }

    return { success: true, message: "Code sent!" };
  } catch (error: any) {
    console.error("Login Error:", error);
    return { success: false, message: "Database connection failed. Check Prisma." };
  }
}

export async function verifyOTP(email: string, otp: string) {
  try {
    const user = await prisma.teacher.findUnique({ where: { email } });
    if (!user || user.otpCode !== otp || new Date() > user.otpExpires!) {
      return { success: false, message: "Invalid or expired OTP." };
    }
    await prisma.teacher.update({ where: { email }, data: { otpCode: null, otpExpires: null } });
    
    // Set a secure HTTP cookie for middleware to read
    const cookieStore = await cookies();
    cookieStore.set('knowly_auth', user.email, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return { success: true, user: { role: user.role } };
  } catch (error) {
    return { success: false, message: "Verification failed." };
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('knowly_auth');
    return { success: true };
  } catch (err) {
    return { success: false, message: "Could not log out." };
  }
}
