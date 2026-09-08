import { Request, Response, NextFunction } from 'express';
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
export declare const catchAsync: (fn: AsyncController) => (req: Request, res: Response, next: NextFunction) => void;
export {};
