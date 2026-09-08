import { PrismaClient } from '@prisma/client';
export interface DatabaseConfig {
    url: string;
    logging: boolean;
    ssl: boolean;
    pool: {
        max: number;
        timeout: number;
    };
}
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const databaseConfig: (() => DatabaseConfig) & import("@nestjs/config").ConfigFactoryKeyHost<DatabaseConfig>;
