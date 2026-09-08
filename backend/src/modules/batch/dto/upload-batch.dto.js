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
exports.UploadBatchDto = exports.BatchType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var BatchType;
(function (BatchType) {
    BatchType["STUDENTS_IMPORT"] = "STUDENTS_IMPORT";
    BatchType["DIPLOMAS_IMPORT"] = "DIPLOMAS_IMPORT";
    BatchType["REQUESTS_IMPORT"] = "REQUESTS_IMPORT";
})(BatchType || (exports.BatchType = BatchType = {}));
class UploadBatchDto {
    batchType;
    institutionId;
    description;
    static _OPENAPI_METADATA_FACTORY() {
        return { batchType: { required: true, enum: require("./upload-batch.dto").BatchType }, institutionId: { required: true, type: () => String }, description: { required: false, type: () => String } };
    }
}
exports.UploadBatchDto = UploadBatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: BatchType,
        example: BatchType.STUDENTS_IMPORT,
        description: 'Type de données à importer en masse',
    }),
    (0, class_validator_1.IsEnum)(BatchType, { message: 'Type d d\'importation invalide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le type d\'importation est obligatoire.' }),
    __metadata("design:type", String)
], UploadBatchDto.prototype, "batchType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
        description: 'ID de l\'institution concernée par l\'import',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'institution doit être un UUID valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'institution est obligatoire.' }),
    __metadata("design:type", String)
], UploadBatchDto.prototype, "institutionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Importation de promotion 2025-2026',
        description: 'Description optionnelle du lot d\'importation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadBatchDto.prototype, "description", void 0);
//# sourceMappingURL=upload-batch.dto.js.map