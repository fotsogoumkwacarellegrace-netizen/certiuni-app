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
exports.TariffsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TariffsService = class TariffsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    tariffInclude = {
        service: {
            select: {
                id: true,
                name: true,
                code: true,
                price: true,
            },
        },
        university: {
            select: {
                id: true,
                name: true,
                code: true,
            },
        },
    };
    async create(dto) {
        const serviceExists = await this.prisma.service.findUnique({
            where: { id: dto.serviceId },
        });
        if (!serviceExists) {
            throw new common_1.NotFoundException('Le service spécifié n\'existe pas.');
        }
        if (dto.universityId) {
            const univExists = await this.prisma.university.findUnique({
                where: { id: dto.universityId },
            });
            if (!univExists) {
                throw new common_1.NotFoundException('L\'université spécifiée n\'existe pas.');
            }
            const duplicate = await this.prisma.service.findFirst({
                where: {
                    id: dto.serviceId,
                },
            });
            if (duplicate) {
                throw new common_1.ConflictException('Un tarif existe déjà pour ce service au sein de cette université.');
            }
        }
        return this.prisma.service.create({
            data: {
                name: dto.name.trim(),
                code: `TARIFF-${Date.now()}`,
                description: dto.name.trim(),
                universityId: 'default-university-id',
                documentTypeId: 'default-document-type-id',
            },
            include: this.tariffInclude,
        });
    }
    async findAll(universityId) {
        return this.prisma.service.findMany({
            where: {},
            include: this.tariffInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const tariff = await this.prisma.service.findUnique({
            where: { id },
            include: this.tariffInclude,
        });
        if (!tariff) {
            throw new common_1.NotFoundException(`Tarif introuvable (#${id}).`);
        }
        return tariff;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.service.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name.trim() }),
                ...(dto.amount !== undefined && { price: dto.amount }),
                ...(dto.currency && { currency: dto.currency }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
            include: this.tariffInclude,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.service.delete({
            where: { id },
        });
    }
};
exports.TariffsService = TariffsService;
exports.TariffsService = TariffsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TariffsService);
//# sourceMappingURL=tariffs.service.js.map