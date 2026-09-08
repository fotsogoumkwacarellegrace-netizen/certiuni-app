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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const update_request_status_dto_1 = require("./dto/update-request-status.dto");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
let RequestsService = class RequestsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const universityExists = await this.prisma.university.findUnique({
            where: { id: dto.universityId },
        });
        if (!universityExists) {
            throw new common_1.NotFoundException('Université introuvable.');
        }
        const trackingCode = `REQ-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`;
        return this.prisma.request.create({
            data: {
                requestNumber: trackingCode,
                status: update_request_status_dto_1.RequestStatus.PENDING,
                student: { connect: { id: 'default-student-id' } },
                service: { connect: { id: 'default-service-id' } },
            },
            select: {
                id: true,
                status: true,
                createdAt: true,
            },
        });
    }
    async getStatusByTrackingCode(trackingCode) {
        const request = await this.prisma.request.findFirst({
            where: { id: trackingCode },
            select: {
                id: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Aucune demande trouvée avec le code ${trackingCode}.`);
        }
        return request;
    }
    async findAll(user) {
        return this.prisma.request.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, user) {
        const request = await this.prisma.request.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Demande #${id} introuvable.`);
        }
        if (user.role !== client_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Accès non autorisé à cette demande.');
        }
        return request;
    }
    async updateStatus(id, dto, user) {
        await this.findOne(id, user);
        return this.prisma.request.update({
            where: { id },
            data: {
                status: dto.status,
            },
        });
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map