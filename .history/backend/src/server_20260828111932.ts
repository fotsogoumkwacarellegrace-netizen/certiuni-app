import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/v1/auth.routes';
import certRoutes from './routes/v1/cert.routes';
import verifyRoutes from './routes/v1/verify.routes';
import batchRoutes from './routes/v1/batch.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Route Health Check
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Montage des routes v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/certificates', certRoutes);
app.use('/api/v1/verify', verifyRoutes);
app.use('/api/v1/certificates', batchRoutes);

// Démarrage de l'écoute
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Serveur CertiUni démarré sur : http://localhost:${PORT}`);
    console.log(`📊 Health check disponible sur : http://localhost:${PORT}/api/v1/health`);
});
// import express, { Express, Request, Response, NextFunction } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
// import { PrismaClient } from '@prisma/client';
// import { authRoutes } from './routes/v1/auth.routes'; // ✅ Chemin correct
// // Charger les variables d'environnement
// dotenv.config();

// // Initialisation de Prisma et d'Express
// export const prisma = new PrismaClient();
// const app: Express = express();
// const PORT = process.env.PORT || 3000;

// // ==========================================
// // Middlewares Sécurité & Configuration
// // ==========================================

// // En-têtes de sécurité Helmet
// app.use(helmet());

// // Montage du routeur d'authentification
// app.use('/api/v1/auth', authRouter);

// // Configuration de CORS (à ajuster selon le domaine du frontend)
// app.use(
//     cors({
//         origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//         credentials: true,
//         methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//         allowedHeaders: ['Content-Type', 'Authorization'],
//     })
// );

// // Parsing des requêtes
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // ==========================================
// // Routes d'API
// // ==========================================

// // Health Check / Vérification de statut
// app.get('/api/v1/health', async (req: Request, res: Response) => {
//     try {
//         // Vérification de la connexion à la base de données
//         await prisma.$queryRaw`SELECT 1`;
//         res.status(200).json({
//             status: 'success',
//             message: 'Le serveur Express CertiUni et la base de données sont opérationnels !',
//             timestamp: new Date().toISOString(),
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: 'Erreur de connexion à la base de données Prisma',
//             error: (error as Error).message,
//         });
//     }
// });

// // TODO: Importer et monter vos routeurs d'authentification et de diplômes ici :
// // import authRouter from './routes/auth.router';
// // app.use('/api/v1/auth', authRouter);

// // Gestion de route non trouvée (404)
// app.use((req: Request, res: Response) => {
//     res.status(404).json({
//         status: 'fail',
//         message: `La route ${req.originalUrl} n'existe pas sur ce serveur.`,
//     });
// });

// // Middleware global de gestion d'erreurs
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(' Erreur globale :', err.stack);
//     res.status(500).json({
//         status: 'error',
//         message: 'Une erreur interne du serveur est survenue.',
//         error: process.env.NODE_ENV === 'development' ? err.message : undefined,
//     });
// });

// // ==========================================
// // Démarrage du Serveur & Fermeture Propre
// // ==========================================

// const server = app.listen(PORT, () => {
//     console.log(`🚀 Serveur CertiUni démarré sur : http://localhost:${PORT}`);
//     console.log(`📊 Health check disponible sur : http://localhost:${PORT}/api/v1/health`);
// });

// // Fermeture propre de la connexion Prisma à l'arrêt du processus
// const gracefulShutdown = async (signal: string) => {
//     console.log(`\n Signal ${signal} reçu. Fermeture du serveur Express et déconnexion Prisma...`);
//     server.close(async () => {
//         await prisma.$disconnect();
//         console.log(' Contexte nettoyé. Serveur arrêté avec succès.');
//         process.exit(0);
//     });
// };

// process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// export default app;