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
exports.CreateServiceDto = exports.ServiceCategory = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ServiceCategory;
(function (ServiceCategory) {
    ServiceCategory["DOCUMENT_ISSUANCE"] = "DOCUMENT_ISSUANCE";
    ServiceCategory["VERIFICATION"] = "VERIFICATION";
    ServiceCategory["TRANSLATION"] = "TRANSLATION";
    ServiceCategory["DELIVERY"] = "DELIVERY";
    ServiceCategory["OTHER"] = "OTHER";
})(ServiceCategory || (exports.ServiceCategory = ServiceCategory = {}));
class CreateServiceDto {
    name;
    code;
    description;
    price;
    currency;
    category;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, code: { required: true, type: () => String }, description: { required: false, type: () => String }, price: { required: true, type: () => Number, minimum: 0 }, currency: { required: false, type: () => String }, category: { required: true, enum: require("./create-service.dto").ServiceCategory }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateServiceDto = CreateServiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Émission d\'Attestation de Réussite Certifiée',
        description: 'Nom du service offert par CertiUni',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom du service est obligatoire.' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'CERT-ISSUE-ATT',
        description: 'Code unique identifiant le service',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le code du service est obligatoire.' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Génération, authentification SHA-256 et délivrance numérique d\'une attestation de réussite.',
        description: 'Description détaillée du service',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5000,
        description: 'Prix du service (en devise locale ou unité tarifaire)',
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Le prix doit être un nombre valide.' }),
    (0, class_validator_1.Min)(0, { message: 'Le prix ne peut pas être négatif.' }),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'XAF',
        description: 'Devise monétaire (par défaut XAF)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ServiceCategory,
        example: ServiceCategory.DOCUMENT_ISSUANCE,
        description: 'Catégorie fonctionnelle du service',
    }),
    (0, class_validator_1.IsEnum)(ServiceCategory, { message: 'Catégorie de service invalide.' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Indique si le service est actuellement disponible à la commande',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateServiceDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-service.dto.js.map