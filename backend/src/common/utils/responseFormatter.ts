import { Response } from 'express';

export interface ApiResponse<T = any> {
    status: 'success' | 'fail' | 'error';
    message?: string;
    data?: T;
    errors?: any[];
    timestamp: string;
    path?: string;
}

export const formatSuccessResponse = <T>(data: T, message = 'Success'): ApiResponse<T> => {
    return {
        status: 'success',
        message,
        data,
        timestamp: new Date().toISOString(),
    };
};

export const formatErrorResponse = (message: string, errors?: any[], statusCode = 400): ApiResponse => {
    return {
        status: statusCode >= 500 ? 'error' : 'fail',
        message,
        errors,
        timestamp: new Date().toISOString(),
    };
};

export const sendSuccessResponse = <T>(res: Response, statusCode: number, data: T, message = 'Success') => {
    return res.status(statusCode).json(formatSuccessResponse(data, message));
};

export const sendErrorResponse = (res: Response, statusCode: number, message: string, errors?: any[]) => {
    return res.status(statusCode).json(formatErrorResponse(message, errors, statusCode));
};
