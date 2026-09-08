import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
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

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        universityId: dto.universityId || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        universityId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        universityId: true,
        isActive: true,
        createdAt: true,
        university: true,
      },
    });
  }  

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        universityId: true,
        isActive: true,
        createdAt: true,
        university: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        universityId: true,
        isActive: true,
        createdAt: true,
        university: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur introuvable.`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        universityId: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}