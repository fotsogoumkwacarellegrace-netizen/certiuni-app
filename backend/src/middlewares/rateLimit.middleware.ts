import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';

export const createRateLimiter = (options: { windowInSeconds: number; maxRequests: number }) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const key = `rate-limit:${req.baseUrl}${req.path}:${ip}`;

        try {
            const requests = await redisClient.incr(key);

            if (requests === 1) {
                await redisClient.expire(key, options.windowInSeconds);
            }

            if (requests > options.maxRequests) {
                res.status(429).json({
                    status: 'fail',
                    message: 'Trop de requêtes effectuées. Veuillez réessayer plus tard.',
                });
                return;
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};