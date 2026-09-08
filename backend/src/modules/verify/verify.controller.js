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
exports.VerifyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const verify_service_1 = require("./verify.service");
const verify_hash_dto_1 = require("./dto/verify-hash.dto");
let VerifyController = class VerifyController {
    verifyService;
    constructor(verifyService) {
        this.verifyService = verifyService;
    }
    async verifyByHash(params) {
        return this.verifyService.verifyByHash(params.hash);
    }
    async verifyByQr(dto) {
        return this.verifyService.verifyByQrData(dto.qrData);
    }
};
exports.VerifyController = VerifyController;
__decorate([
    (0, common_1.Get)(':hash'),
    (0, swagger_1.ApiOperation)({
        summary: 'Vérifier l\'authenticité d\'un diplôme par son empreinte SHA-256 (Accès Public)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'hash',
        description: 'Hash SHA-256 du document (64 caractères hexadécimaux)',
        example: 'a3f8b1c2d3e4f567890abcdef1234567890abcdef1234567890abcdef1234567',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Résultat de la vérification du document.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Aucun document trouvé pour ce hash.' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_hash_dto_1.VerifyHashParamDto]),
    __metadata("design:returntype", Promise)
], VerifyController.prototype, "verifyByHash", null);
__decorate([
    (0, common_1.Post)('qr'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Vérifier un document à partir du contenu scanné d\'un QR Code (Accès Public)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Résultat de la vérification extrait du QR code.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document non trouvé ou QR code invalide.' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_hash_dto_1.VerifyQrDto]),
    __metadata("design:returntype", Promise)
], VerifyController.prototype, "verifyByQr", null);
exports.VerifyController = VerifyController = __decorate([
    (0, swagger_1.ApiTags)('Public Verification'),
    (0, common_1.Controller)('verify'),
    __metadata("design:paramtypes", [verify_service_1.VerifyService])
], VerifyController);
//# sourceMappingURL=verify.controller.js.map