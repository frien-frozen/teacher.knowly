'use server'
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

async function currentEmail(): Promise<string | null> {
  const c = await cookies();
  return c.get('knowly_auth')?.value ?? null;
}

// Fetch Profile with nested Subject & Curriculum data
export async function getTeacherProfile() {
  try {
    const email = await currentEmail();
    if (!email) return { success: false, message: "Not authenticated" };

    const teacher = await prisma.teacher.findUnique({
      where: { email },
      include: {
        subject: {
          include: { curriculum: true }
        }
      }
    });
    if (!teacher) return { success: false, message: "Teacher not found" };
    return { success: true, data: teacher };
  } catch {
    return { success: false, message: "Database error" };
  }
}

// Fetch ONLY Units and Topics for this specific teacher's subject
export async function getTeacherSyllabus() {
  try {
    const email = await currentEmail();
    if (!email) return { success: false, message: "Not authenticated" };

    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher || !teacher.subjectId) return { success: false, message: "No subject assigned." };

    const syllabus = await prisma.unit.findMany({
      where: { subjectId: teacher.subjectId },
      include: {
        topics: { orderBy: { order: 'asc' } }
      },
      orderBy: { order: 'asc' }
    });

    return { success: true, data: syllabus, subjectId: teacher.subjectId };
  } catch {
    return { success: false, message: "Failed to load syllabus" };
  }
}

// Add a topic to a unit owned by the current teacher's subject
export async function addTeacherTopic(unitId: string, title: string) {
  try {
    const email = await currentEmail();
    if (!email) return { success: false, message: "Not authenticated" };

    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher || !teacher.subjectId) return { success: false, message: "Unauthorized" };

    const unit = await prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit || unit.subjectId !== teacher.subjectId) {
      return { success: false, message: "You do not own this unit." };
    }

    await prisma.topic.create({
      data: { title, unitId, teacherId: teacher.id }
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

// Link a YouTube video to a topic and credit current teacher as publisher
export async function updateTopicVideo(topicId: string, videoUrl: string) {
  try {
    const email = await currentEmail();
    if (!email) return { success: false, message: "Not authenticated" };

    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher) return { success: false, message: "Unauthorized" };

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { unit: true }
    });

    if (!topic || topic.unit.subjectId !== teacher.subjectId) {
      return { success: false, message: "You do not have permission to edit this topic." };
    }

    await prisma.topic.update({
      where: { id: topicId },
      data: {
        ytLink: videoUrl,
        publishedById: teacher.id,
        publishedAt: new Date(),
      }
    });

    return { success: true, message: "Video linked successfully!" };
  } catch {
    return { success: false, message: "Failed to link video." };
  }
}

// Update current teacher's name and bio
export async function updateTeacherProfile(name: string, bio: string) {
  try {
    const email = await currentEmail();
    if (!email) return { success: false, message: "Not authenticated" };

    await prisma.teacher.update({
      where: { email },
      data: { name, bio }
    });
    return { success: true, message: "Profile updated successfully!" };
  } catch {
    return { success: false, message: "Failed to update profile." };
  }
}
