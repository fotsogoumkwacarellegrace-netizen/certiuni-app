import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly organizationInclude = {
        institution: {
            select: { id: true, name: true, code: true },
        },
        parent: {
            select: { id: true, name: true, code: true, type: true },
        },
        children: {
            select: { id: true, name: true, code: true, type: true },
        },
        _count: {
            select: {
                programs: true,
                students: true,
                documents: true,
            },
        },
    };

    async create(dto: CreateOrganizationDto) {
        const institutionExists = await this.prisma.institution.findUnique({
            where: { id: dto.institutionId },
        });

        if (!institutionExists) {
            throw new NotFoundException(`Institution introuvable (#${dto.institutionId}).`);
        }

        const codeExists = await this.prisma.organization.findFirst({
            where: { code: dto.code },
        });

        if (codeExists) {
            throw new ConflictException(`Une organisation avec le code "${dto.code}" existe déjà.`);
        }

        if (dto.parentId) {
            const parentExists = await this.prisma.organization.findUnique({
                where: { id: dto.parentId },
            });
            if (!parentExists) {
                throw new NotFoundException(`Organisation parente introuvable (#${dto.parentId}).`);
            }
        }

        return this.prisma.organization.create({
            data: {
                institutionId: dto.institutionId,
                name: dto.name.trim(),
                code: dto.code.trim().toUpperCase(),
                type: dto.type,
                description: dto.description?.trim(),
                parentId: dto.parentId,
            },
            include: this.organizationInclude,
        });
    }

    async findAll(institutionId?: string) {
        return this.prisma.organization.findMany({
            where: {
                ...(institutionId && { institutionId }),
            },
            include: this.organizationInclude,
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const organization = await this.prisma.organization.findUnique({
            where: { id },
            include: this.organizationInclude,
        });

        if (!organization) {
            throw new NotFoundException(`Organisation introuvable (#${id}).`);
        }

        return organization;
    }

    async update(id: string, dto: UpdateOrganizationDto) {
        await this.findOne(id);

        if (dto.code) {
            const codeExists = await this.prisma.organization.findFirst({
                where: { code: dto.code, NOT: { id } },
            });
            if (codeExists) {
                throw new ConflictException(`Le code "${dto.code}" est déjà utilisé.`);
            }
        }

        return this.prisma.organization.update({
            where: { id },
            data: {
                ...(dto.institutionId && { institutionId: dto.institutionId }),
                ...(dto.name && { name: dto.name.trim() }),
                ...(dto.code && { code: dto.code.trim().toUpperCase() }),
                ...(dto.type && { type: dto.type }),
                ...(dto.description !== undefined && { description: dto.description?.trim() }),
                ...(dto.parentId !== undefined && { parentId: dto.parentId }),
            },
            include: this.organizationInclude,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.organization.delete({
            where: { id },
        });
    }
}