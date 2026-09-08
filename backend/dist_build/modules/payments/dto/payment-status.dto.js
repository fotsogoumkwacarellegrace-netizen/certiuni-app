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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatusDto = exports.PaymentStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["SUCCESSFUL"] = "SUCCESSFUL";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
class PaymentStatusDto {
    status;
    transactionRef;
    note;
}
exports.PaymentStatusDto = PaymentStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: PaymentStatus,
        example: PaymentStatus.SUCCESSFUL,
        description: 'Statut du paiement',
    }),
    (0, class_validator_1.IsEnum)(PaymentStatus, { message: 'Statut de paiement invalide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le statut est obligatoire.' }),
    __metadata("design:type", String)
], PaymentStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'TXN-2026-889412',
        description: 'Référence de transaction générée par l\'opérateur',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentStatusDto.prototype, "transactionRef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Paiement confirmé avec succès.',
        description: 'Message de retour ou motif d\'échec',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentStatusDto.prototype, "note", void 0);
//# sourceMappingURL=payment-status.dto.js.map