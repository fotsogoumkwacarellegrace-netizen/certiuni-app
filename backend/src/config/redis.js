"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redisClient = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB || 0),
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
        const delay = Math.min(times * 100, 3000);
        return delay;
    },
});
exports.redisClient = redisClient;
exports.default = redisClient;
//# sourceMappingURL=redis.js.map