import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Env, validateEnv } from './env.schema';

dotenv.config();

export { envSchema, validateEnv } from './env.schema';
export type { Env } from './env.schema';

export const env: Env = validateEnv(process.env);

export function requireJwtAccessSecret(): string {
    if (!env.JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not configured');
    }
    return env.JWT_ACCESS_SECRET;
}

export function requireJwtRefreshSecret(): string {
    if (!env.JWT_REFRESH_SECRET) {
        throw new Error('JWT_REFRESH_SECRET is not configured');
    }
    return env.JWT_REFRESH_SECRET;
}

export default registerAs('app', () => env);
