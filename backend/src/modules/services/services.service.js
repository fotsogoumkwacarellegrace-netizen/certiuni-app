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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.service.findFirst({
            where: { code: dto.code.trim().toUpperCase() },
        });
        if (existing) {
            throw new common_1.ConflictException(`Un service avec le code "${dto.code}" existe déjà.`);
        }
        return this.prisma.service.create({
            data: {
                name: dto.name.trim(),
                code: dto.code.trim().toUpperCase(),
                description: dto.description?.trim(),
                universityId: 'default-university-id',
                documentTypeId: 'default-document-type-id',
            },
        });
    }
    async findAll(includeInactive = false) {
        return this.prisma.service.findMany({
            where: {},
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service introuvable (#${id}).`);
        }
        return service;
    }
    async findByCode(code) {
        const service = await this.prisma.service.findFirst({
            where: { code: code.trim().toUpperCase() },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service introuvable avec le code "${code}".`);
        }
        return service;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.code) {
            const existing = await this.prisma.service.findFirst({
                where: {
                    code: dto.code.trim().toUpperCase(),
                    NOT: { id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException(`Un autre service utilise déjà le code "${dto.code}".`);
            }
        }
        return this.prisma.service.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name.trim() }),
                ...(dto.code && { code: dto.code.trim().toUpperCase() }),
                ...(dto.description !== undefined && { description: dto.description.trim() }),
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.service.delete({
            where: { id },
        });
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map