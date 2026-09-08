"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = exports.prisma = void 0;
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
exports.databaseConfig = (0, config_1.registerAs)('database', () => {
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '5432', 10);
    const username = process.env.DB_USERNAME || 'postgres';
    const password = process.env.DB_PASSWORD || 'postgres';
    const database = process.env.DB_NAME || 'certiuni_db';
    const defaultUrl = `postgresql://${username}:${password}@${host}:${port}/${database}?schema=public`;
    return {
        url: process.env.DATABASE_URL || defaultUrl,
        logging: process.env.NODE_ENV === 'development',
        ssl: process.env.DB_SSL === 'true',
        pool: {
            max: parseInt(process.env.DB_POOL_MAX || '20', 10),
            timeout: parseInt(process.env.DB_POOL_TIMEOUT || '30000', 10),
        },
    };
});
//# sourceMappingURL=database.js.map