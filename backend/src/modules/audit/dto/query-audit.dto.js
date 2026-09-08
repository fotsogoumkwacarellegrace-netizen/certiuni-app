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
exports.QueryAuditDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class QueryAuditDto {
    userId;
    action;
    entity;
    entityId;
    startDate;
    endDate;
    limit;
    offset;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: false, type: () => String }, action: { required: false, type: () => String }, entity: { required: false, type: () => String }, entityId: { required: false, type: () => String }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, limit: { required: false, type: () => Number, minimum: 1 }, offset: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.QueryAuditDto = QueryAuditDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'Filtrer par l\'ID de l\'utilisateur ayant effectué l\'action',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID utilisateur doit être un UUID valide.' }),
    __metadata("design:type", String)
], QueryAuditDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'DIPLOMA_VERIFIED',
        description: 'Filtrer par type d\'action (ex: USER_LOGIN, DIPLOMA_CREATED, PAYMENT_SUCCESS)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryAuditDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'ServiceRequest',
        description: 'Filtrer par entité impactée (ex: ServiceRequest, User, Diploma)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryAuditDto.prototype, "entity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
        description: 'Filtrer par ID de l\'entité impactée',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryAuditDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-01-01T00:00:00.000Z',
        description: 'Date de début de la plage d\'audit',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de début doit être au format ISO8601.' }),
    __metadata("design:type", String)
], QueryAuditDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-12-31T23:59:59.000Z',
        description: 'Date de fin de la plage d\'audit',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de fin doit être au format ISO8601.' }),
    __metadata("design:type", String)
], QueryAuditDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 50,
        description: 'Nombre de logs à récupérer (pagination)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryAuditDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 0,
        description: 'Nombre d\'éléments à sauter (pagination)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], QueryAuditDto.prototype, "offset", void 0);
//# sourceMappingURL=query-audit.dto.js.map