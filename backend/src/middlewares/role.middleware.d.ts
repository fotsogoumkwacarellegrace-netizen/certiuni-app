import { NextFunction, Request, Response } from 'express';
export declare const authorizeRoles: (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
