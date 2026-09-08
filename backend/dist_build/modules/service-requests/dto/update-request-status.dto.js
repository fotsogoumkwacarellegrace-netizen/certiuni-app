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
exports.UpdateRequestStatusDto = exports.ServiceRequestStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ServiceRequestStatus;
(function (ServiceRequestStatus) {
    ServiceRequestStatus["PENDING"] = "PENDING";
    ServiceRequestStatus["PROCESSING"] = "PROCESSING";
    ServiceRequestStatus["COMPLETED"] = "COMPLETED";
    ServiceRequestStatus["REJECTED"] = "REJECTED";
    ServiceRequestStatus["CANCELLED"] = "CANCELLED";
})(ServiceRequestStatus || (exports.ServiceRequestStatus = ServiceRequestStatus = {}));
class UpdateRequestStatusDto {
    status;
    adminNotes;
}
exports.UpdateRequestStatusDto = UpdateRequestStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ServiceRequestStatus,
        example: ServiceRequestStatus.PROCESSING,
        description: 'Nouveau statut de la demande',
    }),
    (0, class_validator_1.IsEnum)(ServiceRequestStatus, { message: 'Statut de demande invalide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le statut est obligatoire.' }),
    __metadata("design:type", String)
], UpdateRequestStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Demande prise en charge par le service de la scolarité.',
        description: 'Raison du rejet ou remarque du gestionnaire',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRequestStatusDto.prototype, "adminNotes", void 0);
//# sourceMappingURL=update-request-status.dto.js.map