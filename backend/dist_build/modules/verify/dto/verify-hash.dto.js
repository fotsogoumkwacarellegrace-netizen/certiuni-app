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
exports.VerifyQrDto = exports.VerifyHashParamDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VerifyHashParamDto {
    hash;
}
exports.VerifyHashParamDto = VerifyHashParamDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a3f8b1c2d3e4f567890abcdef1234567890abcdef1234567890abcdef1234567',
        description: 'Empreinte SHA-256 du document (64 caractères hexadécimaux)',
    }),
    (0, class_validator_1.IsString)({ message: 'Le hash doit être une chaîne de caractères.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le hash est obligatoire.' }),
    (0, class_validator_1.Matches)(/^[a-fA-F0-9]{64}$/, {
        message: 'Le format du hash SHA-256 est invalide (64 caractères hexadécimaux requis).',
    }),
    __metadata("design:type", String)
], VerifyHashParamDto.prototype, "hash", void 0);
class VerifyQrDto {
    qrData;
}
exports.VerifyQrDto = VerifyQrDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://verify.certiuni.com/v/a3f8b1c2d3e4f567890abcdef1234567890abcdef1234567890abcdef1234567',
        description: 'Contenu brut ou URL décodée du QR Code',
    }),
    (0, class_validator_1.IsString)({ message: 'Le contenu du QR code doit être une chaîne de caractères.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le contenu du QR code est obligatoire.' }),
    __metadata("design:type", String)
], VerifyQrDto.prototype, "qrData", void 0);
//# sourceMappingURL=verify-hash.dto.js.map