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
exports.CreateAcademicYearDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAcademicYearDto {
    year;
    startDate;
    endDate;
    universityId;
}
exports.CreateAcademicYearDto = CreateAcademicYearDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-2026',
        description: 'Format de l\'année académique (ex: 2025-2026)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'intitulé de l\'année académique est obligatoire.' }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{4}$/, {
        message: 'L\'année académique doit respecter le format YYYY-YYYY (ex: 2025-2026).',
    }),
    __metadata("design:type", String)
], CreateAcademicYearDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2025-09-01T00:00:00.000Z',
        description: 'Date de début de l\'année académique',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAcademicYearDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-07-31T23:59:59.000Z',
        description: 'Date de fin de l\'année académique',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAcademicYearDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID de l\'université associée à cette année académique',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID de l\'université est obligatoire.' }),
    __metadata("design:type", String)
], CreateAcademicYearDto.prototype, "universityId", void 0);
//# sourceMappingURL=create-academic-year.dto.js.map