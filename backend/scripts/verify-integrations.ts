import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as QRCode from 'qrcode';
import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { envSchema } from '../src/config/env.schema';

dotenv.config();

type CheckState = 'ready' | 'invalid' | 'not_configured';

let failed = false;

function invalidKeys(keys: Array<keyof typeof envSchema.shape>): string[] {
    return keys.filter((key) => {
        const value = process.env[key];
        return value !== undefined && value !== '' &&
            !envSchema.shape[key].safeParse(value).success;
    });
}

function missingKeys(keys: Array<keyof typeof envSchema.shape>): string[] {
    return keys.filter((key) => {
        const value = process.env[key];
        return value === undefined || value === '';
    });
}

function safeErrorCode(error: unknown): string | undefined {
    if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof error.code === 'string' &&
        /^[A-Z0-9_]+$/.test(error.code)
    ) {
        return error.code;
    }
    return undefined;
}

async function check(
    name: string,
    state: CheckState,
    operation: () => Promise<void>,
    required = true,
    invalidConfiguration: string[] = [],
    missingConfiguration: string[] = [],
): Promise<void> {
    if (state === 'not_configured') {
        const detail = missingConfiguration.length > 0
            ? ` (absente: ${missingConfiguration.join(', ')})`
            : '';
        console.log(`${name}: NON CONFIGURÉ${detail}`);
        failed ||= required;
        return;
    }
    if (state === 'invalid') {
        const details = [
            invalidConfiguration.length > 0
                ? `configuration invalide: ${invalidConfiguration.join(', ')}`
                : '',
            missingConfiguration.length > 0
                ? `absente: ${missingConfiguration.join(', ')}`
                : '',
        ].filter(Boolean);
        console.log(`${name}: ÉCHEC${details.length > 0 ? ` (${details.join('; ')})` : ''}`);
        failed = true;
        return;
    }

    try {
        await operation();
        console.log(`${name}: OK`);
    } catch (error) {
        const code = safeErrorCode(error);
        console.log(`${name}: ÉCHEC${code ? ` (${code})` : ''}`);
        failed = true;
    }
}

function stateFor(
    valid: boolean,
    configured: boolean,
): CheckState {
    return !valid ? 'invalid' : configured ? 'ready' : 'not_configured';
}

