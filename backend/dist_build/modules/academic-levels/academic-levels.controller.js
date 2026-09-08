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
exports.AcademicLevelsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const academic_levels_service_1 = require("./academic-levels.service");
const create_academic_level_dto_1 = require("./dto/create-academic-level.dto");
const update_academic_level_dto_1 = require("./dto/update-academic-level.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let AcademicLevelsController = class AcademicLevelsController {
    academicLevelsService;
    constructor(academicLevelsService) {
        this.academicLevelsService = academicLevelsService;
    }
    create(dto) {
        return this.academicLevelsService.create(dto);
    }
    findAll() {
        return this.academicLevelsService.findAll();
    }
    findByUniversity(universityId) {
        return this.academicLevelsService.findByUniversity(universityId);
    }
    findOne(id) {
        return this.academicLevelsService.findOne(id);
    }
    update(id, dto) {
        return this.academicLevelsService.update(id, dto);
    }
    remove(id) {
        return this.academicLevelsService.remove(id);
    }
};
exports.AcademicLevelsController = AcademicLevelsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un niveau académique' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Niveau créé avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Code de niveau déjà existant.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_academic_level_dto_1.CreateAcademicLevelDto]),
    __metadata("design:returntype", void 0)
], AcademicLevelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister tous les niveaux académiques' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademicLevelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('university/:universityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les niveaux d\'une université' }),
    __param(0, (0, common_1.Param)('universityId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicLevelsController.prototype, "findByUniversity", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir un niveau académique par son ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicLevelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un niveau académique' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_academic_level_dto_1.UpdateAcademicLevelDto]),
    __metadata("design:returntype", void 0)
], AcademicLevelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un niveau académique' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicLevelsController.prototype, "remove", null);
exports.AcademicLevelsController = AcademicLevelsController = __decorate([
    (0, swagger_1.ApiTags)('Academic Levels'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('academic-levels'),
    __metadata("design:paramtypes", [academic_levels_service_1.AcademicLevelsService])
], AcademicLevelsController);
//# sourceMappingURL=academic-levels.controller.js.map