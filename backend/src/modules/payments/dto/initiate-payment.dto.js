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
exports.InitiatePaymentDto = exports.PaymentProvider = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["MTN_MOMO"] = "MTN_MOMO";
    PaymentProvider["ORANGE_MONEY"] = "ORANGE_MONEY";
    PaymentProvider["STRIPE"] = "STRIPE";
    PaymentProvider["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentProvider["CASH"] = "CASH";
})(PaymentProvider || (exports.PaymentProvider = PaymentProvider = {}));
class InitiatePaymentDto {
    requestId;
    amount;
    provider;
    phoneNumber;
    static _OPENAPI_METADATA_FACTORY() {
        return { requestId: { required: true, type: () => String }, amount: { required: true, type: () => Number, minimum: 100 }, provider: { required: true, enum: require("./initiate-payment.dto").PaymentProvider }, phoneNumber: { required: false, type: () => String } };
    }
}
exports.InitiatePaymentDto = InitiatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'ID de la demande de service (ServiceRequest) à régler',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de la demande de service doit être un UUID valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La demande de service est obligatoire.' }),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "requestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5000,
        description: 'Montant à payer',
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Le montant doit être un nombre valide.' }),
    (0, class_validator_1.Min)(100, { message: 'Le montant minimum est de 100.' }),
    __metadata("design:type", Number)
], InitiatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: PaymentProvider,
        example: PaymentProvider.MTN_MOMO,
        description: 'Mode ou fournisseur de paiement',
    }),
    (0, class_validator_1.IsEnum)(PaymentProvider, { message: 'Mode de paiement invalide.' }),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '+237670000000',
        description: 'Numéro de téléphone pour le prélèvement Mobile Money',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "phoneNumber", void 0);
//# sourceMappingURL=initiate-payment.dto.js.map