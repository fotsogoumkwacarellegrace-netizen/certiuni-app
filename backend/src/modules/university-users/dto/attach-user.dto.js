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
exports.AttachUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class AttachUserDto {
    userId;
    universityId;
    role;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, universityId: { required: true, type: () => String }, role: { required: true, type: () => Object } };
    }
}
exports.AttachUserDto = AttachUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID de l\'utilisateur à rattacher',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID utilisateur doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID utilisateur est obligatoire.' }),
    __metadata("design:type", String)
], AttachUserDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID de l\'université d\'accueil',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID de l\'université est obligatoire.' }),
    __metadata("design:type", String)
], AttachUserDto.prototype, "universityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: client_1.UserRole.UNIV_ADMIN,
        enum: client_1.UserRole,
        description: 'Rôle attribué à l\'utilisateur au sein de l\'établissement',
    }),
    (0, class_validator_1.IsEnum)(client_1.UserRole, { message: 'Rôle utilisateur invalide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le rôle est obligatoire.' }),
    __metadata("design:type", String)
], AttachUserDto.prototype, "role", void 0);
//# sourceMappingURL=attach-user.dto.js.map