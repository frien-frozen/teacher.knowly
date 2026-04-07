'use server'
import prisma from '@/lib/prisma';

export async function getAllTeachers() {
  try {
    const teachers = await prisma.teacher.findMany({
      where: { role: 'TEACHER', isVerified: true },
      include: { subject: true },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: teachers };
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    return { success: false, data: [] };
  }
}
