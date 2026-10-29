import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttachUserDto } from './dto/attach-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UniversityUsersService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly userSelect = {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        universityId: true,
        createdAt: true,
        updatedAt: true,
    };

    async attachUser(dto: AttachUserDto) {
        const { userId, universityId, role } = dto;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur introuvable avec l'ID #${userId}.`);
        }

        const university = await this.prisma.university.findUnique({
            where: { id: universityId },
        });

        if (!university) {
            throw new NotFoundException(`Université introuvable avec l'ID #${universityId}.`);
        }

        if (user.universityId === universityId) {
            throw new ConflictException('L\'utilisateur est déjà rattaché à cette université.');
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: {
                universityId,
                role,
            },
            select: this.userSelect,
        });
    }

    async findByUniversity(universityId: string) {
        const university = await this.prisma.university.findUnique({
            where: { id: universityId },
        });

        if (!university) {
            throw new NotFoundException(`Université introuvable avec l'ID #${universityId}.`);
        }

        return this.prisma.user.findMany({
            where: { universityId },
            select: this.userSelect,
            orderBy: { lastName: 'asc' },
        });
    }

    async updateUserRole(userId: string, universityId: string, dto: UpdateUserRoleDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur introuvable avec l'ID #${userId}.`);
        }

        if (user.universityId !== universityId) {
            throw new BadRequestException(
                'L\'utilisateur n\'appartient pas à l\'université spécifiée.',
            );
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: { role: dto.role },
            select: this.userSelect,
        });
    }

    async detachUser(userId: string, universityId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur introuvable avec l'ID #${userId}.`);
        }

        if (user.universityId !== universityId) {
            throw new BadRequestException(
                'L\'utilisateur n\'est pas rattaché à cette université.',
            );
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: {
                universityId: null,
            },
            select: this.userSelect,
        });
    }
}