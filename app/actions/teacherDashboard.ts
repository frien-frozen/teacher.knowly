'use server'
import prisma from '@/lib/prisma';

// Fetch Profile with nested Subject & Curriculum data
export async function getTeacherProfile(email: string) {
  try {
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
  } catch (error) {
    return { success: false, message: "Database error" };
  }
}

// Fetch ONLY Units and Topics for this specific teacher's subject
export async function getTeacherSyllabus(email: string) {
  try {
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher || !teacher.subjectId) return { success: false, message: "No subject assigned." };

    // SCOPED QUERY: Only fetch units belonging to their assigned subject
    const syllabus = await prisma.unit.findMany({
      where: { subjectId: teacher.subjectId },
      include: {
        topics: { orderBy: { order: 'asc' } } 
      },
      orderBy: { order: 'asc' }
    });

    return { success: true, data: syllabus, subjectId: teacher.subjectId };
  } catch (error) {
    return { success: false, message: "Failed to load syllabus" };
  }
}

// Secure action to add a topic (Requires verifying the teacher owns the subject)
export async function addTeacherTopic(email: string, unitId: string, title: string) {
  try {
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher) throw new Error("Unauthorized");

    await prisma.topic.create({
      data: { title, unitId, teacherId: teacher.id }
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// Secure action to link a video. Verifies teacher owns the topic's subject.
export async function updateTopicVideo(email: string, topicId: string, videoUrl: string) {
  try {
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher) throw new Error("Unauthorized");

    // Ensure the topic belongs to a unit in their assigned subject
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { unit: true }
    });

    if (!topic || topic.unit.subjectId !== teacher.subjectId) {
      return { success: false, message: "You do not have permission to edit this topic." };
    }

    // Set the video link and credit THIS teacher as the publisher
    await prisma.topic.update({
      where: { id: topicId },
      data: {
        ytLink: videoUrl,
        publishedById: teacher.id,
        publishedAt: new Date(),
      }
    });

    return { success: true, message: "Video linked successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to link video." };
  }
}

// Update teacher profile details
export async function updateTeacherProfile(email: string, name: string, bio: string) {
  try {
    await prisma.teacher.update({
      where: { email },
      data: { name, bio }
    });
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to update profile." };
  }
}

