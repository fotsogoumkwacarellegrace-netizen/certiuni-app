"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const env_config_1 = require("./env.config");
const parseRedisUrl = (redisUrl) => {
    try {
        const url = new URL(redisUrl);
        return {
            host: url.hostname || 'localhost',
            port: parseInt(url.port || '6379', 10),
            password: url.password ? decodeURIComponent(url.password) : undefined,
            db: url.pathname ? parseInt(url.pathname.replace('/', '') || '0', 10) : 0,
        };
    }
    catch {
        return {
            host: 'localhost',
            port: 6379,
            password: undefined,
            db: 0,
        };
    }
};
const parsedUrl = parseRedisUrl(env_config_1.env.REDIS_URL);
exports.default = (0, config_1.registerAs)('redis', () => ({
    url: env_config_1.env.REDIS_URL,
    host: parsedUrl.host,
    port: parsedUrl.port,
    password: parsedUrl.password,
    db: parsedUrl.db,
    keyPrefix: 'certiuni:',
    retryStrategy: (times) => {
        const delay = Math.min(times * 100, 3000);
        return delay;
    },
}));
//# sourceMappingURL=redis.config.js.map