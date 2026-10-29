import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';

@Injectable()
export class DocumentTypesService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly documentTypeSelect = {
        id: true,
        code: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
            select: {
                certificates: true,
            },
        },
    };

    async create(dto: CreateDocumentTypeDto) {
        const codeClean = dto.code.trim().toUpperCase();

        const existingType = await this.prisma.documentType.findUnique({
            where: { code: codeClean },
        });

        if (existingType) {
            throw new ConflictException(
                `Un type de document avec le code "${codeClean}" existe déjà.`,
            );
        }

        return this.prisma.documentType.create({
            data: {
                code: codeClean,
                name: dto.name.trim(),
                description: dto.description ? dto.description.trim() : null,
            },
            select: this.documentTypeSelect,
        });
    }

    async findAll() {
        return this.prisma.documentType.findMany({
            select: this.documentTypeSelect,
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const documentType = await this.prisma.documentType.findUnique({
            where: { id },
            select: this.documentTypeSelect,
        });

        if (!documentType) {
            throw new NotFoundException(
                `Type de document introuvable avec l'ID #${id}.`,
            );
        }

        return documentType;
    }

    async findByCode(code: string) {
        const codeClean = code.trim().toUpperCase();
        const documentType = await this.prisma.documentType.findUnique({
            where: { code: codeClean },
            select: this.documentTypeSelect,
        });

        if (!documentType) {
            throw new NotFoundException(
                `Type de document introuvable avec le code "${codeClean}".`,
            );
        }

        return documentType;
    }

    async update(id: string, dto: UpdateDocumentTypeDto) {
        await this.findOne(id);

        const updateData: any = { ...dto };

        if (dto.code) {
            updateData.code = dto.code.trim().toUpperCase();
            const existing = await this.prisma.documentType.findUnique({
                where: { code: updateData.code },
            });

            if (existing && existing.id !== id) {
                throw new ConflictException(
                    `Le code "${updateData.code}" est déjà utilisé par un autre type de document.`,
                );
            }
        }

        if (dto.name) {
            updateData.name = dto.name.trim();
        }

        if (dto.description !== undefined) {
            updateData.description = dto.description ? dto.description.trim() : null;
        }

        return this.prisma.documentType.update({
            where: { id },
            data: updateData,
            select: this.documentTypeSelect,
        });
    }

    async remove(id: string) {
        const documentType = await this.findOne(id);

        if (documentType._count.certificates > 0) {
            throw new ConflictException(
                `Impossible de supprimer ce type de document car ${documentType._count.certificates} document(s) y sont rattaché(s).`,
            );
        }

        return this.prisma.documentType.delete({
            where: { id },
            select: {
                id: true,
                code: true,
                name: true,
            },
        });
    }
}