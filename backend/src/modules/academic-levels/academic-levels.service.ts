import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAcademicLevelDto } from './dto/create-academic-level.dto';
import { UpdateAcademicLevelDto } from './dto/update-academic-level.dto';

@Injectable()
export class AcademicLevelsService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly levelSelect = {
        id: true,
        name: true,
        code: true,
        universityId: true,
        university: {
            select: {
                id: true,
                name: true,
                code: true,
            },
        },
        createdAt: true,
        updatedAt: true,
    };

    async create(dto: CreateAcademicLevelDto) {
        const levelCode = dto.code.toUpperCase().trim();

        const university = await this.prisma.university.findUnique({
            where: { id: dto.universityId },
        });

        if (!university) {
            throw new NotFoundException(`Université introuvable avec l'ID #${dto.universityId}.`);
        }

        const existingLevel = await this.prisma.academicLevel.findFirst({
            where: {
                code: levelCode,
                universityId: dto.universityId,
            },
        });

        if (existingLevel) {
            throw new ConflictException(
                `Le niveau académique avec le code "${levelCode}" existe déjà pour cette université.`,
            );
        }

        return this.prisma.academicLevel.create({
            data: {
                name: dto.name.trim(),
                code: levelCode,
                universityId: dto.universityId,
            },
            select: this.levelSelect,
        });
    }

    async findAll() {
        return this.prisma.academicLevel.findMany({
            select: this.levelSelect,
            orderBy: { name: 'asc' },
        });
    }

    async findByUniversity(universityId: string) {
        return this.prisma.academicLevel.findMany({
            where: { universityId },
            select: this.levelSelect,
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const level = await this.prisma.academicLevel.findUnique({
            where: { id },
            select: this.levelSelect,
        });

        if (!level) {
            throw new NotFoundException(`Niveau académique introuvable avec l'ID #${id}.`);
        }

        return level;
    }

    async update(id: string, dto: UpdateAcademicLevelDto) {
        const currentLevel = await this.findOne(id);
        const updateData: any = { ...dto };

        if (dto.code) {
            updateData.code = dto.code.toUpperCase().trim();
            const targetUniversityId = dto.universityId || currentLevel.universityId;

            const existing = await this.prisma.academicLevel.findFirst({
                where: {
                    code: updateData.code,
                    universityId: targetUniversityId,
                },
            });

            if (existing && existing.id !== id) {
                throw new ConflictException(
                    `Le code "${updateData.code}" est déjà attribué à un autre niveau dans cette université.`,
                );
            }
        }

        return this.prisma.academicLevel.update({
            where: { id },
            data: updateData,
            select: this.levelSelect,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.academicLevel.delete({
            where: { id },
            select: { id: true, name: true, code: true },
        });
    }
}