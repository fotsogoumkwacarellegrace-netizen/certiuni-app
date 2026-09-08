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
exports.CreateRoleDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRoleDto {
    name;
    description;
    permissions;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, pattern: "/^[A-Z0-9_]+$/" }, description: { required: false, type: () => String }, permissions: { required: false, type: () => [String] } };
    }
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ACADEMIC_DIRECTOR',
        description: 'Code unique du rôle (majuscules et underscores)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom du rôle est obligatoire.' }),
    (0, class_validator_1.Matches)(/^[A-Z0-9_]+$/, {
        message: 'Le nom du rôle doit être en majuscules (ex: UNIV_ADMIN, ISSUER).',
    }),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Directeur académique pouvant signer les diplômes',
        description: 'Description détaillée des responsabilités liées au rôle',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['certificates:create', 'certificates:sign', 'users:read'],
        description: 'Liste des clefs de permissions associées au rôle',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateRoleDto.prototype, "permissions", void 0);
//# sourceMappingURL=create-role.dto.js.map