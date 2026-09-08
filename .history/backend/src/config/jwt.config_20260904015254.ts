import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { env } from './env.config';

export default registerAs('jwt', (): JwtModuleOptions => ({
    secret: env.JWT_ACCESS_SECRET,
    signOptions: {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
}));

/**
 * Configuration séparée pour la gestion des Refresh Tokens
 */
export const refreshTokenConfig = {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
};