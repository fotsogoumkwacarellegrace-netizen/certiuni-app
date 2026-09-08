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
exports.FilesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const files_service_1 = require("./files.service");
const upload_file_dto_1 = require("./dto/upload-file.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let FilesController = class FilesController {
    filesService;
    constructor(filesService) {
        this.filesService = filesService;
    }
    uploadFile(file, dto) {
        return this.filesService.uploadFile(file, dto.folder);
    }
    getPresignedUrl(key) {
        return this.filesService.getPresignedDownloadUrl(key);
    }
    deleteFile(key) {
        return this.filesService.deleteFile(key);
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Téléverser un fichier sur le stockage S3/MinIO' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                folder: {
                    type: 'string',
                    example: 'certificates',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Fichier téléversé avec succès.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf|svg)$/ }),
        ],
    }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_file_dto_1.UploadFileDto]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('presigned-url/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir une URL de téléchargement pré-signée temporaire' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('0')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "getPresignedUrl", null);
__decorate([
    (0, common_1.Delete)('/*'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un fichier du stockage S3/MinIO' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('0')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "deleteFile", null);
exports.FilesController = FilesController = __decorate([
    (0, swagger_1.ApiTags)('Files'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map