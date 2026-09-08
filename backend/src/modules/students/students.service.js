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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    studentSelect = {
        id: true,
        matricule: true,
        birthDate: true,
        birthPlace: true,
        nationality: true,
        gender: true,
        idCardNumber: true,
        universityId: true,
        createdAt: true,
        updatedAt: true,
        user: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
                universityId: true,
                university: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
        },
        enrollments: {
            select: {
                id: true,
                status: true,
                program: { select: { name: true, code: true } },
                academicLevel: { select: { code: true } },
                academicYear: { select: { year: true } },
            },
        },
    };
    async create(dto) {
        const matriculeClean = dto.matricule.trim().toUpperCase();
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur introuvable avec l'ID #${dto.userId}.`);
        }
        const existingStudentProfile = await this.prisma.student.findUnique({
            where: { userId: dto.userId },
        });
        if (existingStudentProfile) {
            throw new common_1.ConflictException('Cet utilisateur possède déjà un profil étudiant.');
        }
        const existingMatricule = await this.prisma.student.findFirst({
            where: { matricule: matriculeClean },
        });
        if (existingMatricule) {
            throw new common_1.ConflictException(`Le matricule "${matriculeClean}" est déjà attribué.`);
        }
        return this.prisma.student.create({
            data: {
                userId: dto.userId,
                matricule: matriculeClean,
                firstName: '',
                lastName: '',
                universityId: 'default-university-id',
                birthDate: new Date(dto.birthDate),
                birthPlace: dto.birthPlace.trim(),
                nationality: dto.nationality.trim(),
                gender: dto.gender,
                idCardNumber: dto.idCardNumber ? dto.idCardNumber.trim() : null,
            },
            select: this.studentSelect,
        });
    }
    async findAll() {
        return this.prisma.student.findMany({
            select: this.studentSelect,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            select: this.studentSelect,
        });
        if (!student) {
            throw new common_1.NotFoundException(`Profil étudiant introuvable avec l'ID #${id}.`);
        }
        return student;
    }
    async findByMatricule(matricule, universityId) {
        const student = await this.prisma.student.findUnique({
            where: {
                matricule_universityId: {
                    matricule: matricule.trim().toUpperCase(),
                    universityId: universityId,
                },
            },
            select: this.studentSelect,
        });
        if (!student) {
            throw new common_1.NotFoundException(`Étudiant introuvable avec le matricule "${matricule}".`);
        }
        return student;
    }
    async findByUserId(userId) {
        const student = await this.prisma.student.findUnique({
            where: { userId },
            select: this.studentSelect,
        });
        if (!student) {
            throw new common_1.NotFoundException(`Aucun profil étudiant associé à l'utilisateur #${userId}.`);
        }
        return student;
    }
    async update(id, dto) {
        const studentToUpdate = await this.findOne(id);
        const updateData = { ...dto };
        if (dto.matricule) {
            updateData.matricule = dto.matricule.trim().toUpperCase();
            const existing = await this.prisma.student.findUnique({
                where: {
                    matricule_universityId: {
                        matricule: updateData.matricule,
                        universityId: studentToUpdate.universityId,
                    },
                },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Le matricule "${updateData.matricule}" appartient à un autre étudiant.`);
            }
        }
        if (dto.birthDate) {
            updateData.birthDate = new Date(dto.birthDate);
        }
        return this.prisma.student.update({
            where: { id },
            data: updateData,
            select: this.studentSelect,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.student.delete({
            where: { id },
            select: {
                id: true,
                matricule: true,
            },
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map