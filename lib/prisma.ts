import { PrismaClient } from '@prisma/client';

// Ensure that Prisma Client is only instantiated once to avoid unnecessary connections
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
