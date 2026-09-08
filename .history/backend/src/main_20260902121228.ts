import dotenv from 'dotenv';
import app from './app';


dotenv.config();

const PORT = Number(process.env.PORT || 3000);

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CertiUni backend démarré sur http://localhost:${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/v1/health`);
});

// Éviter l'arrêt immédiat si SIGINT survient dans les premières secondes du démarrage
let isReady = false;
setTimeout(() => { isReady = true; }, 3000);

const shutdown = async (signal: string) => {
    if (!isReady) {
        console.log(`[IGNORE] Signal ${signal} reçu trop tôt pendant la phase d'initialisation.`);
        return;
    }
    console.log(`Signal reçu : ${signal}`);
    server.close(() => {
        console.log('Serveur arrêté proprement.');
        process.exit(0);
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));

export default app;