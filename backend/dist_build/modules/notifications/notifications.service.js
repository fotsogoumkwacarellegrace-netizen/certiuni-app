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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const send_notification_dto_1 = require("./dto/send-notification.dto");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async send(dto) {
        const recipient = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });
        if (!recipient) {
            throw new common_1.NotFoundException(`Utilisateur destinataire introuvable (#${dto.userId}).`);
        }
        const channelType = dto.type || send_notification_dto_1.NotificationType.IN_APP;
        if (channelType === send_notification_dto_1.NotificationType.EMAIL || channelType === send_notification_dto_1.NotificationType.BOTH) {
            await this.sendEmail(recipient.email, dto.title, dto.message);
        }
        return this.prisma.notification.create({
            data: {
                userId: dto.userId,
                title: dto.title.trim(),
                message: dto.message.trim(),
                type: channelType,
                isRead: false,
            },
        });
    }
    async findAllForUser(userId, query) {
        const { isRead, type, limit = 20, offset = 0 } = query || {};
        return this.prisma.notification.findMany({
            where: {
                userId,
                ...(isRead !== undefined && { isRead }),
                ...(type && { type }),
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
        });
    }
    async markAsRead(id, userId) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId },
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification introuvable (#${id}).`);
        }
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    async sendEmail(email, title, message) {
        console.log(`[Email Envoyé] À: ${email} | Sujet: ${title} | Contenu: ${message}`);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map