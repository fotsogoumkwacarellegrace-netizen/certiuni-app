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
exports.AccessController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const access_service_1 = require("./access.service");
const check_access_dto_1 = require("./dto/check-access.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let AccessController = class AccessController {
    accessService;
    constructor(accessService) {
        this.accessService = accessService;
    }
    checkAccess(dto) {
        return this.accessService.checkAccess(dto);
    }
    getUserPermissions(id) {
        return this.accessService.getUserEffectivePermissions(id);
    }
};
exports.AccessController = AccessController;
__decorate([
    (0, common_1.Post)('check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Évaluer dynamiquement les droits d\'accès d\'un utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Évaluation de l\'accès exécutée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur introuvable.' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_access_dto_1.CheckAccessDto]),
    __metadata("design:returntype", void 0)
], AccessController.prototype, "checkAccess", null);
__decorate([
    (0, common_1.Get)('user/:id/permissions'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir la liste effective des permissions accordées à un utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des permissions calculées.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur introuvable.' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AccessController.prototype, "getUserPermissions", null);
exports.AccessController = AccessController = __decorate([
    (0, swagger_1.ApiTags)('Access & Authorization'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('access'),
    __metadata("design:paramtypes", [access_service_1.AccessService])
], AccessController);
//# sourceMappingURL=access.controller.js.map