import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { env } from './env.config';

export interface JwtConfigOptions {
    access: JwtModuleOptions;
    refresh: {
        secret: string;
        expiresIn: string;
    };
}

export default registerAs(
    'jwt',
    (): JwtConfigOptions => ({
        access: {
            secret: env.JWT_ACCESS_SECRET,
            signOptions: {
                expiresIn: env.JWT_ACCESS_EXPIRES_IN,
            },
        },
        refresh: {
            secret: env.JWT_REFRESH_SECRET,
            expiresIn: env.JWT_REFRESH_EXPIRES_IN,
        },
    }),
);

/**
 * Configuration séparée pour la gestion explicite des Refresh Tokens (ex: Passport Strategy)
 */
export const refreshTokenConfig = {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
};