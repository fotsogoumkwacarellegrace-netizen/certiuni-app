"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
let AuthService = class AuthService {
    redisClient;
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    static generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, env_config_1.env.JWT_ACCESS_SECRET, {
            expiresIn: env_config_1.env.JWT_ACCESS_EXPIRES_IN,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: payload.id }, env_config_1.env.JWT_REFRESH_SECRET, {
            expiresIn: env_config_1.env.JWT_REFRESH_EXPIRES_IN,
        });
        return { accessToken, refreshToken };
    }
    async storeRefreshToken(userId, refreshToken) {
        const ttlInSeconds = 7 * 24 * 60 * 60;
        await this.redisClient.set(`refresh_token:${userId}`, refreshToken, 'EX', ttlInSeconds);
    }
    async revokeRefreshToken(userId) {
        await this.redisClient.del(`refresh_token:${userId}`);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [ioredis_1.default])
], AuthService);
//# sourceMappingURL=auth.service.js.map