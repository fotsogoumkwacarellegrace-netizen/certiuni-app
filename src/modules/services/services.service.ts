import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateServiceDto) {
        const existing = await this.prisma.service.findFirst({
            where: { code: dto.code.trim().toUpperCase() },
        });

        if (existing) {
            throw new ConflictException(
                `Un service avec le code "${dto.code}" existe déjà.`,
            );
        }

        return this.prisma.service.create({
            data: {
                name: dto.name.trim(),
                code: dto.code.trim().toUpperCase(),
                description: dto.description?.trim(),
                universityId: 'default-university-id',
                documentTypeId: 'default-document-type-id',
            },
        });
    }

    async findAll(includeInactive = false) {
        return this.prisma.service.findMany({
            where: {},
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });

        if (!service) {
            throw new NotFoundException(`Service introuvable (#${id}).`);
        }

        return service;
    }

    async findByCode(code: string) {
        const service = await this.prisma.service.findFirst({
            where: { code: code.trim().toUpperCase() },
        });

        if (!service) {
            throw new NotFoundException(`Service introuvable avec le code "${code}".`);
        }

        return service;
    }

    async update(id: string, dto: UpdateServiceDto) {
        await this.findOne(id);

        if (dto.code) {
            const existing = await this.prisma.service.findFirst({
                where: {
                    code: dto.code.trim().toUpperCase(),
                    NOT: { id },
                },
            });

            if (existing) {
                throw new ConflictException(
                    `Un autre service utilise déjà le code "${dto.code}".`,
                );
            }
        }

        return this.prisma.service.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name.trim() }),
                ...(dto.code && { code: dto.code.trim().toUpperCase() }),
                ...(dto.description !== undefined && { description: dto.description.trim() }),
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.service.delete({
            where: { id },
        });
    }
}