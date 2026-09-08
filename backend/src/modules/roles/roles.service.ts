import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly roleSelect = {
        id: true,
        name: true,
        description: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
    };

    async create(dto: CreateRoleDto) {
        const roleName = dto.name.toUpperCase().trim();

        const existingRole = await this.prisma.role.findUnique({
            where: { name: roleName },
        });

        if (existingRole) {
            throw new ConflictException(`Le rôle "${roleName}" existe déjà.`);
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

    async findOne(id: string) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            select: this.roleSelect,
        });

        if (!role) {
            throw new NotFoundException(`Rôle avec l'ID #${id} introuvable.`);
        }

        return role;
    }

    async findByName(name: string) {
        const role = await this.prisma.role.findUnique({
            where: { name: name.toUpperCase() },
            select: this.roleSelect,
        });

        if (!role) {
            throw new NotFoundException(`Rôle "${name}" introuvable.`);
        }

        return role;
    }

    async update(id: string, dto: UpdateRoleDto) {
        await this.findOne(id);

        const updateData: any = { ...dto };

        if (dto.name) {
            updateData.name = dto.name.toUpperCase().trim();
            const existing = await this.prisma.role.findUnique({
                where: { name: updateData.name },
            });
            if (existing && existing.id !== id) {
                throw new ConflictException(`Le rôle "${updateData.name}" existe déjà.`);
            }
        }

        return this.prisma.role.update({
            where: { id },
            data: updateData,
            select: this.roleSelect,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.role.delete({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });
    }
}