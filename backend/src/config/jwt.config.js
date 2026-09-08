"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenConfig = void 0;
const config_1 = require("@nestjs/config");
const env_config_1 = require("./env.config");
exports.default = (0, config_1.registerAs)('jwt', () => ({
    access: {
        secret: env_config_1.env.JWT_ACCESS_SECRET,
        signOptions: {
            expiresIn: env_config_1.env.JWT_ACCESS_EXPIRES_IN,
        },
    },
    refresh: {
        secret: env_config_1.env.JWT_REFRESH_SECRET,
        expiresIn: env_config_1.env.JWT_REFRESH_EXPIRES_IN,
    },
}));
exports.refreshTokenConfig = {
    secret: env_config_1.env.JWT_REFRESH_SECRET,
    expiresIn: env_config_1.env.JWT_REFRESH_EXPIRES_IN,
};
//# sourceMappingURL=jwt.config.js.map