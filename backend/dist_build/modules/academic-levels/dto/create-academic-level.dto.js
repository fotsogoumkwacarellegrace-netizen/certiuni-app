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
exports.CreateAcademicLevelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAcademicLevelDto {
    name;
    code;
    description;
    universityId;
    isActive;
}
exports.CreateAcademicLevelDto = CreateAcademicLevelDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Licence 3',
        description: 'Intitulé du niveau académique',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom du niveau est obligatoire.' }),
    __metadata("design:type", String)
], CreateAcademicLevelDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'L3',
        description: 'Code ou acronyme court du niveau (ex: L1, L2, L3, M1, M2, DOC)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le code du niveau est obligatoire.' }),
    (0, class_validator_1.Matches)(/^[A-Z0-9_-]+$/, {
        message: 'Le code doit contenir uniquement des lettres majuscules, chiffres ou tirets.',
    }),
    __metadata("design:type", String)
], CreateAcademicLevelDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Troisième année de cycle de Licence',
        description: 'Description du niveau d\'études',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAcademicLevelDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID de l\'université associée à ce niveau académique',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID de l\'université est obligatoire.' }),
    __metadata("design:type", String)
], CreateAcademicLevelDto.prototype, "universityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Statut du niveau académique',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAcademicLevelDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-academic-level.dto.js.map