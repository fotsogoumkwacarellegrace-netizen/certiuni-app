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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const documents_service_1 = require("./documents.service");
const issue_document_dto_1 = require("./dto/issue-document.dto");
const revoke_document_dto_1 = require("./dto/revoke-document.dto");
const batch_issue_document_dto_1 = require("./dto/batch-issue-document.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let DocumentsController = class DocumentsController {
    documentsService;
    constructor(documentsService) {
        this.documentsService = documentsService;
    }
    issue(dto, req) {
        return this.documentsService.issue(dto, req.user.id);
    }
    batchIssue(dto, req) {
        return this.documentsService.batchIssue(dto, req.user.id);
    }
    findAll() {
        return this.documentsService.findAll();
    }
    findByNumber(certificateNumber) {
        return this.documentsService.findByNumber(certificateNumber);
    }
    findOne(id) {
        return this.documentsService.findOne(id);
    }
    revoke(id, dto) {
        return this.documentsService.revoke(id, dto);
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Post)('issue'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Émettre un nouveau document certifié' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Document émis avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Étudiant, Type ou Inscription introuvable.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [issue_document_dto_1.IssueDocumentDto, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "issue", null);
__decorate([
    (0, common_1.Post)('issue/batch'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Émettre une série de documents en lot' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Traitement du lot effectué.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [batch_issue_document_dto_1.BatchIssueDocumentDto, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "batchIssue", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lister tous les documents émis' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('number/:certificateNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir un document par son numéro officiel' }),
    __param(0, (0, common_1.Param)('certificateNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findByNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les détails d un document par son ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/revoke'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Révoquer un document certifié' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document révoqué.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Le document est déjà révoqué.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, revoke_document_dto_1.RevokeDocumentDto]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "revoke", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, swagger_1.ApiTags)('Documents'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map