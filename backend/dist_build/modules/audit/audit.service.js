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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditService = class AuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    auditInclude = {
        user: {
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        },
    };
    async log(params) {
        return this.prisma.auditLog.create({
            data: {
                userId: params.userId,
                action: params.action,
                ipAddress: params.ipAddress,
                userAgent: params.userAgent,
                metadata: {
                    entity: params.entity,
                    ...(params.entityId ? { entityId: params.entityId } : {}),
                    ...(params.details ? { details: params.details } : {}),
                },
            },
        });
    }
    async findAll(query) {
        const { userId, action, startDate, endDate, limit = 50, offset = 0, } = query;
        const where = {
            ...(userId && { userId }),
            ...(action && { action: action }),
            ...((startDate || endDate) && {
                createdAt: {
                    ...(startDate && { gte: new Date(startDate) }),
                    ...(endDate && { lte: new Date(endDate) }),
                },
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                take: limit,
                skip: offset,
                include: this.auditInclude,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                limit,
                offset,
            },
        };
    }
    async findOne(id) {
        const log = await this.prisma.auditLog.findUnique({
            where: { id },
            include: this.auditInclude,
        });
        if (!log) {
            throw new common_1.NotFoundException(`Entrée d'audit introuvable (#${id}).`);
        }
        return log;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map