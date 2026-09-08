import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly programSelect = {
        id: true,
        name: true,
        code: true,
        description: true,
        isActive: true,
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
        _count: {
            select: {
                certificates: true,
            },
        },
    };

    async create(dto: CreateProgramDto) {
        const programCode = dto.code.toUpperCase().trim();

        const university = await this.prisma.university.findUnique({
            where: { id: dto.universityId },
        });

        if (!university) {
            throw new NotFoundException(
                `Université introuvable avec l'ID #${dto.universityId}.`,
            );
        }

        const existingProgram = await this.prisma.program.findFirst({
            where: {
                code: programCode,
                universityId: dto.universityId,
            },
        });

        if (existingProgram) {
            throw new ConflictException(
                `La filière avec le code "${programCode}" existe déjà au sein de cette université.`,
            );
        }

        return this.prisma.program.create({
            data: {
                name: dto.name.trim(),
                code: programCode,
                description: dto.description,
                universityId: dto.universityId,
                isActive: dto.isActive ?? true,
            },
            select: this.programSelect,
        });
    }

    async findAll() {
        return this.prisma.program.findMany({
            select: this.programSelect,
            orderBy: { name: 'asc' },
        });
    }

    async findByUniversity(universityId: string) {
        const university = await this.prisma.university.findUnique({
            where: { id: universityId },
        });

        if (!university) {
            throw new NotFoundException(
                `Université introuvable avec l'ID #${universityId}.`,
            );
        }

        return this.prisma.program.findMany({
            where: { universityId },
            select: this.programSelect,
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const program = await this.prisma.program.findUnique({
            where: { id },
            select: this.programSelect,
        });

        if (!program) {
            throw new NotFoundException(`Filière introuvable avec l'ID #${id}.`);
        }

        return program;
    }

    async update(id: string, dto: UpdateProgramDto) {
        const currentProgram = await this.findOne(id);

        const updateData: any = { ...dto };

        if (dto.code) {
            updateData.code = dto.code.toUpperCase().trim();
            const targetUniversityId = dto.universityId || currentProgram.universityId;

            const existing = await this.prisma.program.findFirst({
                where: {
                    code: updateData.code,
                    universityId: targetUniversityId,
                },
            });

            if (existing && existing.id !== id) {
                throw new ConflictException(
                    `Le code "${updateData.code}" est déjà utilisé par une autre filière dans cette université.`,
                );
            }
        }

        if (dto.name) {
            updateData.name = dto.name.trim();
        }

        return this.prisma.program.update({
            where: { id },
            data: updateData,
            select: this.programSelect,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.program.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                code: true,
            },
        });
    }
}