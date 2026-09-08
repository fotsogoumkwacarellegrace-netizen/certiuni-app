import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
    'database',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'certiuni_db',

        // Chargement automatique des entités NestJS
        autoLoadEntities: true,

        // Chemin vers les entités si autoLoadEntities n'est pas utilisé
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],

        // Synchronisation du schéma en dev uniquement (JAMAIS en production)
        synchronize: process.env.NODE_ENV !== 'production',

        // Gestion des migrations
        migrationsRun: process.env.NODE_ENV === 'production',
        migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],

        // Logging SQL en environnement de développement
        logging: process.env.NODE_ENV === 'development',

        // SSL activé en production (ex: AWS RDS, Heroku, Supabase)
        ssl:
            process.env.DB_SSL === 'true'
                ? {
                    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
                }
                : false,

        // Configuration du pool de connexions
        extra: {
            max: parseInt(process.env.DB_POOL_MAX || '20', 10),
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        },
    }),
);