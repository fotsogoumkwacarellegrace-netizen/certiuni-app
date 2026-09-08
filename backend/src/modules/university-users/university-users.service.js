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
exports.UniversityUsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UniversityUsersService = class UniversityUsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    userSelect = {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        universityId: true,
        createdAt: true,
        updatedAt: true,
    };
    async attachUser(dto) {
        const { userId, universityId, role } = dto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur introuvable avec l'ID #${userId}.`);
        }
        const university = await this.prisma.university.findUnique({
            where: { id: universityId },
        });
        if (!university) {
            throw new common_1.NotFoundException(`Université introuvable avec l'ID #${universityId}.`);
        }
        if (user.universityId === universityId) {
            throw new common_1.ConflictException('L\'utilisateur est déjà rattaché à cette université.');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                universityId,
                role,
            },
            select: this.userSelect,
        });
    }
    async findByUniversity(universityId) {
        const university = await this.prisma.university.findUnique({
            where: { id: universityId },
        });
        if (!university) {
            throw new common_1.NotFoundException(`Université introuvable avec l'ID #${universityId}.`);
        }
        return this.prisma.user.findMany({
            where: { universityId },
            select: this.userSelect,
            orderBy: { lastName: 'asc' },
        });
    }
    async updateUserRole(userId, universityId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur introuvable avec l'ID #${userId}.`);
        }
        if (user.universityId !== universityId) {
            throw new common_1.BadRequestException('L\'utilisateur n\'appartient pas à l\'université spécifiée.');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { role: dto.role },
            select: this.userSelect,
        });
    }
    async detachUser(userId, universityId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur introuvable avec l'ID #${userId}.`);
        }
        if (user.universityId !== universityId) {
            throw new common_1.BadRequestException('L\'utilisateur n\'est pas rattaché à cette université.');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                universityId: null,
            },
            select: this.userSelect,
        });
    }
};
exports.UniversityUsersService = UniversityUsersService;
exports.UniversityUsersService = UniversityUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UniversityUsersService);
//# sourceMappingURL=university-users.service.js.map