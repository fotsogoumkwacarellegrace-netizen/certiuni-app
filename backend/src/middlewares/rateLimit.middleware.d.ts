import { Request, Response, NextFunction } from 'express';
export declare const createRateLimiter: (options: {
    windowInSeconds: number;
    maxRequests: number;
}) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
