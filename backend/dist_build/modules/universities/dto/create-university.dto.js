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
exports.CreateUniversityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUniversityDto {
    name;
    domain;
    contactEmail;
    code;
    address;
    email;
    website;
    logoUrl;
    isActive;
}
exports.CreateUniversityDto = CreateUniversityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Université de Douala',
        description: "Nom officiel de l'université ou de l'institut",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Le nom de l'université est obligatoire." }),
    __metadata("design:type", String)
], CreateUniversityDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUniversityDto.prototype, "domain", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUniversityDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'UD',
        description: 'Code ou acronyme unique (ex: UY1, UDS, UBA)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Le code de l'université est obligatoire." }),
    (0, class_validator_1.Matches)(/^[A-Z0-9_-]+$/, {
        message: 'Le code doit contenir uniquement des lettres majuscules, chiffres ou tirets.',
    }),
    __metadata("design:type", String)
], CreateUniversityDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Douala, Cameroun',
        description: 'Adresse physique ou localisation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUniversityDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'contact@univ-douala.cm',
        description: 'Adresse email de contact officiel',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: "Format d'email invalide." }),
    __metadata("design:type", String)
], CreateUniversityDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://univ-douala.cm' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ require_tld: false }, { message: 'Le site web doit être une URL valide.' }),
    __metadata("design:type", String)
], CreateUniversityDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://univ-douala.cm/logo.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ require_tld: false }, { message: "L'URL du logo doit être valide." }),
    __metadata("design:type", String)
], CreateUniversityDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: "Statut d'activation de l'établissement",
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateUniversityDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-university.dto.js.map