import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.config';

// Singleton partagé du client Prisma.
// Remplace l'ancien `PrismaService` de NestJS : le client Prisma natif est
// réutilisé dans tous les services/Route Handlers Express du backend.
export const prisma = new PrismaClient(
    env.DATABASE_URL
        ? { datasources: { db: { url: env.DATABASE_URL } } }
        : undefined,
);

export default prisma;
