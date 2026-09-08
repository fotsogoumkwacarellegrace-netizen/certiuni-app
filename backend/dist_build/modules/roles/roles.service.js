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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RolesService = class RolesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    roleSelect = {
        id: true,
        name: true,
        description: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
    };
    async create(dto) {
        const roleName = dto.name.toUpperCase().trim();
        const existingRole = await this.prisma.role.findUnique({
            where: { name: roleName },
        });
        if (existingRole) {
            throw new common_1.ConflictException(`Le rôle "${roleName}" existe déjà.`);
        }
        return this.prisma.role.create({
            data: {
                name: roleName,
                description: dto.description,
                ...(dto.permissions && dto.permissions.length > 0
                    ? {
                        permissions: {
                            create: dto.permissions.map((code) => ({
                                permission: {
                                    connect: { code: code.toLowerCase().trim() },
                                },
                            })),
                        },
                    }
                    : {}),
            },
            select: this.roleSelect,
        });
    }
    async findAll() {
        return this.prisma.role.findMany({
            select: this.roleSelect,
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            select: this.roleSelect,
        });
        if (!role) {
            throw new common_1.NotFoundException(`Rôle avec l'ID #${id} introuvable.`);
        }
        return role;
    }
    async findByName(name) {
        const role = await this.prisma.role.findUnique({
            where: { name: name.toUpperCase() },
            select: this.roleSelect,
        });
        if (!role) {
            throw new common_1.NotFoundException(`Rôle "${name}" introuvable.`);
        }
        return role;
    }
    async update(id, dto) {
        await this.findOne(id);
        const updateData = { ...dto };
        if (dto.name) {
            updateData.name = dto.name.toUpperCase().trim();
            const existing = await this.prisma.role.findUnique({
                where: { name: updateData.name },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Le rôle "${updateData.name}" existe déjà.`);
            }
        }
        return this.prisma.role.update({
            where: { id },
            data: updateData,
            select: this.roleSelect,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.role.delete({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map