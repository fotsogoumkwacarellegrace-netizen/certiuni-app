"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
const crypto_1 = require("crypto");
const crypto_2 = __importDefault(require("crypto"));
class CryptoService {
    static calculateCanonicalHash(payload) {
        const canonicalJson = `${payload.universityId.toLowerCase()}:${payload.studentIdentifier.trim().toLowerCase()}:${payload.degreeTitle.trim()}:${payload.issueDate}`;
        if (!canonicalJson) {
            throw new Error('Échec de la canonicalisation JSON');
        }
        return (0, crypto_1.createHash)('sha256').update(canonicalJson, 'utf8').digest('hex');
    }
    static calculateBufferHash(buffer) {
        return (0, crypto_1.createHash)('sha256').update(buffer).digest('hex');
    }
    static verifyHash(data, expectedHash) {
        const computedHash = this.calculateCanonicalHash({
            studentIdentifier: data.studentIdentifier,
            degreeTitle: data.degreeTitle,
            issueDate: typeof data.issueDate === 'string' ? data.issueDate : data.issueDate.toISOString(),
            universityId: data.universityId,
        });
        const computedBuffer = Buffer.from(computedHash, 'hex');
        const expectedBuffer = Buffer.from(expectedHash, 'hex');
        if (computedBuffer.length !== expectedBuffer.length) {
            return false;
        }
        return crypto_2.default.timingSafeEqual(computedBuffer, expectedBuffer);
    }
}
exports.CryptoService = CryptoService;
//# sourceMappingURL=crypto.service.js.map