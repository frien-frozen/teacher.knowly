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

    // Upload to Vercel Blob
    const blob = await put(`profiles/${email}-${Date.now()}.webp`, file, {
      access: 'public',
    });

    // Save to Prisma
    await prisma.teacher.update({
      where: { email },
      data: { profilePic: blob.url },
    });

    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error("Upload profile image failed:", error);
    return { success: false, message: "Could not upload image. Check server configuration." };
  }
}
