import { Response } from 'express';
export interface ApiResponse<T = any> {
    status: 'success' | 'fail' | 'error';
    message?: string;
    data?: T;
    errors?: any[];
    timestamp: string;
    path?: string;
}
export declare const formatSuccessResponse: <T>(data: T, message?: string) => ApiResponse<T>;
export declare const formatErrorResponse: (message: string, errors?: any[], statusCode?: number) => ApiResponse;
export declare const sendSuccessResponse: <T>(res: Response, statusCode: number, data: T, message?: string) => Response<any, Record<string, any>>;
export declare const sendErrorResponse: (res: Response, statusCode: number, message: string, errors?: any[]) => Response<any, Record<string, any>>;
