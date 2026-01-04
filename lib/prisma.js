import { PrismaClient } from '@prisma/client';

// Use the standard Prisma client. The Neon "adapter" approach requires the
// `driverAdapters` preview feature, which isn't enabled in this repo and causes
// runtime 500s in API routes.
//
// Prisma will connect via `DATABASE_URL` from the datasource in `schema.prisma`.

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;