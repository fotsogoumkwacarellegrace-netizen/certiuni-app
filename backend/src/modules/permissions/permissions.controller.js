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
exports.PermissionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const permissions_service_1 = require("./permissions.service");
const create_permission_dto_1 = require("./dto/create-permission.dto");
const assign_permission_dto_1 = require("./dto/assign-permission.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let PermissionsController = class PermissionsController {
    permissionsService;
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    create(dto) {
        return this.permissionsService.create(dto);
    }
    assignPermissions(dto) {
        return this.permissionsService.assignPermissionsToRole(dto);
    }
    findAll() {
        return this.permissionsService.findAll();
    }
    findOne(id) {
        return this.permissionsService.findOne(id);
    }
    remove(id) {
        return this.permissionsService.remove(id);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle permission (SUPER_ADMIN uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Permission créée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'La permission existe déjà.' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permission_dto_1.CreatePermissionDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('assign'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Assigner un ensemble de permissions à un rôle (SUPER_ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permissions assignées avec succès au rôle.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rôle introuvable.' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_permission_dto_1.AssignPermissionsDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "assignPermissions", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les permissions du système' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des permissions récupérée.' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les détails d\'une permission' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission trouvée.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Permission introuvable.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une permission (SUPER_ADMIN uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission supprimée.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Permission introuvable.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "remove", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, swagger_1.ApiTags)('Permissions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map