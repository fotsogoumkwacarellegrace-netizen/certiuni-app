"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = void 0;
const redis_1 = require("../config/redis");
const createRateLimiter = (options) => {
    return async (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const key = `rate-limit:${req.baseUrl}${req.path}:${ip}`;
        try {
            const requests = await redis_1.redisClient.incr(key);
            if (requests === 1) {
                await redis_1.redisClient.expire(key, options.windowInSeconds);
            }
            if (requests > options.maxRequests) {
                res.status(429).json({
                    status: 'fail',
                    message: 'Trop de requêtes effectuées. Veuillez réessayer plus tard.',
                });
                return;
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.createRateLimiter = createRateLimiter;
//# sourceMappingURL=rateLimit.middleware.js.map