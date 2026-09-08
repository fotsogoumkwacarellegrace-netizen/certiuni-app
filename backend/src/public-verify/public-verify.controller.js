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
exports.PublicVerifyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const public_verify_service_1 = require("./public-verify.service");
let PublicVerifyController = class PublicVerifyController {
    verifyService;
    constructor(verifyService) {
        this.verifyService = verifyService;
    }
    async verifyByIdentifier(identifier) {
        return this.verifyService.verifyByIdentifier(identifier);
    }
    async verifyByHash(hash) {
        return this.verifyService.verifyByHash(hash);
    }
};
exports.PublicVerifyController = PublicVerifyController;
__decorate([
    openapi.ApiOperation({ description: "GET /api/v1/public/verify/:identifier\nPoint d'entr\u00E9e principal pour la num\u00E9risation des QR Codes et recherche par code" }),
    (0, common_1.Get)(':identifier'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/verify-reponse.dto").VerifyCertificateResponseDto }),
    __param(0, (0, common_1.Param)('identifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicVerifyController.prototype, "verifyByIdentifier", null);
__decorate([
    openapi.ApiOperation({ description: "GET /api/v1/public/verify/hash/:hash\nPoint d'entr\u00E9e pour valider un fichier en comparant son hash SHA-256" }),
    (0, common_1.Get)('hash/:hash'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/verify-reponse.dto").VerifyCertificateResponseDto }),
    __param(0, (0, common_1.Param)('hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicVerifyController.prototype, "verifyByHash", null);
exports.PublicVerifyController = PublicVerifyController = __decorate([
    (0, common_1.Controller)('public/verify'),
    __metadata("design:paramtypes", [public_verify_service_1.PublicVerifyService])
], PublicVerifyController);
//# sourceMappingURL=public-verify.controller.js.map