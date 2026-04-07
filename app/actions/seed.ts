'use server'

import prisma from '@/lib/prisma';

const CURRICULUMS = [
    "Cambridge Lower Secondary",
    "Cambridge IGCSE",
    "Cambridge A-Level",
    "Pearson Edexcel",
    "National Standard (Milliy)"
];

const SUBJECTS_EN = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English", "Business", "Economics", "Other"];

const INITIAL_UNITS = [
  {
    title: '1. Fundamentals of Algebra',
    topics: [
      { title: '1.1 Introduction to Variables', ytLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: '1.2 Linear Equations', ytLink: '' },
    ]
  },
  {
    title: '2. Quadratic Functions',
    topics: [
      { title: '2.1 Solving by Factoring', ytLink: '' },
    ]
  }
];

export async function seedDatabase() {
  try {
    const teacherId = 'test-teacher-001';
    
    // Clear out old data to ensure clean seed
    await prisma.topic.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.curriculum.deleteMany();

    // Ensure the teacher exists
    const teacher = await prisma.teacher.upsert({
      where: { id: teacherId },
      update: {},
      create: {
        id: teacherId,
        name: 'Aziz Rahimov',
        email: 'test@knowly.uz',
      }
    });

    // 1. Seed Curriculums and linked Subjects
    for (const currName of CURRICULUMS) {
      await prisma.curriculum.upsert({
        where: { name: currName },
        update: {},
        create: {
          name: currName,
          subjects: {
            create: SUBJECTS_EN.map(subName => ({ name: subName }))
          }
        }
      });
    }

    // 2. Attach mock data to "Cambridge IGCSE" -> "Mathematics"
    const igcse = await prisma.curriculum.findUnique({ 
      where: { name: "Cambridge IGCSE" }, 
      include: { subjects: true }
    });
    const mathSubject = igcse?.subjects.find((s: any) => s.name === "Mathematics");

    if (mathSubject) {
      // Assign teacher to this subject explicitly
      await prisma.teacher.update({
        where: { id: teacher.id },
        data: { subjectId: mathSubject.id }
      });

      // Insert Initial Units and Nested Topics
      for (const [unitIndex, unitMock] of INITIAL_UNITS.entries()) {
        await prisma.unit.create({
          data: {
            title: unitMock.title,
            order: unitIndex,
            subjectId: mathSubject.id,
            teacherId: teacher.id,
            topics: {
              create: unitMock.topics.map((t, topicIndex) => ({
                title: t.title,
                ytLink: t.ytLink || null,
                order: topicIndex,
                teacherId: teacher.id
              }))
            }
          }
        });
      }
      return { success: true, message: "Database seeding complete!" };
    }
  } catch (error) {
    console.error("Seeding failed", error);
    return { success: false, error: String(error) };
  }
}
