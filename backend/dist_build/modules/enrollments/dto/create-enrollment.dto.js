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
exports.CreateEnrollmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEnrollmentDto {
    studentId;
    programId;
    academicLevelId;
    academicYearId;
}
exports.CreateEnrollmentDto = CreateEnrollmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID de l\'étudiant (User)',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'étudiant doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID de l\'étudiant est obligatoire.' }),
    __metadata("design:type", String)
], CreateEnrollmentDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID du programme / filière d\'études',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID du programme doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID du programme est obligatoire.' }),
    __metadata("design:type", String)
], CreateEnrollmentDto.prototype, "programId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'd2a3c953-9b1c-4f3a-cc44-223344556677',
        description: 'ID du niveau académique (ex: L3, M1)',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID du niveau académique doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID du niveau académique est obligatoire.' }),
    __metadata("design:type", String)
], CreateEnrollmentDto.prototype, "academicLevelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'e3b4d064-0c2d-5a4b-dd55-334455667788',
        description: 'ID de l\'année académique (ex: 2025-2026)',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'année académique doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID de l\'année académique est obligatoire.' }),
    __metadata("design:type", String)
], CreateEnrollmentDto.prototype, "academicYearId", void 0);
//# sourceMappingURL=create-enrollment.dto.js.map