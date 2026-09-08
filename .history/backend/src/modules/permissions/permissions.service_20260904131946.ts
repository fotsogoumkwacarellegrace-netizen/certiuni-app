import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly permissionSelect = {
    id: true,
    name: true,
    description: true,
    createdAt: true,
  };

  async create(dto: CreatePermissionDto) {
    const permissionName = dto.name.toLowerCase().trim();

    const existingPermission = await this.prisma.permission.findUnique({
      where: { name: permissionName },
    });

    if (existingPermission) {
      throw new ConflictException(`La permission "${permissionName}" existe déjà.`);
    }

    return this.prisma.permission.create({
      data: {
        name: permissionName,
        description: dto.description,
      },
      select: this.permissionSelect,
    });
  }

  async findAll() {
    return this.prisma.permission.findMany({
      select: this.permissionSelect,
      orderBy: { name: 'asc' },
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

    return this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: cleanedPermissions,
      },
      select: {
        id: true,
        name: true,
        permissions: true,
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
        name: true,
      },
    });
  }
}