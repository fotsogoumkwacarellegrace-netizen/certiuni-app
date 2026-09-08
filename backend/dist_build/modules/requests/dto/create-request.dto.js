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
exports.CreateRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRequestDto {
    requesterName;
    requesterEmail;
    organization;
    universityId;
    documentHash;
    reason;
}
exports.CreateRequestDto = CreateRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jean Dupont', description: 'Nom complet du demandeur (tier/recruteur)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom du demandeur est obligatoire.' }),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "requesterName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'contact@entreprise.com', description: 'Email de contact pour recevoir la réponse' }),
    (0, class_validator_1.IsEmail)({}, { message: 'L\'adresse email doit être valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'email du demandeur est obligatoire.' }),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "requesterEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Tech Solutions Inc.', description: 'Nom de la structure ou de l\'entreprise' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "organization", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
        description: 'ID de l\'université concernée par la demande',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'université doit être un UUID valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'université est obligatoire.' }),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "universityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        description: 'Hash SHA-256 du document à vérifier (si disponible)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "documentHash", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Demande de vérification pour le recrutement au poste d\'ingénieur.',
        description: 'Motif ou message complémentaire',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "reason", void 0);
//# sourceMappingURL=create-request.dto.js.map