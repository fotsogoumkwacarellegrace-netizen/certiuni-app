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
exports.ProgramsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProgramsService = class ProgramsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    programSelect = {
        id: true,
        name: true,
        code: true,
        description: true,
        isActive: true,
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
        _count: {
            select: {
                certificates: true,
            },
        },
    };
    async create(dto) {
        const programCode = dto.code.toUpperCase().trim();
        const university = await this.prisma.university.findUnique({
            where: { id: dto.universityId },
        });
        if (!university) {
            throw new common_1.NotFoundException(`Université introuvable avec l'ID #${dto.universityId}.`);
        }
        const existingProgram = await this.prisma.program.findFirst({
            where: {
                code: programCode,
                universityId: dto.universityId,
            },
        });
        if (existingProgram) {
            throw new common_1.ConflictException(`La filière avec le code "${programCode}" existe déjà au sein de cette université.`);
        }
        return this.prisma.program.create({
            data: {
                name: dto.name.trim(),
                code: programCode,
                description: dto.description,
                universityId: dto.universityId,
            },
            select: this.programSelect,
        });
    }
    async findAll() {
        return this.prisma.program.findMany({
            select: this.programSelect,
            orderBy: { name: 'asc' },
        });
    }
    async findByUniversity(universityId) {
        const university = await this.prisma.university.findUnique({
            where: { id: universityId },
        });
        if (!university) {
            throw new common_1.NotFoundException(`Université introuvable avec l'ID #${universityId}.`);
        }
        return this.prisma.program.findMany({
            where: { universityId },
            select: this.programSelect,
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const program = await this.prisma.program.findUnique({
            where: { id },
            select: this.programSelect,
        });
        if (!program) {
            throw new common_1.NotFoundException(`Filière introuvable avec l'ID #${id}.`);
        }
        return program;
    }
    async update(id, dto) {
        const currentProgram = await this.findOne(id);
        const updateData = { ...dto };
        if (dto.code) {
            updateData.code = dto.code.toUpperCase().trim();
            const targetUniversityId = dto.universityId || currentProgram.universityId;
            const existing = await this.prisma.program.findFirst({
                where: {
                    code: updateData.code,
                    universityId: targetUniversityId,
                },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Le code "${updateData.code}" est déjà utilisé par une autre filière dans cette université.`);
            }
        }
        if (dto.name) {
            updateData.name = dto.name.trim();
        }
        return this.prisma.program.update({
            where: { id },
            data: updateData,
            select: this.programSelect,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.program.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                code: true,
            },
        });
    }
};
exports.ProgramsService = ProgramsService;
exports.ProgramsService = ProgramsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgramsService);
//# sourceMappingURL=programs.service.js.map