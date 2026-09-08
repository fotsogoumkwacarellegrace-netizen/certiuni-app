export declare function generateSha256(data: string | object | Buffer): string;
export declare function generateHmacSha256(payload: string, secret: string): string;
export declare function generateRandomSalt(length?: number): string;
export declare function verifySha256(data: string | object | Buffer, expectedHash: string): boolean;
