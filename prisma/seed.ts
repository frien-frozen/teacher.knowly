import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is missing. Check your .env file.");

const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Flushing database (respecting FK constraints)...');
  
  // Delete in correct order: children first, parents last
  await prisma.topic.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.teacher.deleteMany({});
  
  console.log('Generating secure Admin account...');
  const hashedPassword = await bcrypt.hash('password1234', 10);

  await prisma.teacher.create({
    data: {
      name: 'Knowly Admin',
      email: 'ismatullohbakh2010@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
      isVerified: true,
    }
  });

  console.log('✅ Database flushed and Admin successfully seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
