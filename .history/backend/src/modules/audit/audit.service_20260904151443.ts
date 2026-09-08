import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryAuditDto } from './dto/query-audit.dto';

export interface CreateAuditLogParams {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}

@Injectable()
export class AuditService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly auditInclude = {
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

    async log(params: CreateAuditLogParams) {
        return this.prisma.auditLog.create({
            data: {
                userId: params.userId,
                action: params.action.trim(),
                entity: params.entity.trim(),
                entityId: params.entityId,
                details: params.details ? JSON.stringify(params.details) : null,
                ipAddress: params.ipAddress,
                userAgent: params.userAgent,
            },
        });
    }

    async findAll(query: QueryAuditDto) {
        const {
            userId,
            action,
            entity,
            entityId,
            startDate,
            endDate,
            limit = 50,
            offset = 0,
        } = query;

        const where: any = {
            ...(userId && { userId }),
            ...(action && { action: { contains: action, mode: 'insensitive' } }),
            ...(entity && { entity: { contains: entity, mode: 'insensitive' } }),
            ...(entityId && { entityId }),
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

    async findOne(id: string) {
        const log = await this.prisma.auditLog.findUnique({
            where: { id },
            include: this.auditInclude,
        });

        if (!log) {
            throw new NotFoundException(`Entrée d'audit introuvable (#${id}).`);
        }

        return log;
    }
}