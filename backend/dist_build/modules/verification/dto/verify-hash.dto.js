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
exports.VerifyHashDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VerifyHashDto {
    hash;
}
exports.VerifyHashDto = VerifyHashDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        description: 'Empreinte numérique SHA-256 (64 caractères hexadécimaux) extraite du document PDF',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "L'empreinte numérique (hash) est obligatoire." }),
    (0, class_validator_1.Length)(64, 64, {
        message: 'Le hash SHA-256 doit comporter exactement 64 caractères hexadécimaux.',
    }),
    __metadata("design:type", String)
], VerifyHashDto.prototype, "hash", void 0);
//# sourceMappingURL=verify-hash.dto.js.map