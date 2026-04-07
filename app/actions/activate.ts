'use server'
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function activateTeacherAccount(email: string, token: string, password: string) {
  try {
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher) return { success: false, message: "Account not found." };
    if (teacher.isVerified) return { success: false, message: "Account is already activated. Please log in." };
    if (teacher.otpCode !== token) return { success: false, message: "Invalid activation token." };
    if (!teacher.otpExpires || new Date() > teacher.otpExpires) return { success: false, message: "Activation link has expired." };

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.teacher.update({
      where: { email },
      data: {
        password: hashedPassword,
        isVerified: true,
        otpCode: null,
        otpExpires: null
      }
    });

    return { success: true, message: "Account activated successfully!" };
  } catch (error) {
    return { success: false, message: "An error occurred during activation." };
  }
}
