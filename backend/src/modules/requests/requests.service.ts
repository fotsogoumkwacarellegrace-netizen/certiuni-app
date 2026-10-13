import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestStatusDto, RequestStatus } from './dto/update-request-status.dto';
import { UserRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Soumission publique d'une demande par un tiers
     */
    async create(dto: CreateRequestDto) {
        const universityExists = await this.prisma.university.findUnique({
            where: { id: dto.universityId },
        });

        if (!universityExists) {
            throw new NotFoundException('Université introuvable.');
        }

        // Génération d'un code de suivi unique (ex: REQ-A1B2C3D4)
        const trackingCode = `REQ-${uuidv4().substring(0, 8).toUpperCase()}`;

        return this.prisma.request.create({
            data: {
                requestNumber: trackingCode,
                status: RequestStatus.PENDING,
                student: { connect: { id: 'default-student-id' } },
                service: { connect: { id: 'default-service-id' } },
            },
            select: {
                id: true,
                status: true,
                createdAt: true,
            },
        });
    }

    /**
     * Consultation publique du statut par le code de suivi
     */
    async getStatusByTrackingCode(trackingCode: string) {
        const request = await this.prisma.request.findFirst({
            where: { id: trackingCode },
            select: {
                id: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!request) {
            throw new NotFoundException(`Aucune demande trouvée avec le code ${trackingCode}.`);
        }

        return request;
    }

    /**
     * Liste des demandes (Accès restreint Admin / Super Admin)
     */
    async findAll(user: any) {
        return this.prisma.request.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Détails d'une demande par ID (Accès restreint)
     */
    async findOne(id: string, user: any) {
        const request = await this.prisma.request.findUnique({
            where: { id },
        });

        if (!request) {
            throw new NotFoundException(`Demande #${id} introuvable.`);
        }

        if (user.role !== UserRole.SUPER_ADMIN) {
            throw new ForbiddenException('Accès non autorisé à cette demande.');
        }

        return request;
    }

    /**
     * Traitement d'une demande par un admin (Mise à jour du statut)
     */
    async updateStatus(id: string, dto: UpdateRequestStatusDto, user: any) {
        await this.findOne(id, user);

        return this.prisma.request.update({
            where: { id },
            data: {
                status: dto.status,
            },
        });
    }
}