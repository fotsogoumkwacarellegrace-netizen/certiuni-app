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
exports.AcademicLevelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AcademicLevelsService = class AcademicLevelsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    levelSelect = {
        id: true,
        name: true,
        code: true,
        universityId: true,
        university: {
            select: {
                id: true,
                name: true,
                code: true,
            },
        },
        createdAt: true,
        updatedAt: true,
    };
    async create(dto) {
        const levelCode = dto.code.toUpperCase().trim();
        const university = await this.prisma.university.findUnique({
            where: { id: dto.universityId },
        });
        if (!university) {
            throw new common_1.NotFoundException(`Université introuvable avec l'ID #${dto.universityId}.`);
        }
        const existingLevel = await this.prisma.academicLevel.findFirst({
            where: {
                code: levelCode,
                universityId: dto.universityId,
            },
        });
        if (existingLevel) {
            throw new common_1.ConflictException(`Le niveau académique avec le code "${levelCode}" existe déjà pour cette université.`);
        }
        return this.prisma.academicLevel.create({
            data: {
                name: dto.name.trim(),
                code: levelCode,
                universityId: dto.universityId,
            },
            select: this.levelSelect,
        });
    }
    async findAll() {
        return this.prisma.academicLevel.findMany({
            select: this.levelSelect,
            orderBy: { name: 'asc' },
        });
    }
    async findByUniversity(universityId) {
        return this.prisma.academicLevel.findMany({
            where: { universityId },
            select: this.levelSelect,
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const level = await this.prisma.academicLevel.findUnique({
            where: { id },
            select: this.levelSelect,
        });
        if (!level) {
            throw new common_1.NotFoundException(`Niveau académique introuvable avec l'ID #${id}.`);
        }
        return level;
    }
    async update(id, dto) {
        const currentLevel = await this.findOne(id);
        const updateData = { ...dto };
        if (dto.code) {
            updateData.code = dto.code.toUpperCase().trim();
            const targetUniversityId = dto.universityId || currentLevel.universityId;
            const existing = await this.prisma.academicLevel.findFirst({
                where: {
                    code: updateData.code,
                    universityId: targetUniversityId,
                },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Le code "${updateData.code}" est déjà attribué à un autre niveau dans cette université.`);
            }
        }
        return this.prisma.academicLevel.update({
            where: { id },
            data: updateData,
            select: this.levelSelect,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.academicLevel.delete({
            where: { id },
            select: { id: true, name: true, code: true },
        });
    }
};
exports.AcademicLevelsService = AcademicLevelsService;
exports.AcademicLevelsService = AcademicLevelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AcademicLevelsService);
//# sourceMappingURL=academic-levels.service.js.map