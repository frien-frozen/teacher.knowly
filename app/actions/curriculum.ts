'use server'
import prisma from '@/lib/prisma';

export async function getCurriculums() {
  try {
    const data = await prisma.curriculum.findMany({
      include: { 
        subjects: {
          include: {
            units: {
              include: { topics: true },
              orderBy: { order: 'asc' }
            }
          }
        } 
      },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Deep Fetch error:", error);
    return { success: false, data: [] };
  }
}

export async function createCurriculum(name: string) {
  try { 
    await prisma.curriculum.create({ data: { name } }); 
    return { success: true }; 
  } catch (e) { 
    return { success: false, message: "Failed. Name might already exist." }; 
  }
}

export async function createSubject(curriculumId: string, name: string) {
  try { 
    await prisma.subject.create({ data: { curriculumId, name } }); 
    return { success: true }; 
  } catch (e) { 
    return { success: false, message: "Failed to create subject." }; 
  }
}

export async function createUnit(subjectId: string, title: string) {
  try { 
    // Units require a teacherId. For Admin-created content, we link to the Admin account.
    const admin = await prisma.teacher.findUnique({ where: { email: 'ismatullohbakh2010@gmail.com' } });
    if (!admin) throw new Error("Admin not found");
    await prisma.unit.create({ data: { subjectId, title, teacherId: admin.id } }); 
    return { success: true }; 
  } catch (e) { 
    return { success: false, message: "Failed to create unit." }; 
  }
}

export async function createTopicAdmin(unitId: string, title: string) {
  try { 
    // Topics also require a teacherId.
    const admin = await prisma.teacher.findUnique({ where: { email: 'ismatullohbakh2010@gmail.com' } });
    if (!admin) throw new Error("Admin not found");
    await prisma.topic.create({ data: { unitId, title, teacherId: admin.id } }); 
    return { success: true }; 
  } catch (e) { 
    return { success: false, message: "Failed to create topic." }; 
  }
}

export async function updateCurriculum(id: string, name: string) {
  try { await prisma.curriculum.update({ where: { id }, data: { name } }); return { success: true }; } 
  catch (e) { return { success: false }; }
}

export async function updateSubject(id: string, name: string) {
  try { await prisma.subject.update({ where: { id }, data: { name } }); return { success: true }; } 
  catch (e) { return { success: false }; }
}

export async function updateUnit(id: string, title: string) {
  try { await prisma.unit.update({ where: { id }, data: { title } }); return { success: true }; } 
  catch (e) { return { success: false }; }
}

export async function updateTopicAdmin(id: string, title: string) {
  try { await prisma.topic.update({ where: { id }, data: { title } }); return { success: true }; } 
  catch (e) { return { success: false }; }
}

export async function deleteCurriculum(id: string) {
  try { await prisma.curriculum.delete({ where: { id } }); return { success: true }; } catch(e) { return { success: false, message: "Delete failed" }; }
}

export async function deleteSubject(id: string) {
  try { await prisma.subject.delete({ where: { id } }); return { success: true }; } catch(e) { return { success: false, message: "Delete failed" }; }
}

export async function deleteUnit(id: string) {
  try { await prisma.unit.delete({ where: { id } }); return { success: true }; } catch(e) { return { success: false, message: "Delete failed" }; }
}

export async function deleteTopicAdmin(id: string) {
  try { await prisma.topic.delete({ where: { id } }); return { success: true }; } catch(e) { return { success: false, message: "Delete failed" }; }
}
