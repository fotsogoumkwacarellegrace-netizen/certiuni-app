import { NextFunction, Request, Response } from 'express';
export declare const globalErrorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
