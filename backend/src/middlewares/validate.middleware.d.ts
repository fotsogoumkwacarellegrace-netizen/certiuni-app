import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
export interface ValidationTargets {
    body?: AnyZodObject;
    query?: AnyZodObject;
    params?: AnyZodObject;
}
export declare const validateRequest: (targetSchema: AnyZodObject | ValidationTargets) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
