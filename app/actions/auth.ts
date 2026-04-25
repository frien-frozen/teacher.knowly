'use server'
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { sendOTPEmail } from '@/lib/mail';
import bcrypt from 'bcrypt';
import { createHash, timingSafeEqual } from 'crypto';

const loginRateLimitMap = new Map<string, { count: number, resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function hashOTP(otp: string): string {
  const secret = process.env.OTP_SECRET || 'knowly-otp-fallback-secret';
  return createHash('sha256').update(otp + secret).digest('hex');
}

function safeStringCompare(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

function setCookies(cookieStore: Awaited<ReturnType<typeof cookies>>, email: string, role: string) {
  const opts = {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30,
  };
  cookieStore.set('knowly_auth', email, opts);
  cookieStore.set('knowly_role', role, opts);
}

export async function initiateLogin(email: string, password?: string) {
  try {
    if (!email || typeof email !== 'string' || email.length > 255) {
      return { success: false, message: "Invalid email format." };
    }
    if (password && (typeof password !== 'string' || password.length > 255)) {
      return { success: false, message: "Invalid password format." };
    }

    const cleanEmail = email.toLowerCase().trim();

    // Rate limiting
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

    // GOD ACCOUNT: create admin in DB on first login only
    if (process.env.ADMIN_EMAIL && safeStringCompare(cleanEmail, process.env.ADMIN_EMAIL.toLowerCase().trim())) {
      const existing = await prisma.teacher.findUnique({ where: { email: cleanEmail } });
      if (!existing) {
        const adminPw = process.env.ADMIN_PASSWORD || '';
        if (!safeStringCompare(password || '', adminPw)) {
          return { success: false, message: "Invalid credentials." };
        }
        const hashedAdmin = await bcrypt.hash(adminPw, 10);
        await prisma.teacher.create({
          data: { name: 'Admin', email: cleanEmail, password: hashedAdmin, role: 'ADMIN', isVerified: true }
        });
      }
    }

    // ALL users (including admin after first login) go through bcrypt
    const user = await prisma.teacher.findUnique({ where: { email: cleanEmail } });
    if (!user || !user.password) return { success: false, message: "Invalid credentials." };

    const isMatch = await bcrypt.compare(password || '', user.password);
    if (!isMatch) return { success: false, message: "Invalid credentials." };

    // Generate OTP — store as hash, never plaintext
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.teacher.update({
      where: { email: cleanEmail },
      data: { otpCode: hashOTP(otp), otpExpires: expires }
    });

    // Send OTP — on failure, do NOT log the OTP
    try {
      await sendOTPEmail(cleanEmail, otp, user.name);
    } catch {
      return { success: false, message: "Failed to send verification email. Please try again." };
    }

    return { success: true, message: "Code sent!" };
  } catch (error: any) {
    console.error("Login Error:", error?.message);
    return { success: false, message: "Database connection failed. Check Prisma." };
  }
}

export async function verifyOTP(email: string, otp: string) {
  try {
    const user = await prisma.teacher.findUnique({ where: { email } });
    if (!user || !user.otpCode || !user.otpExpires) {
      return { success: false, message: "Invalid or expired OTP." };
    }
    if (new Date() > user.otpExpires) {
      return { success: false, message: "Invalid or expired OTP." };
    }
    if (!safeStringCompare(hashOTP(otp), user.otpCode)) {
      return { success: false, message: "Invalid or expired OTP." };
    }

    await prisma.teacher.update({ where: { email }, data: { otpCode: null, otpExpires: null } });

    const cookieStore = await cookies();
    setCookies(cookieStore, user.email, user.role);

    return { success: true, user: { role: user.role } };
  } catch (error) {
    return { success: false, message: "Verification failed." };
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('knowly_auth');
    cookieStore.delete('knowly_role');
    return { success: true };
  } catch {
    return { success: false, message: "Could not log out." };
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get('knowly_auth')?.value;
    if (!email) return null;
    return await prisma.teacher.findUnique({
      where: { email },
      select: { role: true, name: true, email: true }
    });
  } catch {
    return null;
  }
}
