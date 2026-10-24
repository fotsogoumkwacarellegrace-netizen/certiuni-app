import app from './app';
import logger from './common/utils/logger.util';
import { env } from './config/env.config';

const PORT = env.PORT;

const server = app.listen(PORT, '0.0.0.0', () => {
    logger.log(
        `CertiUni backend demarre sur http://localhost:${PORT}`,
        'ServerBootstrap',
        { port: PORT, environment: env.NODE_ENV },
    );
    logger.log(`Health check: http://localhost:${PORT}/api/v1/health`, 'ServerBootstrap');
});

const shutdown = async () => {
    logger.log('Arret du serveur en cours...', 'ServerBootstrap');
    server.close(() => {
        logger.log('Serveur arrete proprement.', 'ServerBootstrap');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
