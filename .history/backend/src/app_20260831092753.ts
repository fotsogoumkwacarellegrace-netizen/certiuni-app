import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import healthRouter from './routes/health.router';
import authRouter from './routes/V1/auth.router';
import certRoutes from './routes/V1/cert.routes';
import verifyRoutes from './routes/V1/verify.router';
import batchRoutes from './routes/V1/batch.router';
import { globalErrorHandler } from './middlewares/error.middleware';
import { NotFoundError } from './errors/app.error';

dotenv.config();

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({
        name: 'CertiUni API',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/v1', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/certificates', certRoutes);
app.use('/api/v1/verify', verifyRoutes);
app.use('/api/v1/batch', batchRoutes);

// Catch-all pour les routes non trouvées (DOIT être après toutes les autres routes)
app.all(/^\/?.*/, (req, res, next) => {
    next(new NotFoundError(`La route ${req.originalUrl} n'existe pas.`));
});

app.use(globalErrorHandler);

export default app;
