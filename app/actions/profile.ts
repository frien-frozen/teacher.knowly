'use server'

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function uploadProfileImage(formData: FormData) {
  console.log("DEBUG: uploadProfileImage started");
  console.log("TOKEN CHECK:", process.env.BLOB_READ_WRITE_TOKEN ? "Exists" : "MISSING");
  
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get('knowly_auth')?.value;

    if (!email) {
      console.warn("DEBUG: No auth cookie found");
      return { success: false, message: "Unauthorized. Please log in again." };
    }

    const file = formData.get('file') as File;
    if (!file) {
      console.warn("DEBUG: No file provided in FormData");
      return { success: false, message: "No file provided." };
    }

    console.log(`DEBUG: Uploading file for ${email}, size: ${file.size} bytes`);
    
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, message: "File exceeds 5MB limit." };
    }

    // Upload to Vercel Blob
    console.log("DEBUG: Calling @vercel/blob put()...");
    const blob = await put(`profiles/${email}-${Date.now()}.webp`, file, {
      access: 'private',
    });
    console.log("DEBUG: Blob upload success, URL:", blob.url);

    // Save to Prisma
    console.log("DEBUG: Updating Prisma record...");
    await prisma.teacher.update({
      where: { email },
      data: { profilePic: blob.url },
    });
    console.log("DEBUG: Prisma update success");

    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error("CRITICAL: BLOB UPLOAD FAILED:", error);
    if (error instanceof Error) {
      console.error("ERROR NAME:", error.name);
      console.error("ERROR MESSAGE:", error.message);
      console.error("ERROR STACK:", error.stack);
    }
    return { 
      success: false, 
      message: error.message || "Could not upload image. Check server configuration.",
      debugInfo: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    };
  }
}
