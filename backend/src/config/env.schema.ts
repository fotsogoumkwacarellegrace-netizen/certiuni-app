import { z } from 'zod';

const optionalSecret = z.string().min(32).optional();
const optionalString = z.string().trim().min(1).optional();
const optionalPort = z.coerce.number().int().min(1).max(65535).optional();

export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: z.string().optional().refine(
        (value) => value === undefined || /^postgres(?:ql)?:\/\//.test(value),
        'Must be a PostgreSQL connection URL',
    ),
    JWT_ACCESS_SECRET: optionalSecret,
    JWT_REFRESH_SECRET: optionalSecret,
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    ENCRYPTION_KEY: optionalSecret,
    QR_SECRET_KEY: optionalSecret,
    STRIPE_SECRET_KEY: z.string().regex(/^sk_(test|live)_[A-Za-z0-9]+$/).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().regex(/^whsec_[^\s]+$/).optional(),
    STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    SMTP_HOST: optionalString,
    SMTP_PORT: optionalPort,
    SMTP_USER: optionalString,
    SMTP_PASS: optionalString,
    MAIL_FROM: z.string().email().optional(),
    FRONTEND_URL: z.string().default('http://localhost:4200,http://127.0.0.1:4200'),
    APP_URL: z.string().url().optional(),
    PUBLIC_VERIFY_URL: z.string().url().optional(),
    REDIS_URL: z.string().url().optional(),
    REDIS_HOST: optionalString,
    REDIS_PORT: optionalPort,
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.coerce.number().int().min(0).optional(),
    THROTTLE_TTL: z.coerce.number().int().positive().default(60000),
    THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),
    AWS_REGION: optionalString,
    AWS_ACCESS_KEY_ID: optionalString,
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_S3_BUCKET: optionalString,
    AWS_S3_ENDPOINT: z.string().url().optional(),
    SWAGGER_ENABLE: z.preprocess(
        (value) => value === undefined ? true : value === true || value === 'true',
        z.boolean(),
    ),
    SWAGGER_PATH: z.string().default('docs'),
    HEALTH_MEMORY_HEAP_THRESHOLD: z.coerce.number().int().positive().default(300 * 1024 * 1024),
    HEALTH_MEMORY_RSS_THRESHOLD: z.coerce.number().int().positive().default(500 * 1024 * 1024),
    GOOGLE_CLIENT_ID: optionalString,
    GOOGLE_CLIENT_SECRET: optionalSecret,
    APPLE_CLIENT_ID: optionalString,
    APPLE_TEAM_ID: optionalString,
    APPLE_KEY_ID: optionalString,
    APPLE_PRIVATE_KEY: z.string().optional(),
    WEBAUTHN_RP_ID: optionalString,
    WEBAUTHN_RP_NAME: optionalString,
    WEBAUTHN_ORIGIN: z.string().url().optional(),
    SPECIMEN_MODE_ENABLED: z.preprocess(
        (value) => value === undefined ? false : value === true || value === 'true',
        z.boolean(),
    ),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
    const result = envSchema.safeParse(config);
    if (!result.success) {
        const issues = result.error.issues
            .map((issue) => `${issue.path.join('.') || 'environment'}: ${issue.message}`)
            .join('; ');
        throw new Error(`Invalid environment configuration: ${issues}`);
    }

    if (result.data.NODE_ENV === 'production') {
        const requiredKeys: Array<keyof Env> = [
            'DATABASE_URL',
            'JWT_ACCESS_SECRET',
            'JWT_REFRESH_SECRET',
            'ENCRYPTION_KEY',
            'QR_SECRET_KEY',
            'PUBLIC_VERIFY_URL',
            'STRIPE_SECRET_KEY',
            'STRIPE_WEBHOOK_SECRET',
            'APP_URL',
            'FRONTEND_URL',
            'SMTP_HOST',
            'SMTP_PORT',
            'SMTP_USER',
            'SMTP_PASS',
            'MAIL_FROM',
        ];
        const missing = requiredKeys.filter(
            (key) => config[key] === undefined || config[key] === '',
        );
        if (missing.length > 0) {
            throw new Error(`Missing required production configuration: ${missing.join(', ')}`);
        }
    }

    return result.data;
}
