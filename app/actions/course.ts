'use server'

import prisma from '@/lib/prisma';

// Fetch the system teacher that owns the seeded data
export async function getTeacherUnits() {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { email: 'system@knowly.uz' }
    });

    if (!teacher) return [];

    const units = await prisma.unit.findMany({
      where: { teacherId: teacher.id },
      include: {
        topics: { orderBy: { order: 'asc' } }
      },
      orderBy: { order: 'asc' }
    });
    
    // Maintain the derived isSaved property for the UI
    return units.map(unit => ({
      ...unit,
      topics: unit.topics.map(topic => ({
        ...topic,
        isSaved: !!(topic.ytLink && topic.ytLink.trim().length > 0)
      }))
    }));
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function createUnit(title: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { email: 'system@knowly.uz' }
  });

  if (!teacher) throw new Error("Teacher not found");

  // A unit requires a subjectId per the 4-tier schema
  const subjectId = teacher.subjectId;
  
  if (!subjectId) {
     const anySubj = await prisma.subject.findFirst();
     if (!anySubj) throw new Error("No subjects exist in DB");
     return await prisma.unit.create({
       data: { title, subjectId: anySubj.id, teacherId: teacher.id }
     });
  }

  return await prisma.unit.create({
    data: {
      title,
      subjectId: subjectId,
      teacherId: teacher.id,
    }
  });
}

export async function createTopic(unitId: string, title: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { email: 'system@knowly.uz' }
  });

  if (!teacher) throw new Error("Teacher not found");

  return await prisma.topic.create({
    data: {
      title,
      unitId,
      teacherId: teacher.id,
    }
  });
}

export async function updateTopicVideo(topicId: string, ytLink: string) {
  return await prisma.topic.update({
    where: { id: topicId },
    data: {
      ytLink,
    }
  });
}
