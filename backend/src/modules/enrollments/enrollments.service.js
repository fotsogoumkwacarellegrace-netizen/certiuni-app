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
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EnrollmentsService = class EnrollmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    enrollmentSelect = {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        student: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        },
        program: {
            select: {
                id: true,
                name: true,
                code: true,
            },
        },
        academicLevel: {
            select: {
                id: true,
                name: true,
                code: true,
            },
        },
        academicYear: {
            select: {
                id: true,
                year: true,
                isCurrent: true,
            },
        },
    };
    async create(dto) {
        const { studentId, programId, academicLevelId, academicYearId } = dto;
        const student = await this.prisma.user.findUnique({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Étudiant introuvable avec l'ID #${studentId}.`);
        }
        const program = await this.prisma.program.findUnique({
            where: { id: programId },
        });
        if (!program) {
            throw new common_1.NotFoundException(`Filière introuvable avec l'ID #${programId}.`);
        }
        const academicLevel = await this.prisma.academicLevel.findUnique({
            where: { id: academicLevelId },
        });
        if (!academicLevel) {
            throw new common_1.NotFoundException(`Niveau académique introuvable avec l'ID #${academicLevelId}.`);
        }
        const academicYear = await this.prisma.academicYear.findUnique({
            where: { id: academicYearId },
        });
        if (!academicYear) {
            throw new common_1.NotFoundException(`Année académique introuvable avec l'ID #${academicYearId}.`);
        }
        const existingEnrollment = await this.prisma.enrollment.findFirst({
            where: {
                studentId,
                academicYearId,
            },
        });
        if (existingEnrollment) {
            throw new common_1.ConflictException('Cet étudiant est déjà inscrit pour cette année académique.');
        }
        return this.prisma.enrollment.create({
            data: {
                studentId,
                programId,
                academicLevelId,
                academicYearId,
            },
            select: this.enrollmentSelect,
        });
    }
    async findAll() {
        return this.prisma.enrollment.findMany({
            select: this.enrollmentSelect,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id },
            select: this.enrollmentSelect,
        });
        if (!enrollment) {
            throw new common_1.NotFoundException(`Inscription introuvable avec l'ID #${id}.`);
        }
        return enrollment;
    }
    async findByStudent(studentId) {
        return this.prisma.enrollment.findMany({
            where: { studentId },
            select: this.enrollmentSelect,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByProgramAndYear(programId, academicYearId) {
        return this.prisma.enrollment.findMany({
            where: { programId, academicYearId },
            select: this.enrollmentSelect,
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, dto) {
        await this.findOne(id);
        return this.prisma.enrollment.update({
            where: { id },
            data: { status: dto.status },
            select: this.enrollmentSelect,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.enrollment.delete({
            where: { id },
            select: {
                id: true,
                status: true,
            },
        });
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map