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
exports.UniversitiesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const universities_service_1 = require("./universities.service");
const create_university_dto_1 = require("./dto/create-university.dto");
const update_university_dto_1 = require("./dto/update-university.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let UniversitiesController = class UniversitiesController {
    universitiesService;
    constructor(universitiesService) {
        this.universitiesService = universitiesService;
    }
    create(dto) {
        return this.universitiesService.create(dto);
    }
    findAll() {
        return this.universitiesService.findAll();
    }
    findByCode(code) {
        return this.universitiesService.findByCode(code);
    }
    findOne(id) {
        return this.universitiesService.findOne(id);
    }
    update(id, dto) {
        return this.universitiesService.update(id, dto);
    }
    remove(id) {
        return this.universitiesService.remove(id);
    }
};
exports.UniversitiesController = UniversitiesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle université (SUPER_ADMIN uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Université créée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Une université avec ce code existe déjà.' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_university_dto_1.CreateUniversityDto]),
    __metadata("design:returntype", void 0)
], UniversitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les universités' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des universités récupérée avec succès.' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UniversitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir une université par son code (ex: UY1)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Université trouvée.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Université introuvable.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UniversitiesController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir une université par son ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Université trouvée.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Université introuvable.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UniversitiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une université (SUPER_ADMIN ou UNIV_ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Université mise à jour avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Université introuvable.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_university_dto_1.UpdateUniversityDto]),
    __metadata("design:returntype", void 0)
], UniversitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une université (SUPER_ADMIN uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Université supprimée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Université introuvable.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UniversitiesController.prototype, "remove", null);
exports.UniversitiesController = UniversitiesController = __decorate([
    (0, swagger_1.ApiTags)('Universities'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('universities'),
    __metadata("design:paramtypes", [universities_service_1.UniversitiesService])
], UniversitiesController);
//# sourceMappingURL=universities.controller.js.map