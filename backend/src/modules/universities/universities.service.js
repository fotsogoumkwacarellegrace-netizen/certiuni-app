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
exports.UniversitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UniversitiesService = class UniversitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    universitySelect = {
        id: true,
        name: true,
        code: true,
        domain: true,
        contactEmail: true,
        address: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
            select: {
                users: true,
                certificates: true,
            },
        },
    };
    async create(dto) {
        const universityCode = dto.code.toUpperCase().trim();
        const existing = await this.prisma.university.findUnique({
            where: { code: universityCode },
        });
        if (existing) {
            throw new common_1.ConflictException(`Une université avec le code "${universityCode}" existe déjà.`);
        }
        return this.prisma.university.create({
            data: {
                name: dto.name.trim(),
                code: universityCode,
            },
            select: this.universitySelect,
        });
    }
    async findAll() {
        return this.prisma.university.findMany({
            select: this.universitySelect,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const university = await this.prisma.university.findUnique({
            where: { id },
            select: this.universitySelect,
        });
        if (!university) {
            throw new common_1.NotFoundException(`Université introuvable avec l'ID #${id}.`);
        }
        return university;
    }
    async findByCode(code) {
        const university = await this.prisma.university.findUnique({
            where: { code: code.toUpperCase().trim() },
            select: this.universitySelect,
        });
        if (!university) {
            throw new common_1.NotFoundException(`Université introuvable avec le code "${code}".`);
        }
        return university;
    }
    async update(id, dto) {
        await this.findOne(id);
        const updateData = { ...dto };
        if (dto.code) {
            updateData.code = dto.code.toUpperCase().trim();
            const existing = await this.prisma.university.findUnique({
                where: { code: updateData.code },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Le code "${updateData.code}" est déjà utilisé par une autre université.`);
            }
        }
        if (dto.name) {
            updateData.name = dto.name.trim();
        }
        if (dto.domain) {
            updateData.domain = dto.domain.toLowerCase().trim();
        }
        if (dto.contactEmail) {
            updateData.contactEmail = dto.contactEmail.toLowerCase().trim();
        }
        return this.prisma.university.update({
            where: { id },
            data: updateData,
            select: this.universitySelect,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.university.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                code: true,
            },
        });
    }
};
exports.UniversitiesService = UniversitiesService;
exports.UniversitiesService = UniversitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UniversitiesService);
//# sourceMappingURL=universities.service.js.map