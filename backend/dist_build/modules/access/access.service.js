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
exports.AccessService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AccessService = class AccessService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAccess(dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
            select: {
                id: true,
                role: true,
                universityId: true,
                isActive: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID #${dto.userId} introuvable.`);
        }
        if (!user.isActive) {
            return { isAllowed: false, reason: 'Le compte utilisateur est désactivé.' };
        }
        if (user.role === client_1.UserRole.SUPER_ADMIN) {
            return { isAllowed: true };
        }
        if (dto.universityId && user.universityId !== dto.universityId) {
            return {
                isAllowed: false,
                reason: 'L\'utilisateur n\'appartient pas à l\'université ciblée par cette opération.',
            };
        }
        const roleRecord = await this.prisma.role.findFirst({
            where: { name: user.role.toString() },
            select: {
                permissions: {
                    select: {
                        permission: {
                            select: { code: true },
                        },
                    },
                },
            },
        });
        if (!roleRecord) {
            return { isAllowed: false, reason: 'Aucun profil de rôle correspondant n\'a été trouvé.' };
        }
        const permissionCodes = roleRecord.permissions.map((p) => p.permission.code);
        const hasPermission = permissionCodes.includes(dto.permission.toLowerCase().trim());
        if (!hasPermission) {
            return {
                isAllowed: false,
                reason: `La permission "${dto.permission}" n'est pas accordée à ce rôle.`,
            };
        }
        return { isAllowed: true };
    }
    async getUserEffectivePermissions(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true,
                universityId: true,
                isActive: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur introuvable.`);
        }
        if (user.role === client_1.UserRole.SUPER_ADMIN) {
            const allPermissions = await this.prisma.permission.findMany({ select: { code: true } });
            return {
                userId: user.id,
                role: user.role,
                isSuperAdmin: true,
                permissions: allPermissions.map((p) => p.code),
            };
        }
        const roleRecord = await this.prisma.role.findFirst({
            where: { name: user.role.toString() },
            select: {
                permissions: {
                    select: {
                        permission: {
                            select: { code: true },
                        },
                    },
                },
            },
        });
        return {
            userId: user.id,
            role: user.role,
            universityId: user.universityId,
            isSuperAdmin: false,
            permissions: roleRecord?.permissions.map((p) => p.permission.code) || [],
        };
    }
};
exports.AccessService = AccessService;
exports.AccessService = AccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccessService);
//# sourceMappingURL=access.service.js.map