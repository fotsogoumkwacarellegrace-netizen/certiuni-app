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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PermissionsService = class PermissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    permissionSelect = {
        id: true,
        code: true,
        description: true,
        createdAt: true,
    };
    async create(dto) {
        const permissionCode = dto.code.toLowerCase().trim();
        const existingPermission = await this.prisma.permission.findUnique({
            where: { code: permissionCode },
        });
        if (existingPermission) {
            throw new common_1.ConflictException(`La permission "${permissionCode}" existe déjà.`);
        }
        return this.prisma.permission.create({
            data: {
                code: permissionCode,
                description: dto.description,
            },
            select: this.permissionSelect,
        });
    }
    async findAll() {
        return this.prisma.permission.findMany({
            select: this.permissionSelect,
            orderBy: { code: 'asc' },
        });
    }
    async findOne(id) {
        const permission = await this.prisma.permission.findUnique({
            where: { id },
            select: this.permissionSelect,
        });
        if (!permission) {
            throw new common_1.NotFoundException(`Permission avec l'ID #${id} introuvable.`);
        }
        return permission;
    }
    async assignPermissionsToRole(dto) {
        const { roleId, permissions } = dto;
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Rôle introuvable avec l'ID #${roleId}.`);
        }
        const cleanedPermissions = permissions.map((p) => p.toLowerCase().trim());
        const permissionRecords = await this.prisma.permission.findMany({
            where: { code: { in: cleanedPermissions } },
            select: { id: true },
        });
        await this.prisma.rolePermission.deleteMany({
            where: { roleId },
        });
        if (permissionRecords.length > 0) {
            await this.prisma.rolePermission.createMany({
                data: permissionRecords.map((permission) => ({
                    roleId,
                    permissionId: permission.id,
                })),
            });
        }
        return this.prisma.role.findUnique({
            where: { id: roleId },
            select: {
                id: true,
                name: true,
                permissions: {
                    select: {
                        permission: {
                            select: { id: true, code: true },
                        },
                    },
                },
                updatedAt: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.permission.delete({
            where: { id },
            select: {
                id: true,
                code: true,
            },
        });
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map