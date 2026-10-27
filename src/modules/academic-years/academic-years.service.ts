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
        universityId: true,
        createdAt: true,
        updatedAt: true,
    };

    async create(dto: CreateAcademicYearDto) {
        const existing = await this.prisma.academicYear.findFirst({
            where: { year: dto.year },
        });

        if (existing) {
            throw new ConflictException(`L'année académique "${dto.year}" existe déjà.`);
        }

        return this.prisma.academicYear.create({
            data: {
                year: dto.year,
                universityId: dto.universityId,
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
            select: this.yearSelect,
            orderBy: { year: 'desc' },
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

        const updateData: any = {
            ...(dto.year ? { year: dto.year } : {}),
            ...(dto.universityId ? { universityId: dto.universityId } : {}),
        };

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