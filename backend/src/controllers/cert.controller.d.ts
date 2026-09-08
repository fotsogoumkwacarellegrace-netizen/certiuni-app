import { Request, Response } from 'express';
export declare const issueCertificate: (req: Request, res: Response) => Promise<void>;
export declare const getCertificateById: (req: Request, res: Response) => Promise<void>;
export declare const revokeCertificate: (req: Request, res: Response) => Promise<void>;
