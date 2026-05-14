// src/util/prisma.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({ log: ['error'] });
}

export default globalForPrisma.prisma;
