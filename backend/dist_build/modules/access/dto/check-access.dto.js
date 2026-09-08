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
exports.CheckAccessDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CheckAccessDto {
    userId;
    permission;
    universityId;
}
exports.CheckAccessDto = CheckAccessDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID de l\'utilisateur dont on souhaite vérifier les accès',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID utilisateur doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID utilisateur est obligatoire.' }),
    __metadata("design:type", String)
], CheckAccessDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'certificates:create',
        description: 'Permission ciblée (format domaine:action)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La permission est obligatoire.' }),
    (0, class_validator_1.Matches)(/^[a-z]+:[a-z_]+$/, {
        message: 'La permission doit respecter le format domaine:action (ex: certificates:create).',
    }),
    __metadata("design:type", String)
], CheckAccessDto.prototype, "permission", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID de l\'université contextuelle pour la validation multi-tenant',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' }),
    __metadata("design:type", String)
], CheckAccessDto.prototype, "universityId", void 0);
//# sourceMappingURL=check-access.dto.js.map