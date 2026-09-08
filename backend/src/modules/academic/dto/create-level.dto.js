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
exports.CreateLevelDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateLevelDto {
    name;
    code;
    rank;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, code: { required: true, type: () => String }, rank: { required: true, type: () => Number, minimum: 1 } };
    }
}
exports.CreateLevelDto = CreateLevelDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Licence', description: 'Nom du niveau d\'étude (Licence, Master, Doctorat)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom du niveau est obligatoire.' }),
    __metadata("design:type", String)
], CreateLevelDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'L3', description: 'Code court du niveau' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le code du niveau est obligatoire.' }),
    __metadata("design:type", String)
], CreateLevelDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Rang ou année de formation (ex: 3 pour L3, 5 pour M2)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateLevelDto.prototype, "rank", void 0);
//# sourceMappingURL=create-level.dto.js.map