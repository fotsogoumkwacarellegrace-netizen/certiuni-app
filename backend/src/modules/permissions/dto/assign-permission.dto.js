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
exports.AssignPermissionsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AssignPermissionsDto {
    roleId;
    permissions;
    static _OPENAPI_METADATA_FACTORY() {
        return { roleId: { required: true, type: () => String }, permissions: { required: true, type: () => [String] } };
    }
}
exports.AssignPermissionsDto = AssignPermissionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID unique du rôle auquel assigner les permissions',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID du rôle doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID du rôle est obligatoire.' }),
    __metadata("design:type", String)
], AssignPermissionsDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['certificates:create', 'certificates:verify', 'users:read'],
        description: 'Liste des codes de permissions à attribuer au rôle',
        type: [String],
    }),
    (0, class_validator_1.IsArray)({ message: 'Les permissions doivent être fournies sous forme de tableau.' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Chaque permission doit être une chaîne de caractères.' }),
    __metadata("design:type", Array)
], AssignPermissionsDto.prototype, "permissions", void 0);
//# sourceMappingURL=assign-permission.dto.js.map