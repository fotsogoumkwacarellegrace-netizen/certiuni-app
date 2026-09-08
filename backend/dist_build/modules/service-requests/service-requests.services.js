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
exports.ServiceRequestsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const update_request_status_dto_1 = require("./dto/update-request-status.dto");
let ServiceRequestsService = class ServiceRequestsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    requestInclude = {
        service: true,
        student: {
            select: {
                id: true,
                matricule: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        },
        enrollment: {
            select: {
                id: true,
                academicYear: { select: { year: true } },
                program: { select: { name: true, code: true } },
            },
        },
    };
    async create(userId, dto) {
        const student = await this.prisma.student.findUnique({
            where: { userId },
        });
        if (!student) {
            throw new common_1.BadRequestException('Seuls les étudiants enregistrés peuvent soumettre une demande de service.');
        }
        const service = await this.prisma.service.findUnique({
            where: { id: dto.serviceId },
        });
        if (!service) {
            throw new common_1.NotFoundException('Le service demandé n\'est pas disponible ou est inactif.');
        }
        if (dto.enrollmentId) {
            const enrollment = await this.prisma.enrollment.findFirst({
                where: { id: dto.enrollmentId, studentId: student.id },
            });
            if (!enrollment) {
                throw new common_1.NotFoundException('L\'inscription universitaire spécifiée n\'existe pas ou ne vous appartient pas.');
            }
        }
        return this.prisma.serviceRequest.create({
            data: {
                studentId: student.id,
                serviceId: dto.serviceId,
                enrollmentId: dto.enrollmentId,
                notes: dto.notes?.trim(),
                status: update_request_status_dto_1.ServiceRequestStatus.PENDING,
            },
            include: this.requestInclude,
        });
    }
    async findAllForStudent(userId) {
        const student = await this.prisma.student.findUnique({
            where: { userId },
        });
        if (!student) {
            return [];
        }
        return this.prisma.serviceRequest.findMany({
            where: { studentId: student.id },
            include: this.requestInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAll(status) {
        return this.prisma.serviceRequest.findMany({
            where: status ? { status } : {},
            include: this.requestInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, currentUser) {
        const request = await this.prisma.serviceRequest.findUnique({
            where: { id },
            include: this.requestInclude,
        });
        if (!request) {
            throw new common_1.NotFoundException(`Demande de service introuvable (#${id}).`);
        }
        if (currentUser.role === client_1.UserRole.STUDENT &&
            request.student.user.id !== currentUser.id) {
            throw new common_1.ForbiddenException('Vous n\'avez pas la permission de consulter cette demande.');
        }
        return request;
    }
    async updateStatus(id, dto) {
        await this.prisma.serviceRequest.findUniqueOrThrow({
            where: { id },
            select: { id: true },
        });
        return this.prisma.serviceRequest.update({
            where: { id },
            data: {
                status: dto.status,
                adminNotes: dto.adminNotes?.trim(),
            },
            include: this.requestInclude,
        });
    }
    async cancelByStudent(id, userId) {
        const request = await this.prisma.serviceRequest.findUnique({
            where: { id },
            include: { student: true },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Demande de service introuvable (#${id}).`);
        }
        if (request.student.userId !== userId) {
            throw new common_1.ForbiddenException('Vous n\'êtes pas autorisé à annuler cette demande.');
        }
        if (request.status !== update_request_status_dto_1.ServiceRequestStatus.PENDING) {
            throw new common_1.BadRequestException('Impossible d\'annuler une demande déjà en cours de traitement ou finalisée.');
        }
        return this.prisma.serviceRequest.update({
            where: { id },
            data: { status: update_request_status_dto_1.ServiceRequestStatus.CANCELLED },
            include: this.requestInclude,
        });
    }
};
exports.ServiceRequestsService = ServiceRequestsService;
exports.ServiceRequestsService = ServiceRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceRequestsService);
//# sourceMappingURL=service-requests.services.js.map