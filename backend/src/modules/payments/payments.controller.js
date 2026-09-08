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
exports.PaymentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const payments_service_1 = require("./payments.service");
const initiate_payment_dto_1 = require("./dto/initiate-payment.dto");
const payment_status_dto_1 = require("./dto/payment-status.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    initiate(req, dto) {
        return this.paymentsService.initiatePayment(req.user.id, dto);
    }
    updateStatus(id, dto) {
        return this.paymentsService.processPaymentStatus(id, dto);
    }
    findAll() {
        return this.paymentsService.findAll();
    }
    findOne(id, req) {
        return this.paymentsService.findOne(id, req.user);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Initier le paiement d un service (Étudiant)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Paiement initialisé avec succès.' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, initiate_payment_dto_1.InitiatePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiate", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le statut d un paiement (Admin / Callback manuel)' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_status_dto_1.PaymentStatusDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.UNIV_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les transactions de paiement (Admin)' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir le détail d un paiement' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findOne", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map