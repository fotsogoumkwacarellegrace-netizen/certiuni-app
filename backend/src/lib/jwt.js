"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRES_IN = exports.JWT_SECRET = void 0;
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.JWT_SECRET = process.env.JWT_SECRET || 'super_secret_certiuni_key_2026';
exports.JWT_EXPIRES_IN = '15m';
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, exports.JWT_SECRET, { expiresIn: exports.JWT_EXPIRES_IN });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, exports.JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map