async function main(): Promise<void> {
    const databaseConfig = envSchema.pick({ DATABASE_URL: true }).safeParse(process.env);
    const databaseUrl = databaseConfig.success ? databaseConfig.data.DATABASE_URL : undefined;
    await check(
        'PostgreSQL + transactions',
        stateFor(databaseConfig.success, Boolean(databaseUrl)),
        async () => {
            const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl! } } });
            try {
                await prisma.$connect();
                await prisma.$queryRaw`SELECT 1`;
                await prisma.$transaction((transaction) => transaction.$queryRaw`SELECT 1`);
            } finally {
                await prisma.$disconnect();
            }
        },
        true,
        invalidKeys(['DATABASE_URL']),
        missingKeys(['DATABASE_URL']),
    );

    const jwtConfig = envSchema.pick({
        JWT_ACCESS_SECRET: true,
        JWT_REFRESH_SECRET: true,
    }).safeParse(process.env);
    const accessSecret = jwtConfig.success ? jwtConfig.data.JWT_ACCESS_SECRET : undefined;
    const refreshSecret = jwtConfig.success ? jwtConfig.data.JWT_REFRESH_SECRET : undefined;
    await check(
        'JWT',
        stateFor(jwtConfig.success, Boolean(accessSecret && refreshSecret)),
        async () => {
            const token = jwt.sign({ sub: 'integration-check' }, accessSecret!, { expiresIn: '1m' });
            const payload = jwt.verify(token, accessSecret!) as jwt.JwtPayload;
            if (payload.sub !== 'integration-check') {
                throw new Error('JWT round trip failed');
            }
            const refresh = jwt.sign({ sub: 'integration-check' }, refreshSecret!, { expiresIn: '1m' });
            jwt.verify(refresh, refreshSecret!);
        },
        true,
        invalidKeys(['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']),
        missingKeys(['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']),
    );

    const qrConfig = envSchema.pick({
        QR_SECRET_KEY: true,
        PUBLIC_VERIFY_URL: true,
    }).safeParse(process.env);
    const qrSecret = qrConfig.success ? qrConfig.data.QR_SECRET_KEY : undefined;
    const verifyUrl = qrConfig.success ? qrConfig.data.PUBLIC_VERIFY_URL : undefined;
    await check(
        'QR',
        stateFor(qrConfig.success, Boolean(qrSecret && verifyUrl)),
        async () => {
            const identifier = `VERIFY-${Date.now()}`;
            const signature = createHmac('sha256', qrSecret!)
                .update(`certiuni:certificate-qr:v1:${identifier}`)
                .digest('hex');
            const expected = createHmac('sha256', qrSecret!)
                .update(`certiuni:certificate-qr:v1:${identifier}`)
                .digest();
            const received = Buffer.from(signature, 'hex');
            if (!timingSafeEqual(expected, received)) {
                throw new Error('QR signature verification failed');
            }
            const png = await QRCode.toBuffer(
                `${verifyUrl!.replace(/\/+$/, '')}/${identifier}?signature=${signature}`,
                { type: 'png' },
            );
            if (png.length === 0) {
                throw new Error('QR code generation failed');
            }
        },
        true,
        invalidKeys(['QR_SECRET_KEY', 'PUBLIC_VERIFY_URL']),
        missingKeys(['QR_SECRET_KEY', 'PUBLIC_VERIFY_URL']),
    );

    const stripeConfig = envSchema.pick({
        STRIPE_SECRET_KEY: true,
        STRIPE_WEBHOOK_SECRET: true,
        APP_URL: true,
    }).safeParse(process.env);
    const stripeSecretResult = envSchema.shape.STRIPE_SECRET_KEY.safeParse(
        process.env.STRIPE_SECRET_KEY,
    );
    const stripeSecret = stripeSecretResult.success ? stripeSecretResult.data : undefined;
    const stripeWebhookSecret = stripeConfig.success ? stripeConfig.data.STRIPE_WEBHOOK_SECRET : undefined;
    const appUrl = stripeConfig.success ? stripeConfig.data.APP_URL : undefined;
    const isStripeTestMode = Boolean(stripeSecret?.startsWith('sk_test_'));
    await check(
        `Stripe (${stripeSecret ? (isStripeTestMode ? 'test' : 'live') : 'unconfigured'})`,
        stateFor(
            stripeConfig.success,
            Boolean(stripeSecret && stripeWebhookSecret && appUrl && isStripeTestMode),
        ),
        async () => {
            const stripe = new Stripe(stripeSecret!);
            await stripe.balance.retrieve();
            const session = await stripe.checkout.sessions.create(
                {
                    mode: 'payment',
                    line_items: [{
                        price_data: {
                            currency: 'xaf',
                            product_data: { name: 'Integration verification' },
                            unit_amount: 1000,
                        },
                        quantity: 1,
                    }],
                    success_url: `${appUrl}/integration-check`,
                    cancel_url: `${appUrl}/integration-check`,
                },
                { idempotencyKey: `integration-check-${randomUUID()}` },
            );
            if (!session.url) {
                throw new Error('Stripe did not return a Checkout URL');
            }
            if (session.status === 'open') {
                await stripe.checkout.sessions.expire(session.id);
            }
        },
        true,
        invalidKeys(['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'APP_URL']),
        missingKeys(['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'APP_URL']),
    );

    const smtpConfig = envSchema.pick({
        SMTP_HOST: true,
        SMTP_PORT: true,
        SMTP_USER: true,
        SMTP_PASS: true,
        MAIL_FROM: true,
    }).safeParse(process.env);
    const smtp = smtpConfig.success ? smtpConfig.data : undefined;
    const smtpConfigured = Boolean(
        smtp?.SMTP_HOST &&
        smtp.SMTP_PORT &&
        smtp.SMTP_USER &&
        smtp.SMTP_PASS &&
        smtp.MAIL_FROM,
    );
    await check('SMTP', stateFor(smtpConfig.success, smtpConfigured), async () => {
        const transporter = nodemailer.createTransport({
            host: smtp!.SMTP_HOST,
            port: smtp!.SMTP_PORT,
            secure: smtp!.SMTP_PORT === 465,
            auth: { user: smtp!.SMTP_USER, pass: smtp!.SMTP_PASS },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 20000,
        });
        try {
            await transporter.verify();
        } finally {
            transporter.close();
        }
    }, true,
    invalidKeys(['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM']),
    missingKeys(['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM']));

    const storageConfig = envSchema.pick({
        AWS_REGION: true,
        AWS_ACCESS_KEY_ID: true,
        AWS_SECRET_ACCESS_KEY: true,
        AWS_S3_BUCKET: true,
        AWS_S3_ENDPOINT: true,
    }).safeParse(process.env);
    const storage = storageConfig.success ? storageConfig.data : undefined;
    const storageConfigured = Boolean(
        storage?.AWS_REGION &&
        storage.AWS_ACCESS_KEY_ID &&
        storage.AWS_SECRET_ACCESS_KEY &&
        storage.AWS_S3_BUCKET,
    );
    await check(
        'S3 storage',
        stateFor(storageConfig.success, storageConfigured),
        async () => {
            const client = new S3Client({
                region: storage!.AWS_REGION!,
                endpoint: storage!.AWS_S3_ENDPOINT,
                forcePathStyle: Boolean(storage!.AWS_S3_ENDPOINT),
                credentials: {
                    accessKeyId: storage!.AWS_ACCESS_KEY_ID!,
                    secretAccessKey: storage!.AWS_SECRET_ACCESS_KEY!,
                },
            });
            try {
                await client.send(new HeadBucketCommand({ Bucket: storage!.AWS_S3_BUCKET! }));
            } finally {
                client.destroy();
            }
        },
        false,
        invalidKeys([
            'AWS_REGION',
            'AWS_ACCESS_KEY_ID',
            'AWS_SECRET_ACCESS_KEY',
            'AWS_S3_BUCKET',
            'AWS_S3_ENDPOINT',
        ]),
        missingKeys([
            'AWS_REGION',
            'AWS_ACCESS_KEY_ID',
            'AWS_SECRET_ACCESS_KEY',
            'AWS_S3_BUCKET',
        ]),
    );
}

main()
    .catch(() => {
        console.log('Vérification des intégrations: ÉCHEC');
        failed = true;
    })
    .finally(() => {
        process.exitCode = failed ? 1 : 0;
    });
