import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateLevelDto } from './dto/create-level.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AcademicService {
    constructor(private readonly prisma: PrismaService) { }

    private resolveUniversityId(user: any, targetUniversityId?: string): string {
        const universityId = user.role === UserRole.SUPER_ADMIN ? targetUniversityId : user.universityId;
        if (!universityId) {
            throw new ForbiddenException("L'ID de l'université est obligatoire.");
        }
        return universityId;
    }

    // --- ANNEES ACADEMIQUES ---
    async createYear(dto: CreateAcademicYearDto, user: any, universityId?: string) {
        const targetUnivId = this.resolveUniversityId(user, universityId);

        const existing = await this.prisma.academicYear.findFirst({
            where: { year: dto.year, universityId: targetUnivId },
        });
        if (existing) {
            throw new ConflictException(`L'année académique ${dto.year} existe déjà.`);
        }

        return this.prisma.academicYear.create({
            data: {
                year: dto.year,
                universityId: targetUnivId,
            },
        });
    }

    async findAllYears(user: any) {
        const whereCondition = user.role === UserRole.SUPER_ADMIN ? {} : { universityId: user.universityId };
        return this.prisma.academicYear.findMany({
            where: whereCondition,
            orderBy: { year: 'desc' },
        });
    }

    // --- PROGRAMMES / FILIERES ---
    async createProgram(dto: CreateProgramDto, user: any, universityId?: string) {
        const targetUnivId = this.resolveUniversityId(user, universityId);

        const existing = await this.prisma.program.findFirst({
            where: { code: dto.code, universityId: targetUnivId },
        });
        if (existing) {
            throw new ConflictException(`Un programme avec le code ${dto.code} existe déjà.`);
        }

        return this.prisma.program.create({
            data: {
                name: dto.name,
                code: dto.code,
                description: dto.description,
                universityId: targetUnivId,
            },
        });
    }

    async findAllPrograms(user: any) {
        const whereCondition = user.role === UserRole.SUPER_ADMIN ? {} : { universityId: user.universityId };
        return this.prisma.program.findMany({
            where: whereCondition,
            orderBy: { name: 'asc' },
        });
    }

    // --- NIVEAUX / RANGS ---
    async createLevel(dto: CreateLevelDto, user: any, universityId?: string) {
        const targetUnivId = this.resolveUniversityId(user, universityId);

        const existing = await this.prisma.academicLevel.findFirst({
            where: { code: dto.code, universityId: targetUnivId },
        });
        if (existing) {
            throw new ConflictException(`Un niveau avec le code ${dto.code} existe déjà.`);
        }

        return this.prisma.academicLevel.create({
            data: {
                name: dto.name,
                code: dto.code,
                universityId: targetUnivId,
            },
        });
    }

    async findAllLevels(user: any) {
        const whereCondition = user.role === UserRole.SUPER_ADMIN ? {} : { universityId: user.universityId };
        return this.prisma.academicLevel.findMany({
            where: whereCondition,
            orderBy: { name: 'asc' },
        });
    }
}