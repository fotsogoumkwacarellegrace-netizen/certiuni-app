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
exports.OrganizationEntity = exports.OrganizationType = void 0;
const swagger_1 = require("@nestjs/swagger");
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["FACULTY"] = "FACULTY";
    OrganizationType["SCHOOL"] = "SCHOOL";
    OrganizationType["UFR"] = "UFR";
    OrganizationType["DEPARTMENT"] = "DEPARTMENT";
    OrganizationType["CENTER"] = "CENTER";
    OrganizationType["CAMPUS"] = "CAMPUS";
    OrganizationType["RECRUITER"] = "RECRUITER";
    OrganizationType["OTHER"] = "OTHER";
})(OrganizationType || (exports.OrganizationType = OrganizationType = {}));
class OrganizationEntity {
    id;
    institutionId;
    name;
    code;
    type;
    description;
    parentId;
    isActive;
    createdAt;
    updatedAt;
}
exports.OrganizationEntity = OrganizationEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0' }),
    __metadata("design:type", String)
], OrganizationEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01', description: 'ID de l institution parente' }),
    __metadata("design:type", String)
], OrganizationEntity.prototype, "institutionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Faculté des Sciences et Technologies' }),
    __metadata("design:type", String)
], OrganizationEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FST' }),
    __metadata("design:type", String)
], OrganizationEntity.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OrganizationType, example: OrganizationType.FACULTY }),
    __metadata("design:type", String)
], OrganizationEntity.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Faculté spécialisée dans l informatique et les sciences fondamentales.' }),
    __metadata("design:type", String)
], OrganizationEntity.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c3d4e5f6-a7b8-9012-3456-789abcdef012', description: 'ID de l organisation parente si structure imbriquée' }),
    __metadata("design:type", String)
], OrganizationEntity.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], OrganizationEntity.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrganizationEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrganizationEntity.prototype, "updatedAt", void 0);
//# sourceMappingURL=organization.entity.js.map