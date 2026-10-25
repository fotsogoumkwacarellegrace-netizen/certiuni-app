import express, { Application, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

// Middlewares et gestion des erreurs
import { globalErrorHandler } from './middlewares/error.middleware';
import { correlationIdMiddleware } from './middlewares/correlationId.middleware';
import { requestLoggingMiddleware } from './middlewares/requestLogging.middleware';
import { NotFoundError } from './errors/app.error';
import { env } from './config/env.config';

// Routeurs API (Express)
import healthRouter from './routes/health.router';
import authRouter from './routes/V1/auth.router';
import certificatesRouter from './routes/V1/certificates.router';
import batchRouter from './routes/V1/batch.router';
import verifyRouter from './routes/V1/verify.router';
import paymentRouter from './routes/V1/payment.router';
import universityRouter from './routes/V1/university.router';
import securityRouter from './routes/V1/security.router';

const app: Application = express();

// 1. Middlewares de securite (Security Headers via Helmet)
app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: { policy: 'same-origin' },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                imgSrc: ["'self'", 'data:', 'https:', 'http:'],
                connectSrc: ["'self'"],
                frameAncestors: ["'none'"],
            },
        },
        referrerPolicy: { policy: 'no-referrer' },
        xssFilter: true,
        hidePoweredBy: true,
    }),
);

app.use(
    cors({
        origin: env.FRONTEND_URL.split(',').map((origin) => origin.trim()),
        credentials: true,
    }),
);

// 2. Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 3. Rate Limiting Global (anti-DDoS)
const globalRateLimiter = rateLimit({
    windowMs: 60_000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'fail', message: 'Trop de requetes. Veuillez reessayer plus tard.' },
});
app.use(globalRateLimiter);

// Rate limiting strict pour l'authentification (anti-brute-force)
const authRateLimiter = rateLimit({
    windowMs: 15 * 60_000,
    max: 40,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => req.ip || 'unknown',
    message: {
        status: 'fail',
        message: 'Trop de tentatives de connexion. Reessayez dans 15 minutes.',
    },
});

// 4. Middlewares d'observabilite (Correlation ID + Request Logging)
app.use(correlationIdMiddleware);
app.use(requestLoggingMiddleware);

// Route racine d'information
app.get('/', (_req, res) => {
    res.status(200).json({
        name: 'CertiUni API',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// 5. Enregistrement des routes API (/api/v1)
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRateLimiter, authRouter);
app.use('/api/v1/certificates', certificatesRouter);
app.use('/api/v1/certificates', batchRouter);
app.use('/api/v1/verify', verifyRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/universities', universityRouter);
app.use('/api/v1/security', securityRouter);

// Catch-all pour les routes non trouvees
app.all(/^.*$/, (req: express.Request, _res: express.Response, next: NextFunction) => {
    next(new NotFoundError(`La route ${req.originalUrl} n'existe pas.`));
});

// Middleware global de gestion des erreurs
app.use(globalErrorHandler);

export default app;
