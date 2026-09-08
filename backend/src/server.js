"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = Number(process.env.PORT || 3000);
const server = app_1.default.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CertiUni backend démarré sur http://localhost:${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/v1/health`);
});
const shutdown = async () => {
    server.close(() => {
        console.log('Serveur arrêté proprement.');
        process.exit(0);
    });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
exports.default = app_1.default;
//# sourceMappingURL=server.js.map