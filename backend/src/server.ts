import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CertiUni backend démarré sur http://localhost:${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/v1/health`);
});

const shutdown = async () => {
    server.close(() => {
        console.log('Serveur arrêté proprement.');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
