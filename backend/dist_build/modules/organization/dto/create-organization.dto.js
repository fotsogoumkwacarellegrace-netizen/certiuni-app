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
exports.CreateOrganizationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const organization_entity_1 = require("../entities/organization.entity");
class CreateOrganizationDto {
    institutionId;
    name;
    code;
    type;
    description;
    parentId;
}
exports.CreateOrganizationDto = CreateOrganizationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
        description: 'ID de l institution d enseignement supérieur à laquelle rattaché l entité',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L ID de l institution doit être un UUID valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L institution est obligatoire.' }),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "institutionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Faculté des Sciences et Technologies',
        description: 'Nom de l organisation ou département',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom est obligatoire.' }),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'FST-2026',
        description: 'Code unique de l organisation',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le code est obligatoire.' }),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: organization_entity_1.OrganizationType,
        example: organization_entity_1.OrganizationType.FACULTY,
        description: 'Type d unité académique ou administrative',
    }),
    (0, class_validator_1.IsEnum)(organization_entity_1.OrganizationType, { message: 'Type d organisation invalide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le type est obligatoire.' }),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Département en charge des diplômes en génie logiciel et IA.',
        description: 'Description détaillée',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'c3d4e5f6-a7b8-9012-3456-789abcdef012',
        description: 'ID de l organisation parente (ex: Département rattaché à une Faculté)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'L ID parent doit être un UUID valide.' }),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "parentId", void 0);
//# sourceMappingURL=create-organization.dto.js.map