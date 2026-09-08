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
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrganizationService = class OrganizationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    organizationInclude = {
        university: {
            select: { id: true, name: true, code: true },
        },
        parent: {
            select: { id: true, name: true, code: true, type: true },
        },
        children: {
            select: { id: true, name: true, code: true, type: true },
        },
        _count: {
            select: {
                programs: true,
                students: true,
                documents: true,
            },
        },
    };
    async create(dto) {
        const universityExists = await this.prisma.university.findUnique({
            where: { id: dto.institutionId },
        });
        if (!universityExists) {
            throw new common_1.NotFoundException(`Université introuvable (#${dto.institutionId}).`);
        }
        const codeExists = await this.prisma.organization.findFirst({
            where: { code: dto.code },
        });
        if (codeExists) {
            throw new common_1.ConflictException(`Une organisation avec le code "${dto.code}" existe déjà.`);
        }
        if (dto.parentId) {
            const parentExists = await this.prisma.organization.findUnique({
                where: { id: dto.parentId },
            });
            if (!parentExists) {
                throw new common_1.NotFoundException(`Organisation parente introuvable (#${dto.parentId}).`);
            }
        }
        return this.prisma.organization.create({
            data: {
                universityId: dto.institutionId,
                name: dto.name.trim(),
                code: dto.code.trim().toUpperCase(),
                type: dto.type,
                description: dto.description?.trim(),
                parentId: dto.parentId,
            },
            include: this.organizationInclude,
        });
    }
    async findAll(institutionId) {
        return this.prisma.organization.findMany({
            where: {
                ...(institutionId && { universityId: institutionId }),
            },
            include: this.organizationInclude,
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const organization = await this.prisma.organization.findUnique({
            where: { id },
            include: this.organizationInclude,
        });
        if (!organization) {
            throw new common_1.NotFoundException(`Organisation introuvable (#${id}).`);
        }
        return organization;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.code) {
            const codeExists = await this.prisma.organization.findFirst({
                where: { code: dto.code, NOT: { id } },
            });
            if (codeExists) {
                throw new common_1.ConflictException(`Le code "${dto.code}" est déjà utilisé.`);
            }
        }
        return this.prisma.organization.update({
            where: { id },
            data: {
                ...(dto.institutionId && { universityId: dto.institutionId }),
                ...(dto.name && { name: dto.name.trim() }),
                ...(dto.code && { code: dto.code.trim().toUpperCase() }),
                ...(dto.type && { type: dto.type }),
                ...(dto.description !== undefined && { description: dto.description?.trim() }),
                ...(dto.parentId !== undefined && { parentId: dto.parentId }),
            },
            include: this.organizationInclude,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.organization.delete({
            where: { id },
        });
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map