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
exports.VerifyQrDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VerifyQrDto {
    qrData;
    static _OPENAPI_METADATA_FACTORY() {
        return { qrData: { required: true, type: () => String, pattern: "/^[A-Z0-9\\-_:/.]+$/i" } };
    }
}
exports.VerifyQrDto = VerifyQrDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'CERT-2026-X9A2B4C',
        description: 'Numéro de certificat ou contenu encodé dans le QR Code',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le numéro de certificat ou la donnée QR est obligatoire.' }),
    (0, class_validator_1.Matches)(/^[A-Z0-9\-_:/.]+$/i, {
        message: 'Format de numéro ou donnée de vérification invalide.',
    }),
    __metadata("design:type", String)
], VerifyQrDto.prototype, "qrData", void 0);
//# sourceMappingURL=verify-qr.dto.js.map