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
exports.ServiceRequestsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const service_requests_services_1 = require("./service-requests.services");
const create_request_dto_1 = require("./dto/create-request.dto");
const update_request_status_dto_1 = require("./dto/update-request-status.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let ServiceRequestsController = class ServiceRequestsController {
    serviceRequestsService;
    constructor(serviceRequestsService) {
        this.serviceRequestsService = serviceRequestsService;
    }
    create(req, dto) {
        return this.serviceRequestsService.create(req.user.id, dto);
    }
    findMyRequests(req) {
        return this.serviceRequestsService.findAllForStudent(req.user.id);
    }
    findAll(status) {
        return this.serviceRequestsService.findAll(status);
    }
    findOne(id, req) {
        return this.serviceRequestsService.findOne(id, req.user);
    }
    updateStatus(id, dto) {
        return this.serviceRequestsService.updateStatus(id, dto);
    }
    cancel(id, req) {
        return this.serviceRequestsService.cancelByStudent(id, req.user.id);
    }
};
exports.ServiceRequestsController = ServiceRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Soumettre une demande de service (Étudiant)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Demande créée avec succès.' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_request_dto_1.CreateRequestDto]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-requests'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les demandes de l étudiant connecté' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "findMyRequests", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les demandes de service (Admin)' }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        enum: update_request_status_dto_1.ServiceRequestStatus,
        required: false,
        description: 'Filtrer par statut',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les détails d une demande de service' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Changer le statut d une demande de service (Admin)' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_request_status_dto_1.UpdateRequestStatusDto]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Annuler une demande en attente (Étudiant)' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "cancel", null);
exports.ServiceRequestsController = ServiceRequestsController = __decorate([
    (0, swagger_1.ApiTags)('Service Requests'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('service-requests'),
    __metadata("design:paramtypes", [service_requests_services_1.ServiceRequestsService])
], ServiceRequestsController);
//# sourceMappingURL=service-requests.controller.js.map