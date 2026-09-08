import Redis from 'ioredis';
import { env } from './env';

export const redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null, // Requis par BullMQ
    enableReadyCheck: false,
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis connected.'));