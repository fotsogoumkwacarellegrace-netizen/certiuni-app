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
exports.BatchController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const batch_service_1 = require("./batch.service");
const upload_batch_dto_1 = require("./dto/upload-batch.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let BatchController = class BatchController {
    batchService;
    constructor(batchService) {
        this.batchService = batchService;
    }
    async uploadBatch(file, dto, req) {
        if (!file) {
            throw new common_1.BadRequestException('Veuillez fournir un fichier .csv ou .xlsx.');
        }
        return this.batchService.processBatchUpload(file, dto, req.user.id);
    }
};
exports.BatchController = BatchController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Importer un lot de données en masse via fichier Excel ou CSV' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier Excel (.xlsx, .xls) ou CSV (.csv) à parser',
                },
                batchType: {
                    type: 'string',
                    enum: ['STUDENTS_IMPORT', 'DIPLOMAS_IMPORT', 'REQUESTS_IMPORT'],
                    example: 'STUDENTS_IMPORT',
                },
                institutionId: {
                    type: 'string',
                    example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
                },
                description: {
                    type: 'string',
                    example: 'Importation des étudiants de la Faculté des Sciences 2025/2026',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fichier analysé et lot d\'importation traité avec rapport détaillé.' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_batch_dto_1.UploadBatchDto, Object]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "uploadBatch", null);
exports.BatchController = BatchController = __decorate([
    (0, swagger_1.ApiTags)('Batch'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, common_1.Controller)('batch'),
    __metadata("design:paramtypes", [batch_service_1.BatchService])
], BatchController);
//# sourceMappingURL=batch.controller.js.map