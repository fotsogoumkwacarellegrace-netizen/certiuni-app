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
exports.CreateProgramDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProgramDto {
    name;
    code;
    description;
    universityId;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, code: { required: true, type: () => String, pattern: "/^[A-Z0-9_-]+$/" }, description: { required: false, type: () => String }, universityId: { required: true, type: () => String }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateProgramDto = CreateProgramDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Génie Informatique',
        description: 'Nom de la filière ou de la spécialité',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom du programme est obligatoire.' }),
    __metadata("design:type", String)
], CreateProgramDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'GI-BS',
        description: 'Code ou acronyme unique de la filière (ex: GI-BS, SEG, DROT)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le code du programme est obligatoire.' }),
    (0, class_validator_1.Matches)(/^[A-Z0-9_-]+$/, {
        message: 'Le code doit contenir uniquement des lettres majuscules, chiffres ou tirets.',
    }),
    __metadata("design:type", String)
], CreateProgramDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Licence / Bachelor in Computer Engineering',
        description: 'Description détaillée ou objectifs de la formation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProgramDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID de l\'université proposant cette filière',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID de l\'université est obligatoire.' }),
    __metadata("design:type", String)
], CreateProgramDto.prototype, "universityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Statut de la filière',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProgramDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-program.dto.js.map