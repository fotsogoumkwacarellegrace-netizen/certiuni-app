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
exports.CreateTemplateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTemplateDto {
    name;
    isActive;
    description;
    htmlContent;
    cssContent;
    isDefault;
    layoutConfig;
    universityId;
}
exports.CreateTemplateDto = CreateTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Modèle Officiel - Licence Générale', description: 'Nom du modèle de document', }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom du template est obligatoire.' }),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTemplateDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Modèle utilisé pour les diplômes de Licence de la FST' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '<div class="diploma"><h1>{{title}}</h1><p>Décerné à {{studentName}}</p></div>',
        description: 'Code HTML source avec placeholders Handlebars',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le contenu HTML est obligatoire.' }),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "htmlContent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '.diploma { font-family: "Georgia"; color: #1a365d; }',
        description: 'Styles CSS associés au template',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "cssContent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Définit si ce template est le modèle par défaut de l\'institution',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTemplateDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            pageSize: 'A4',
            orientation: 'landscape',
            backgroundUrl: 'https://storage.certiuni.cm/templates/univ-douala-bg.png',
            fields: [
                { key: 'studentName', x: 200, y: 150, fontSize: 18, fontStyle: 'bold' },
                { key: 'degreeName', x: 200, y: 200, fontSize: 16 },
                { key: 'mention', x: 200, y: 240, fontSize: 14 },
                { key: 'qrCode', x: 700, y: 400, width: 100, height: 100 }
            ]
        }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateTemplateDto.prototype, "layoutConfig", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '9d421aa5-9cde-4b8e-b15c-05266db82158', description: 'ID de l\'institution propriétaire du template', }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'institution doit être un UUID valide.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'institution est obligatoire.' }),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "universityId", void 0);
//# sourceMappingURL=create-template.dto.js.map