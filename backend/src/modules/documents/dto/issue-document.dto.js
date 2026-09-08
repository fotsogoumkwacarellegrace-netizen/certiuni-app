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
exports.IssueDocumentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class IssueDocumentDto {
    studentId;
    documentTypeId;
    enrollmentId;
    title;
    mention;
    issuedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, documentTypeId: { required: true, type: () => String }, enrollmentId: { required: true, type: () => String }, title: { required: false, type: () => String }, mention: { required: false, type: () => String }, issuedAt: { required: false, type: () => String } };
    }
}
exports.IssueDocumentDto = IssueDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID du profil étudiant (Student)',
    }),
    (0, class_validator_1.IsUUID)('4', { message: "L'ID étudiant doit être un UUID v4 valide." }),
    (0, class_validator_1.IsNotEmpty)({ message: "L'ID étudiant est obligatoire." }),
    __metadata("design:type", String)
], IssueDocumentDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'b1fec999-9c0b-4ef8-bb6d-6bb9bd380a22',
        description: 'ID du type de document (DocumentType)',
    }),
    (0, class_validator_1.IsUUID)('4', { message: "L'ID du type de document doit être un UUID v4 valide." }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le type de document est obligatoire.' }),
    __metadata("design:type", String)
], IssueDocumentDto.prototype, "documentTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'c2fed999-9c0b-4ef8-bb6d-6bb9bd380a33',
        description: "ID de l'inscription académique (Enrollment)",
    }),
    (0, class_validator_1.IsUUID)('4', { message: "L'ID de l'inscription doit être un UUID v4 valide." }),
    (0, class_validator_1.IsNotEmpty)({ message: "L'inscription académique est obligatoire." }),
    __metadata("design:type", String)
], IssueDocumentDto.prototype, "enrollmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Licence en Informatique de Gestion',
        description: 'Intitulé spécifique affiché sur le document',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueDocumentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Mention Très Bien - Major de promotion',
        description: 'Mention ou distinctions honorifiques',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueDocumentDto.prototype, "mention", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-06-30',
        description: "Date d'émission officielle (par défaut date du jour)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: "Date d'émission invalide." }),
    __metadata("design:type", String)
], IssueDocumentDto.prototype, "issuedAt", void 0);
//# sourceMappingURL=issue-document.dto.js.map