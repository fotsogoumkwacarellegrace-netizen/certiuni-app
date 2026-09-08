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
exports.CertificatesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const certificates_service_1 = require("./certificates.service");
const issue_certificate_dto_1 = require("./dto/issue-certificate.dto");
const revoke_certificate_dto_1 = require("./dto/revoke-certificate.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const get_user_decorator_1 = require("../../common/decorators/get-user.decorator");
let CertificatesController = class CertificatesController {
    certificatesService;
    constructor(certificatesService) {
        this.certificatesService = certificatesService;
    }
    async verifyPublic(publicIdentifier) {
        return this.certificatesService.verifyCertificatePublic(publicIdentifier);
    }
    verifyPublicly(identifier) {
        return { identifier, status: 'VALID' };
    }
    issueCertificate(issuerId, dto) {
        return { message: 'Diplôme émis', createdBy: issuerId };
    }
    async issue(dto, req) {
        return this.certificatesService.issueCertificate(dto, req.user);
    }
    async findAll(req) {
        return this.certificatesService.findAll(req.user);
    }
    async revoke(id, dto, req) {
        return this.certificatesService.revokeCertificate(id, dto, req.user);
    }
};
exports.CertificatesController = CertificatesController;
__decorate([
    (0, common_1.Get)('verify/:publicIdentifier'),
    (0, swagger_1.ApiOperation)({ summary: 'Vérification publique d un diplôme (Accès libre)' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('publicIdentifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "verifyPublic", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('verify/:identifier'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('identifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "verifyPublicly", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.ISSUER),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "issueCertificate", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN, client_1.UserRole.ISSUER),
    (0, swagger_1.ApiOperation)({ summary: 'Émettre un nouveau diplôme certifié' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [issue_certificate_dto_1.IssueCertificateDto, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "issue", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN, client_1.UserRole.ISSUER, client_1.UserRole.VERIFIER),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les diplômes émis' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/revoke'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Révoquer un diplôme' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, revoke_certificate_dto_1.RevokeCertificateDto, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "revoke", null);
exports.CertificatesController = CertificatesController = __decorate([
    (0, swagger_1.ApiTags)('certificates'),
    (0, common_1.Controller)('certificates'),
    __metadata("design:paramtypes", [certificates_service_1.CertificatesService])
], CertificatesController);
//# sourceMappingURL=certificates.controller.js.map