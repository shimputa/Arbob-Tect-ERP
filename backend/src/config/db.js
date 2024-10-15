import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect(); // Connect to the PostgreSQL database
    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.log('DB connection failed --> ', error);
    process.exit(1); // Exit process with failure
  }
};

export { prisma, connectDB };
