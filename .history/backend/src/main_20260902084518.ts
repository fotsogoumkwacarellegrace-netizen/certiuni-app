import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CertiUni backend démarré sur http://localhost:${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/v1/health`);
});

const shutdown = async (signal: string) => {
    console.log(`Signal reçu : ${signal}`);
    server.close(() => {
        console.log('Serveur arrêté proprement.');
        process.exit(0);
    });
};

// Capturer uniquement l'interruption manuelle (Ctrl+C)
process.on('SIGINT', () => shutdown('SIGINT'));

// Désactiver le SIGTERM sous Windows qui cause la fermeture prématurée
if (process.platform !== 'win32') {
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

export default app;