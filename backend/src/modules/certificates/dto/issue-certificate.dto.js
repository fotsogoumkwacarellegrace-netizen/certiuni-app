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
exports.IssueCertificateDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class IssueCertificateDto {
    templateId;
    studentFirstName;
    studentLastName;
    studentMatricule;
    degreeTitle;
    fieldOfStudy;
    grade;
    issueDate;
    universityId;
    studentId;
    programId;
    academicYearId;
    academicLevelId;
    metadataJson;
    static _OPENAPI_METADATA_FACTORY() {
        return { templateId: { required: true, type: () => String }, studentFirstName: { required: true, type: () => String }, studentLastName: { required: true, type: () => String }, studentMatricule: { required: true, type: () => String }, degreeTitle: { required: true, type: () => String }, fieldOfStudy: { required: true, type: () => String }, grade: { required: true, type: () => String }, issueDate: { required: true, type: () => String }, universityId: { required: false, type: () => String }, studentId: { required: false, type: () => String }, programId: { required: false, type: () => String }, academicYearId: { required: false, type: () => String }, academicLevelId: { required: false, type: () => String }, metadataJson: { required: false, type: () => Object } };
    }
}
exports.IssueCertificateDto = IssueCertificateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du modèle de diplôme à utiliser' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prénom de l étudiant', example: 'Jean' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "studentFirstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom de l étudiant', example: 'Paul' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "studentLastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Matricule de l étudiant', example: '21U2891' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "studentMatricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Intitulé du diplôme', example: 'Licence en Informatique' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "degreeTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filière / Spécialité', example: 'Génie Logiciel' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "fieldOfStudy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mention obtenue', example: 'Très Bien' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date d obtention', example: '2026-07-15' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de l\'université émettrice (optionnel si l\'utilisateur est rattaché)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "universityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de l\'étudiant lié (optionnel si données libres)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID du programme / filière' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "programId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de l\'année académique' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "academicYearId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID du niveau académique' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], IssueCertificateDto.prototype, "academicLevelId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Données supplémentaires au format JSON' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], IssueCertificateDto.prototype, "metadataJson", void 0);
//# sourceMappingURL=issue-certificate.dto.js.map