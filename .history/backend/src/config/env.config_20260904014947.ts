import { registerAs } from '@nestjs/config';
import { z } from 'zod';
import * as dotenv from 'dotenv';

// Chargement des variables d'environnement depuis le fichier .env
dotenv.config();

// Définition du schéma Zod
export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/certiuni_dev'),
    REDIS_URL: z.string().default('redis://localhost:6379'),

    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    MAIL_FROM: z.string().optional(),
    FRONTEND_URL: z.string().optional(),

    AWS_REGION: z.string().default('eu-west-3'),
    AWS_ACCESS_KEY_ID: z.string().default(''),
    AWS_SECRET_ACCESS_KEY: z.string().default(''),
    AWS_S3_BUCKET: z.string().default('certiuni-dev-bucket'),
    S3_ENDPOINT: z.string().optional(),

    JWT_ACCESS_SECRET: z.string().default('certiuni_access_secret_dev_2026_123456'),
    JWT_REFRESH_SECRET: z.string().default('certiuni_refresh_secret_dev_2026_123456'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

// Inférence du type à partir du schéma Zod
export type Env = z.infer<typeof envSchema>;

// Fonction de parsing sécurisée avec affichage clair des erreurs Zod
const parseEnv = (): Env => {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error('❌ Configuration des variables d\'environnement invalide :');
        console.error(JSON.stringify(result.error.format(), null, 2));
        throw new Error('Variables d\'environnement non conformes au schéma Zod.');
    }

    return result.data;
};

// Exportation de l'objet parsé
export const env = parseEnv();

// Configuration NestJS réutilisable via ConfigService
export default registerAs('app', () => env);