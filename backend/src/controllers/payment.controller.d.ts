import { Request, Response } from 'express';
export declare const processPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPaymentHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPaymentReceipt: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
