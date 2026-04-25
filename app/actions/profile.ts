'use server'

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function uploadProfileImage(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get('knowly_auth')?.value;

    if (!email) {
      return { success: false, message: "Unauthorized. Please log in again." };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, message: "No file provided." };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, message: "File exceeds 5MB limit." };
    }

    const blob = await put(`profiles/${email}-${Date.now()}.webp`, file, {
      access: 'private',
    });

    await prisma.teacher.update({
      where: { email },
      data: { profilePic: blob.url },
    });

    return { success: true, url: blob.url };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Could not upload image. Check server configuration.",
    };
  }
}
