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
exports.CreateRequestDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRequestDto {
    serviceId;
    enrollmentId;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { serviceId: { required: true, type: () => String }, enrollmentId: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.CreateRequestDto = CreateRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'ID du service demandé dans le catalogue (ServiceCatalog)',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID du service doit être un UUID valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le service sélectionné est obligatoire.' }),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
        description: 'ID de l\'inscription universitaire concernée (si applicable)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID d\'inscription doit être un UUID valide.' }),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "enrollmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Besoin urgent de ce document pour une candidature de master à l\'étranger.',
        description: 'Commentaires ou précisions ajoutés par l\'étudiant',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "notes", void 0);
//# sourceMappingURL=create-request.dto.js.map