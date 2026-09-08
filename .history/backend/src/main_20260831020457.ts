import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { globalErrorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/app.error';

// Routes V1
import authRoutes from './routes/v1/auth.routes';
import certRoutes from './routes/v1/cert.routes';
import verifyRoutes from './routes/v1/verify.routes';
import healthRoutes from './routes/health.routes';

const app: Application = express();

// Middlewares de Sécurité & Core
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Endpoints
app.use('/healthcheck', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/certificates', certRoutes);
app.use('/api/v1/verify', verifyRoutes);

// Interception des routes introuvables (404)
app.all('*', (req, res, next) => {
    next(new NotFoundError(`Ressource non trouvée sur ${req.originalUrl}`));
});

// Middleware d'Erreur Global (Obligatoirement en dernier)
app.use(globalErrorHandler);

export default app;

// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// // Route de test simple
// app.get('/api/v1/health', (req, res) => {
//     res.json({ status: 'OK', message: 'Le serveur Express CertiUni est opérationnel !' });
// });

// app.listen(PORT, () => {
//     console.log(`🚀 Le backend Express tourne sur : http://localhost:${PORT}/api/v1`);
// });