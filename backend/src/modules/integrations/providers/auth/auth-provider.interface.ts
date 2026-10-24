import { LoginDto } from '../../../auth/dto/login.dto';

export interface AuthProvider {
    readonly configured: boolean;
    login(input: LoginDto): Promise<unknown>;
    refreshToken(refreshToken: string): Promise<unknown>;
    logout(userId: string): Promise<{ success: boolean }>;
}
