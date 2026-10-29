import Redis from 'ioredis';
import { env } from './env.config';

/**
 * Client Redis singleton partagé par les files d'attente (BullMQ),
 * le middleware de rate-limiting et le service d'authentification.
 */
const redisClient = new Redis({
    host: env.REDIS_HOST || 'localhost',
    port: env.REDIS_PORT || 6379,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB ?? 0,
    maxRetriesPerRequest: null,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 100, 3000);
        return delay;
    },
});

export { redisClient };
export default redisClient;