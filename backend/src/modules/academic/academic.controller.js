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
exports.AcademicController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const academic_service_1 = require("./academic.service");
const create_academic_year_dto_1 = require("./dto/create-academic-year.dto");
const create_program_dto_1 = require("./dto/create-program.dto");
const create_level_dto_1 = require("./dto/create-level.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AcademicController = class AcademicController {
    academicService;
    constructor(academicService) {
        this.academicService = academicService;
    }
    async createYear(dto, user, universityId) {
        return this.academicService.createYear(dto, user, universityId);
    }
    async findAllYears(user) {
        return this.academicService.findAllYears(user);
    }
    async createProgram(dto, user, universityId) {
        return this.academicService.createProgram(dto, user, universityId);
    }
    async findAllPrograms(user) {
        return this.academicService.findAllPrograms(user);
    }
    async createLevel(dto, user, universityId) {
        return this.academicService.createLevel(dto, user, universityId);
    }
    async findAllLevels(user) {
        return this.academicService.findAllLevels(user);
    }
};
exports.AcademicController = AcademicController;
__decorate([
    (0, common_1.Post)('years'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une année académique' }),
    (0, swagger_1.ApiQuery)({ name: 'universityId', required: false, description: 'Obligatoire si Super Admin' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('universityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_academic_year_dto_1.CreateAcademicYearDto, Object, String]),
    __metadata("design:returntype", Promise)
], AcademicController.prototype, "createYear", null);
__decorate([
    (0, common_1.Get)('years'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les années académiques' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AcademicController.prototype, "findAllYears", null);
__decorate([
    (0, common_1.Post)('programs'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une filière / programme' }),
    (0, swagger_1.ApiQuery)({ name: 'universityId', required: false }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('universityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_program_dto_1.CreateProgramDto, Object, String]),
    __metadata("design:returntype", Promise)
], AcademicController.prototype, "createProgram", null);
__decorate([
    (0, common_1.Get)('programs'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les programmes / filières' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AcademicController.prototype, "findAllPrograms", null);
__decorate([
    (0, common_1.Post)('levels'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un niveau d\'étude (Licence, Master, etc.)' }),
    (0, swagger_1.ApiQuery)({ name: 'universityId', required: false }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('universityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_level_dto_1.CreateLevelDto, Object, String]),
    __metadata("design:returntype", Promise)
], AcademicController.prototype, "createLevel", null);
__decorate([
    (0, common_1.Get)('levels'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les niveaux d\'études' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AcademicController.prototype, "findAllLevels", null);
exports.AcademicController = AcademicController = __decorate([
    (0, swagger_1.ApiTags)('Academic Structure'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('academic'),
    __metadata("design:paramtypes", [academic_service_1.AcademicService])
], AcademicController);
//# sourceMappingURL=academic.controller.js.map