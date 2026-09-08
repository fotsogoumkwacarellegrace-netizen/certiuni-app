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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const verification_service_1 = require("./verification.service");
const verify_hash_dto_1 = require("./dto/verify-hash.dto");
const verify_qr_dto_1 = require("./dto/verify-qr.dto");
let VerificationController = class VerificationController {
    verificationService;
    constructor(verificationService) {
        this.verificationService = verificationService;
    }
    verifyHash(dto) {
        return this.verificationService.verifyByHash(dto);
    }
    verifyQr(dto) {
        return this.verificationService.verifyByQr(dto);
    }
};
exports.VerificationController = VerificationController;
__decorate([
    (0, common_1.Post)('hash'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Vérifier l authenticité d un document via son hash SHA-256 (Accès Public)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document vérifié (Authentique ou Révoqué).' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Aucun document trouvé pour ce hash.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_hash_dto_1.VerifyHashDto]),
    __metadata("design:returntype", Promise)
], VerificationController.prototype, "verifyHash", null);
__decorate([
    (0, common_1.Post)('qr'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Vérifier l authenticité d un document via scan QR / Numéro de certificat (Accès Public)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document vérifié (Authentique ou Révoqué).' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Numéro de certificat introuvable.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_qr_dto_1.VerifyQrDto]),
    __metadata("design:returntype", Promise)
], VerificationController.prototype, "verifyQr", null);
exports.VerificationController = VerificationController = __decorate([
    (0, swagger_1.ApiTags)('Public Verification'),
    (0, common_1.Controller)('verification'),
    __metadata("design:paramtypes", [verification_service_1.VerificationService])
], VerificationController);
//# sourceMappingURL=verification.controller.js.map