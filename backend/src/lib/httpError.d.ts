export declare class HttpError extends Error {
    readonly status: number;
    readonly code: string;
    constructor(status: number, code: string, message: string);
}
export declare const Errors: {
    notFound(message?: string): HttpError;
    forbidden(message?: string): HttpError;
    badRequest(message?: string, code?: string): HttpError;
    conflict(message?: string, code?: string): HttpError;
    unauthorized(message?: string): HttpError;
    internal(message?: string): HttpError;
};
