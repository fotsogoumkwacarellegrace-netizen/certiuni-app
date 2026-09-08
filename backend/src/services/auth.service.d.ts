import Redis from 'ioredis';
export declare class AuthService {
    private readonly redisClient;
    constructor(redisClient: Redis);
    static generateTokens(payload: {
        id: string;
        email: string;
        role: string;
        universityId?: string | null;
    }): {
        accessToken: string;
        refreshToken: string;
    };
    storeRefreshToken(userId: string, refreshToken: string): Promise<void>;
    revokeRefreshToken(userId: string): Promise<void>;
}
