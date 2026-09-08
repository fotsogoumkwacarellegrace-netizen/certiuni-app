"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.envSchema = void 0;
const config_1 = require("@nestjs/config");
const zod_1 = require("zod");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(3000),
    DATABASE_URL: zod_1.z.string().default('postgresql://postgres:postgres@localhost:5432/certiuni_dev?schema=public'),
    DB_HOST: zod_1.z.string().optional().default('localhost'),
    DB_PORT: zod_1.z.coerce.number().optional().default(5432),
    DB_USERNAME: zod_1.z.string().optional().default('postgres'),
    DB_PASSWORD: zod_1.z.string().optional().default('postgres'),
    DB_NAME: zod_1.z.string().optional().default('certiuni_dev'),
    DB_SSL: zod_1.z.string().optional().default('false'),
    REDIS_URL: zod_1.z.string().default('redis://localhost:6379'),
    REDIS_HOST: zod_1.z.string().default('localhost'),
    REDIS_PORT: zod_1.z.coerce.number().default(6379),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.coerce.number().optional(),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    MAIL_FROM: zod_1.z.string().email().optional(),
    FRONTEND_URL: zod_1.z.string().url().optional(),
    AWS_REGION: zod_1.z.string().default('eu-west-3'),
    AWS_ACCESS_KEY_ID: zod_1.z.string().default(''),
    AWS_SECRET_ACCESS_KEY: zod_1.z.string().default(''),
    AWS_S3_BUCKET: zod_1.z.string().default('certiuni-dev-bucket'),
    S3_ENDPOINT: zod_1.z.string().optional(),
    JWT_ACCESS_SECRET: zod_1.z.string().default('certiuni_access_secret_dev_2026_123456'),
    JWT_REFRESH_SECRET: zod_1.z.string().default('certiuni_refresh_secret_dev_2026_123456'),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
});
const parseEnv = () => {
    const result = exports.envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Configuration des variables d\'environnement invalide :');
        console.error(JSON.stringify(result.error.format(), null, 2));
        throw new Error('Variables d\'environnement non conformes au schéma Zod.');
    }
    return result.data;
};
exports.env = parseEnv();
exports.default = (0, config_1.registerAs)('app', () => exports.env);
//# sourceMappingURL=env.config.js.map