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
exports.UpdateRequestStatusDto = exports.RequestStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "PENDING";
    RequestStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RequestStatus["APPROVED"] = "APPROVED";
    RequestStatus["REJECTED"] = "REJECTED";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
class UpdateRequestStatusDto {
    status;
    adminNotes;
}
exports.UpdateRequestStatusDto = UpdateRequestStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: RequestStatus,
        example: RequestStatus.APPROVED,
        description: 'Nouveau statut de la demande',
    }),
    (0, class_validator_1.IsEnum)(RequestStatus, { message: 'Le statut fourni est invalide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le statut est obligatoire.' }),
    __metadata("design:type", String)
], UpdateRequestStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Le diplôme a été authentifié avec succès dans le registre officiel.',
        description: 'Remarques ou motifs en cas de rejet/validation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRequestStatusDto.prototype, "adminNotes", void 0);
//# sourceMappingURL=update-request-status.dto.js.map