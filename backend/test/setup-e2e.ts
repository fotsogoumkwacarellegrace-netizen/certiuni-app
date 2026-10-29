/**
 * Setup global pour les tests e2e (Jest).
 *
 * - Force l'environnement "test" AVANT tout import de code applicatif.
 * - Fournit des valeurs d'env par défaut pour que la bootstrap NestJS
 *   (config validation, JWT, Prisma) n'échoue jamais en CI sans secrets.
 * - Désactive les logs applicatifs bruyants pendant les tests.
 */
import { randomBytes } from 'crypto';

process.env.NODE_ENV = 'test';

process.env.NEST_APP_PORT = process.env.NEST_APP_PORT || '3001';
process.env.PORT = process.env.PORT || '3001';

process.env.JWT_ACCESS_SECRET ??= randomBytes(48).toString('hex');
process.env.JWT_REFRESH_SECRET ??= randomBytes(48).toString('hex');

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/certiuni_test';
process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
process.env.REDIS_PORT = process.env.REDIS_PORT || '6379';

process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'error';

// Les warnings Prisma en mode test polluent la sortie Jest.
process.env.PRISMA_LOG_LEVEL = 'error';

// Seuils mémoire du /health en octets : on les neutralise pour les tests
// (les workers Jest/Windows dépassent largement les seuils 300/500 MB prod).
process.env.HEALTH_MEMORY_HEAP_THRESHOLD = '999999999999';
process.env.HEALTH_MEMORY_RSS_THRESHOLD = '999999999999';

// Timeout global generous pour CI sous Windows.
jest.setTimeout(30000);
