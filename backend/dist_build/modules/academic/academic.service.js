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
exports.AcademicService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AcademicService = class AcademicService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    resolveUniversityId(user, targetUniversityId) {
        const universityId = user.role === client_1.UserRole.SUPER_ADMIN ? targetUniversityId : user.universityId;
        if (!universityId) {
            throw new common_1.ForbiddenException("L'ID de l'université est obligatoire.");
        }
        return universityId;
    }
    async createYear(dto, user, universityId) {
        const targetUnivId = this.resolveUniversityId(user, universityId);
        const existing = await this.prisma.academicYear.findFirst({
            where: { year: dto.year, universityId: targetUnivId },
        });
        if (existing) {
            throw new common_1.ConflictException(`L'année académique ${dto.year} existe déjà.`);
        }
        return this.prisma.academicYear.create({
            data: {
                year: dto.year,
                universityId: targetUnivId,
            },
        });
    }
    async findAllYears(user) {
        const whereCondition = user.role === client_1.UserRole.SUPER_ADMIN ? {} : { universityId: user.universityId };
        return this.prisma.academicYear.findMany({
            where: whereCondition,
            orderBy: { year: 'desc' },
        });
    }
    async createProgram(dto, user, universityId) {
        const targetUnivId = this.resolveUniversityId(user, universityId);
        const existing = await this.prisma.program.findFirst({
            where: { code: dto.code, universityId: targetUnivId },
        });
        if (existing) {
            throw new common_1.ConflictException(`Un programme avec le code ${dto.code} existe déjà.`);
        }
        return this.prisma.program.create({
            data: {
                name: dto.name,
                code: dto.code,
                description: dto.description,
                universityId: targetUnivId,
            },
        });
    }
    async findAllPrograms(user) {
        const whereCondition = user.role === client_1.UserRole.SUPER_ADMIN ? {} : { universityId: user.universityId };
        return this.prisma.program.findMany({
            where: whereCondition,
            orderBy: { name: 'asc' },
        });
    }
    async createLevel(dto, user, universityId) {
        const targetUnivId = this.resolveUniversityId(user, universityId);
        const existing = await this.prisma.academicLevel.findFirst({
            where: { code: dto.code, universityId: targetUnivId },
        });
        if (existing) {
            throw new common_1.ConflictException(`Un niveau avec le code ${dto.code} existe déjà.`);
        }
        return this.prisma.academicLevel.create({
            data: {
                name: dto.name,
                code: dto.code,
                universityId: targetUnivId,
            },
        });
    }
    async findAllLevels(user) {
        const whereCondition = user.role === client_1.UserRole.SUPER_ADMIN ? {} : { universityId: user.universityId };
        return this.prisma.academicLevel.findMany({
            where: whereCondition,
            orderBy: { name: 'asc' },
        });
    }
};
exports.AcademicService = AcademicService;
exports.AcademicService = AcademicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AcademicService);
//# sourceMappingURL=academic.service.js.map