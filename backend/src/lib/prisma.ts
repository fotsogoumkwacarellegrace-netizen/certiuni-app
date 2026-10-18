import { PrismaClient } from '@prisma/client';

// Singleton partagé du client Prisma.
// Remplace l'ancien `PrismaService` de NestJS : le client Prisma natif est
// réutilisé dans tous les services/Route Handlers Express du backend.
export const prisma = new PrismaClient();

export default prisma;
