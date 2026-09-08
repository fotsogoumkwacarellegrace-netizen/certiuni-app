import { JwtModuleOptions } from '@nestjs/jwt';
export interface JwtConfigOptions {
    access: JwtModuleOptions;
    refresh: {
        secret: string;
        expiresIn: string;
    };
}
declare const _default: (() => JwtConfigOptions) & import("@nestjs/config").ConfigFactoryKeyHost<JwtConfigOptions>;
export default _default;
export declare const refreshTokenConfig: {
    secret: string;
    expiresIn: string;
};
