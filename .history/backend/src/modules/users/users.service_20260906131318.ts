import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Projection Prisma réutilisable pour exclure systématiquement les hashes de mots de passe
   */
  private readonly userSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    universityId: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    university: {
      select: {
        id: true,
        name: true,
        code: true,
      },
    },
  };

  async create(dto: CreateUserDto) {
    const emailNormalized = dto.email.toLowerCase().trim();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existingUser) {
      throw new ConflictException(`Un utilisateur avec l'email "${dto.email}" existe déjà.`);
    }

    if (dto.universityId) {
      const universityExists = await this.prisma.university.findUnique({
        where: { id: dto.universityId },
      });
      if (!universityExists) {
        throw new NotFoundException(`Université introuvable avec l'ID spécifié.`);
      }
    }

    const hashedPassword = await argon2.hash(dto.password);

    return this.prisma.user.create({
      data: {
        email: emailNormalized,
        passwordHash: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        universityId: dto.universityId || null,
      },
      select: this.userSelect,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });
  }

  async findAll(universityId?: string) {
    return this.prisma.user.findMany({
      where: universityId ? { universityId } : {},
      select: this.userSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID #${id} introuvable.`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const updateData: any = { ...dto };

    // Normalisation de l'email si présent
    if (dto.email) {
      updateData.email = dto.email.toLowerCase().trim();
    }

    // Traitement et hachage d'un nouveau mot de passe s'il est fourni dans le DTO
    if (dto.password) {
      updateData.passwordHash = await argon2.hash(dto.password);
      delete updateData.password;
    }

    // Vérification de l'existence de la nouvelle université liée
    if (dto.universityId) {
      const universityExists = await this.prisma.university.findUnique({
        where: { id: dto.universityId },
      });
      if (!universityExists) {
        throw new NotFoundException(`Université introuvable avec l'ID spécifié.`);
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: this.userSelect,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });
  }
}