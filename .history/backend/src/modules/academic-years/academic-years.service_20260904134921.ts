import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';

@Injectable()
export class AcademicYearsService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly yearSelect = {
        id: true,
        year: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        createdAt: true,
        updatedAt: true,
    };

    async create(dto: CreateAcademicYearDto) {
        const existing = await this.prisma.academicYear.findUnique({
            where: { year: dto.year },
        });

        if (existing) {
            throw new ConflictException(`L'année académique "${dto.year}" existe déjà.`);
        }

        // Si la nouvelle année est définie comme courante, réinitialiser les autres
        if (dto.isCurrent) {
            await this.prisma.academicYear.updateMany({
                where: { isCurrent: true },
                data: { isCurrent: false },
            });
        }

        return this.prisma.academicYear.create({
            data: {
                year: dto.year,
                startDate: dto.startDate ? new Date(dto.startDate) : null,
                endDate: dto.endDate ? new Date(dto.endDate) : null,
                isCurrent: dto.isCurrent ?? false,
            },
            select: this.yearSelect,
        });
    }

    async findAll() {
        return this.prisma.academicYear.findMany({
            select: this.yearSelect,
            orderBy: { year: 'desc' },
        });
    }

    async findCurrent() {
        const currentYear = await this.prisma.academicYear.findFirst({
            where: { isCurrent: true },
            select: this.yearSelect,
        });

        if (!currentYear) {
            throw new NotFoundException(`Aucune année académique active n'est définie.`);
        }

        return currentYear;
    }

    async findOne(id: string) {
        const academicYear = await this.prisma.academicYear.findUnique({
            where: { id },
            select: this.yearSelect,
        });

        if (!academicYear) {
            throw new NotFoundException(`Année académique introuvable avec l'ID #${id}.`);
        }

        return academicYear;
    }

    async update(id: string, dto: UpdateAcademicYearDto) {
        await this.findOne(id);

        if (dto.isCurrent) {
            await this.prisma.academicYear.updateMany({
                where: { isCurrent: true, NOT: { id } },
                data: { isCurrent: false },
            });
        }

        const updateData: any = { ...dto };

        if (dto.startDate) updateData.startDate = new Date(dto.startDate);
        if (dto.endDate) updateData.endDate = new Date(dto.endDate);

        return this.prisma.academicYear.update({
            where: { id },
            data: updateData,
            select: this.yearSelect,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.academicYear.delete({
            where: { id },
            select: { id: true, year: true },
        });
    }
}