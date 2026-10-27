import Redis from 'ioredis';
import { env } from './env.config';

/**
 * Client Redis singleton partagé par les files d'attente (BullMQ),
 * le middleware de rate-limiting et le service d'authentification.
 */
const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB || 0),
    maxRetriesPerRequest: null,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 100, 3000);
        return delay;
    },
});

export { redisClient };
export default redisClient;