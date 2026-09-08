import { registerAs } from '@nestjs/config';
import { env } from './env.config';
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export interface RedisConfigOptions {
    url: string;
    host: string;
    port: number;
    password?: string;
    db: number;
    keyPrefix: string;
    retryStrategy: (times: number) => number | null;
}

/**
 * Extraction des paramètres individuels à partir de REDIS_URL
 */
const parseRedisUrl = (redisUrl: string) => {
    try {
        const url = new URL(redisUrl);
        return {
            host: url.hostname || 'localhost',
            port: parseInt(url.port || '6379', 10),
            password: url.password ? decodeURIComponent(url.password) : undefined,
            db: url.pathname ? parseInt(url.pathname.replace('/', '') || '0', 10) : 0,
        };
    } catch {
        return {
            host: 'localhost',
            port: 6379,
            db: 0,
        };
    }
};

const parsedUrl = parseRedisUrl(env.REDIS_URL);

export default registerAs(
    'redis',
    (): RedisConfigOptions => ({
        url: env.REDIS_URL,
        host: parsedUrl.host,
        port: parsedUrl.port,
        password: parsedUrl.password,
        db: parsedUrl.db,
        keyPrefix: 'certiuni:',

        // Stratégie de reconnexion automatique avec backoff exponentiel
        retryStrategy: (times: number) => {
            const delay = Math.min(times * 100, 3000);
            return delay;
        },
    }),
);