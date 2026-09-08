import { Request, Response } from 'express';
export declare const reportSuspiciousActivity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSuspiciousLogs: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const blockIpAddress: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
