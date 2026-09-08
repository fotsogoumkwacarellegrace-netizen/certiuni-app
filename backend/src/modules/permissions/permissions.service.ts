import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly permissionSelect = {
    id: true,
    code: true,
    description: true,
    createdAt: true,
  };

  async create(dto: CreatePermissionDto) {
    const permissionCode = dto.code.toLowerCase().trim();

    const existingPermission = await this.prisma.permission.findUnique({
      where: { code: permissionCode },
    });

    if (existingPermission) {
      throw new ConflictException(`La permission "${permissionCode}" existe déjà.`);
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

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      select: this.permissionSelect,
    });

    if (!permission) {
      throw new NotFoundException(`Permission avec l'ID #${id} introuvable.`);
    }

    return permission;
  }

  async assignPermissionsToRole(dto: AssignPermissionsDto) {
    const { roleId, permissions } = dto;

    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException(`Rôle introuvable avec l'ID #${roleId}.`);
    }

    const cleanedPermissions = permissions.map((p) => p.toLowerCase().trim());

    const permissionRecords = await this.prisma.permission.findMany({
      where: { code: { in: cleanedPermissions } },
      select: { id: true },
    });

    // Suppression des anciennes associations puis recréation
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

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.permission.delete({
      where: { id },
      select: {
        id: true,
        code: true,
      },
    });
  }
}