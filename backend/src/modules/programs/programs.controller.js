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
exports.ProgramsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const programs_service_1 = require("./programs.service");
const create_program_dto_1 = require("./dto/create-program.dto");
const update_program_dto_1 = require("./dto/update-program.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let ProgramsController = class ProgramsController {
    programsService;
    constructor(programsService) {
        this.programsService = programsService;
    }
    create(dto) {
        return this.programsService.create(dto);
    }
    findAll() {
        return this.programsService.findAll();
    }
    findByUniversity(universityId) {
        return this.programsService.findByUniversity(universityId);
    }
    findOne(id) {
        return this.programsService.findOne(id);
    }
    update(id, dto) {
        return this.programsService.update(id, dto);
    }
    remove(id) {
        return this.programsService.remove(id);
    }
};
exports.ProgramsController = ProgramsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle filière (SUPER_ADMIN ou UNIV_ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Filière créée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Université introuvable.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Le code existe déjà dans l\'établissement.' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_program_dto_1.CreateProgramDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les filières du système' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des filières récupérée.' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('university/:universityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les filières d\'une université' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des filières de l\'université.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Université introuvable.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('universityId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "findByUniversity", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les détails d\'une filière par son ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Filière trouvée.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Filière introuvable.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour les informations d\'une filière' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Filière mise à jour.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Filière introuvable.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_program_dto_1.UpdateProgramDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une filière' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Filière supprimée.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Filière introuvable.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "remove", null);
exports.ProgramsController = ProgramsController = __decorate([
    (0, swagger_1.ApiTags)('Programs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('programs'),
    __metadata("design:paramtypes", [programs_service_1.ProgramsService])
], ProgramsController);
//# sourceMappingURL=programs.controller.js.map