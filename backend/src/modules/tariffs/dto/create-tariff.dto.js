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
exports.CreateTariffDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTariffDto {
    name;
    serviceId;
    universityId;
    amount;
    currency;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, serviceId: { required: true, type: () => String }, universityId: { required: false, type: () => String }, amount: { required: true, type: () => Number, minimum: 0 }, currency: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateTariffDto = CreateTariffDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Grille Tarifaire Attestations - Douala',
        description: 'Nom descriptif de la grille ou règle tarifaire',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom du tarif est obligatoire.' }),
    __metadata("design:type", String)
], CreateTariffDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'ID du service concerné dans le catalogue (ServiceCatalog)',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID du service doit être un UUID valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le service est obligatoire.' }),
    __metadata("design:type", String)
], CreateTariffDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
        description: 'ID de l\'université concernée (si tarif spécifique à un établissement)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'université doit être un UUID valide.' }),
    __metadata("design:type", String)
], CreateTariffDto.prototype, "universityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 7500,
        description: 'Montant applique pour ce tarif',
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Le montant doit être un nombre valide.' }),
    (0, class_validator_1.Min)(0, { message: 'Le montant ne peut pas être négatif.' }),
    __metadata("design:type", Number)
], CreateTariffDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'XAF',
        description: 'Devise monétaire (par défaut XAF)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTariffDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Indique si cette règle tarifaire est active',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTariffDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-tariff.dto.js.map