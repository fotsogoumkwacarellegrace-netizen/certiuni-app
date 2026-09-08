export interface RedisConfigOptions {
    url: string;
    host: string;
    port: number;
    password?: string;
    db: number;
    keyPrefix: string;
    retryStrategy: (times: number) => number;
}
declare const _default: (() => RedisConfigOptions) & import("@nestjs/config").ConfigFactoryKeyHost<RedisConfigOptions>;
export default _default;
