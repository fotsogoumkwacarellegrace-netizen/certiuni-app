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

        return this.prisma.verificationRequest.create({
            data: {
                trackingCode,
                requesterName: dto.requesterName,
                requesterEmail: dto.requesterEmail,
                organization: dto.organization,
                documentHash: dto.documentHash,
                reason: dto.reason,
                universityId: dto.universityId,
                status: RequestStatus.PENDING,
            },
            select: {
                id: true,
                trackingCode: true,
                status: true,
                createdAt: true,
            },
        });
    }

    /**
     * Consultation publique du statut par le code de suivi
     */
    async getStatusByTrackingCode(trackingCode: string) {
        const request = await this.prisma.verificationRequest.findUnique({
            where: { trackingCode },
            select: {
                trackingCode: true,
                status: true,
                adminNotes: true,
                createdAt: true,
                updatedAt: true,
                university: {
                    select: { name: true, code: true },
                },
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
        const whereCondition =
            user.role === UserRole.SUPER_ADMIN ? {} : { universityId: user.universityId };

        return this.prisma.verificationRequest.findMany({
            where: whereCondition,
            include: {
                university: { select: { id: true, name: true, code: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Détails d'une demande par ID (Accès restreint)
     */
    async findOne(id: string, user: any) {
        const request = await this.prisma.verificationRequest.findUnique({
            where: { id },
            include: {
                university: { select: { id: true, name: true, code: true } },
            },
        });

        if (!request) {
            throw new NotFoundException(`Demande #${id} introuvable.`);
        }

        if (user.role !== UserRole.SUPER_ADMIN && request.universityId !== user.universityId) {
            throw new ForbiddenException('Accès non autorisé à cette demande.');
        }

        return request;
    }

    /**
     * Traitement d'une demande par un admin (Mise à jour du statut)
     */
    async updateStatus(id: string, dto: UpdateRequestStatusDto, user: any) {
        await this.findOne(id, user);

        return this.prisma.verificationRequest.update({
            where: { id },
            data: {
                status: dto.status,
                ...(dto.adminNotes && { adminNotes: dto.adminNotes }),
                processedByUserId: user.id,
            },
        });
    }
}