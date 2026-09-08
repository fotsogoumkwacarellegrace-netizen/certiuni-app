"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app_error_1 = require("./errors/app.error");
const health_router_1 = __importDefault(require("./routes/health.router"));
const auth_router_1 = __importDefault(require("./routes/V1/auth.router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.status(200).json({
        name: 'CertiUni API',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
app.use('/api/v1/health', health_router_1.default);
app.use('/api/v1/auth', auth_router_1.default);
app.all(/^\/?.*/, (req, res, next) => {
    next(new app_error_1.NotFoundError(`La route ${req.originalUrl} n'existe pas.`));
});
app.use(error_middleware_1.globalErrorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map