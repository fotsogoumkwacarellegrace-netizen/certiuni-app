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
exports.RegisterDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
class RegisterDto {
    email;
    password;
    firstName;
    lastName;
    role;
    universityId;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 8, pattern: "/((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/" }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, role: { required: true, enum: require("../../../common/decorators/roles.decorator").Role }, universityId: { required: false, type: () => String } };
    }
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Adresse email invalide' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'email est obligatoire' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le mot de passe est obligatoire' }),
    (0, class_validator_1.MinLength)(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
    (0, class_validator_1.Matches)(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre/caractère spécial',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le prénom est obligatoire' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom est obligatoire' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(roles_decorator_1.Role, { message: 'Le rôle attribué est invalide' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le rôle est obligatoire' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'identifiant de l\'université doit être un UUID v4 valide' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "universityId", void 0);
//# sourceMappingURL=register.dto.js.map