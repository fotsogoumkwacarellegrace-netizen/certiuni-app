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
exports.SendNotificationDto = exports.NotificationType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "EMAIL";
    NotificationType["IN_APP"] = "IN_APP";
    NotificationType["BOTH"] = "BOTH";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
class SendNotificationDto {
    userId;
    title;
    message;
    type;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, title: { required: true, type: () => String }, message: { required: true, type: () => String }, type: { required: false, enum: require("./send-notification.dto").NotificationType } };
    }
}
exports.SendNotificationDto = SendNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'ID de l\'utilisateur destinataire (User)',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID du destinataire doit être un UUID valide.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le destinataire est obligatoire.' }),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Votre attestation est disponible !',
        description: 'Sujet ou titre de la notification',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le titre est obligatoire.' }),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Votre demande de diplôme certifié a été approuvée et traitée avec succès.',
        description: 'Contenu du message',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le message est obligatoire.' }),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: NotificationType,
        example: NotificationType.BOTH,
        description: 'Canal d\'envoi (EMAIL, IN_APP, BOTH)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(NotificationType, { message: 'Type de notification invalide.' }),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "type", void 0);
//# sourceMappingURL=send-notification.dto.js.map