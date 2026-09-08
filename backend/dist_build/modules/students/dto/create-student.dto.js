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
exports.CreateStudentDto = exports.Gender = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
})(Gender || (exports.Gender = Gender = {}));
class CreateStudentDto {
    userId;
    matricule;
    birthDate;
    birthPlace;
    nationality;
    gender;
    idCardNumber;
}
exports.CreateStudentDto = CreateStudentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID du compte utilisateur associé (User)',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID utilisateur doit être un UUID v4 valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID utilisateur est obligatoire.' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '22U1042SF',
        description: 'Matricule officiel de l\'étudiant',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le matricule est obligatoire.' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2001-05-14',
        description: 'Date de naissance (YYYY-MM-DD)',
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Date de naissance invalide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La date de naissance est obligatoire.' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Yaoundé',
        description: 'Lieu de naissance',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le lieu de naissance est obligatoire.' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "birthPlace", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Camerounaise',
        description: 'Nationalité',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La nationalité est obligatoire.' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "nationality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: Gender.MALE,
        enum: Gender,
        description: 'Genre (MALE / FEMALE)',
    }),
    (0, class_validator_1.IsEnum)(Gender, { message: 'Genre invalide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le genre est obligatoire.' }),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123456789',
        description: 'Numéro de CNI ou Passeport',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStudentDto.prototype, "idCardNumber", void 0);
//# sourceMappingURL=create-student.dto.js.map