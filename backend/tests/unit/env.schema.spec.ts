import { validateEnv } from '../../src/config/env.schema';

describe('production environment validation', () => {
    const baseProductionConfig = {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
        JWT_ACCESS_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        ENCRYPTION_KEY: 'c'.repeat(32),
        QR_SECRET_KEY: 'd'.repeat(32),
        PUBLIC_VERIFY_URL: 'https://verify.example.test',
        STRIPE_SECRET_KEY: `sk_test_${'e'.repeat(24)}`,
        STRIPE_WEBHOOK_SECRET: `whsec_${'f'.repeat(24)}`,
        APP_URL: 'https://api.example.test',
        SMTP_HOST: 'smtp.example.test',
        SMTP_PORT: '587',
        SMTP_USER: 'test-user',
        SMTP_PASS: 'test-password',
        MAIL_FROM: 'notifications@example.test',
    };

    it('rejects a development fallback for a required production variable', () => {
        expect(() => validateEnv(baseProductionConfig)).toThrow(
            'Missing required production configuration: FRONTEND_URL',
        );
    });

    it('accepts the required production configuration when explicitly provided', () => {
        expect(() => validateEnv({
            ...baseProductionConfig,
            FRONTEND_URL: 'https://app.example.test',
        })).not.toThrow();
    });
});
