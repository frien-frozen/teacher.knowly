'use server'
import prisma from '@/lib/prisma';
import Papa from 'papaparse';

export async function importSubjectSyllabus(subjectId: string, csvText: string) {
  try {
    if (!subjectId || typeof subjectId !== 'string') return { success: false, message: "Invalid subject ID." };
    if (!csvText || typeof csvText !== 'string' || csvText.length > 5 * 1024 * 1024) {
      return { success: false, message: "Invalid CSV payload or file too large." };
    }

    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const rows = parsed.data as any[];

    if (rows.length === 0) return { success: false, message: "CSV is empty." };

    if (!process.env.ADMIN_EMAIL) return { success: false, message: "Server misconfiguration: No admin email set." };
    const admin = await prisma.teacher.findUnique({ where: { email: process.env.ADMIN_EMAIL } });
    if (!admin) return { success: false, message: "Admin account missing." };

    let topicsAdded = 0;

    for (const row of rows) {
      const unitTitle = row['Unit']?.trim();
      const topicTitle = row['Topic']?.trim();

      if (!unitTitle || !topicTitle) continue;

      let unit = await prisma.unit.findFirst({ where: { title: unitTitle, subjectId } });
      if (!unit) {
        unit = await prisma.unit.create({ data: { title: unitTitle, subjectId, teacherId: admin.id } });
      }

      const existingTopic = await prisma.topic.findFirst({ where: { title: topicTitle, unitId: unit.id } });
      if (!existingTopic) {
        await prisma.topic.create({ data: { title: topicTitle, unitId: unit.id, teacherId: admin.id } });
        topicsAdded++;
      }
    }

    return { success: true, message: `Successfully imported ${topicsAdded} topics!` };
  } catch (error: any) {
    console.error("Import Error:", error);
    return { success: false, message: "Import failed. Check CSV format." };
  }
}
