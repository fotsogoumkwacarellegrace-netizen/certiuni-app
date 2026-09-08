import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
    url: string;
    logging: boolean;
    ssl: boolean;
    pool: {
        max: number;
        timeout: number;
    };
}

export default registerAs(
    'database',
    (): DatabaseConfig => {
        // Reconstruction de la chaîne de connexion PostgreSQL si DATABASE_URL n'est pas explicite
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
    },
);