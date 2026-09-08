import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { RevokeCertificateDto } from './dto/revoke-certificate.dto';

@Injectable()
export class CertificateService {
    private readonly baseUrl: string;

    constructor(private readonly prisma: PrismaService) {
        // URL de base du portail public de vérification
        this.baseUrl = process.env.PUBLIC_VERIFY_URL || 'https://certiuni.app/verify';
    }

    /**
     * Émet un nouveau diplôme, calcule son hash SHA-256 canonique et génère son QR Code
     */
    async issueCertificate(dto: CreateCertificateDto, createdById: string) {
        // 1. Vérifier que l'université existe
        const university = await this.prisma.university.findUnique({
            where: { id: dto.universityId },
        });

        if (!university) {
            throw new NotFoundException(`Établissement introuvable avec l'ID : ${dto.universityId}`);
        }

        // 2. Générer un identifiant public unique et lisible (Ex: CERT-2026-A8F9K2)
        const publicIdentifier = this.generatePublicIdentifier(university.code);

        // 3. Calcul du Hash Canonique SHA-256
        const canonicalString = this.buildCanonicalString({
            publicIdentifier,
            studentFirstName: dto.studentFirstName,
            studentLastName: dto.studentLastName,
            degreeTitle: dto.degreeTitle,
            fieldOfStudy: dto.fieldOfStudy,
            issueDate: dto.issueDate,
            universityCode: university.code,
        });

        const sha256Hash = crypto.createHash('sha256').update(canonicalString).digest('hex');

        // 4. Construction de l'URL de vérification et génération du QR Code
        const verificationUrl = `${this.baseUrl}/${publicIdentifier}`;
        const qrCodeDataUrl = await this.generateQrCode(verificationUrl);

        try {
            // 5. Sauvegarde en Base de Données
            const certificate = await this.prisma.certificate.create({
                data: {
                    publicIdentifier,
                    studentFirstName: dto.studentFirstName.trim(),
                    studentLastName: dto.studentLastName.trim(),
                    degreeTitle: dto.degreeTitle.trim(),
                    fieldOfStudy: dto.fieldOfStudy.trim(),
                    grade: dto.grade.trim(),
                    issueDate: new Date(dto.issueDate),
                    canonicalHash: sha256Hash,
                    qrCodeDataUrl: qrCodeDataUrl,
                    status: 'ISSUED',
                    universityId: dto.universityId,
                    createdById: createdById,
                    metadataJson: dto.metadataJson ? JSON.parse(dto.metadataJson) : null,
                },
                include: {
                    university: {
                        select: {
                            name: true,
                            code: true,
                            logoUrl: true,
                        },
                    },
                },
            });

            return {
                message: 'Diplôme émis et certifié avec succès',
                certificate: {
                    id: certificate.id,
                    publicIdentifier: certificate.publicIdentifier,
                    canonicalHash: certificate.canonicalHash,
                    verificationUrl,
                    qrCodeDataUrl: certificate.qrCodeDataUrl,
                    studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
                    degreeTitle: certificate.degreeTitle,
                    universityName: certificate.university.name,
                    issuedAt: certificate.issueDate,
                },
            };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Un diplôme avec cet identifiant ou cet empreinte existe déjà.');
            }
            throw new InternalServerErrorException("Erreur lors de la création du diplôme dans la base de données.");
        }
    }

    /**
     * Construit la chaîne canonique normalisée (Déterministe)
     * L'ordre et la casse des éléments sont rigoureusement fixés
     */
    private buildCanonicalString(params: {
        publicIdentifier: string;
        studentFirstName: string;
        studentLastName: string;
        degreeTitle: string;
        fieldOfStudy: string;
        issueDate: string;
        universityCode: string;
    }): string {
        const clean = (str: string) => str.trim().toUpperCase();

        // Format canonique strict : ID|NOM|PRENOM|DIPLOME|DOMAINE|UNIVERSITE|DATE
        return [
            clean(params.publicIdentifier),
            clean(params.studentLastName),
            clean(params.studentFirstName),
            clean(params.degreeTitle),
            clean(params.fieldOfStudy),
            clean(params.universityCode),
            clean(params.issueDate),
        ].join('|');
    }

    /**
     * Génère l'image du QR Code au format Data URL PNG
     */
    private async generateQrCode(url: string): Promise<string> {
        try {
            return await QRCode.toDataURL(url, {
                errorCorrectionLevel: 'H', // Correction d'erreur haute
                type: 'image/png',
                margin: 2,
                width: 300,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
            });
        } catch (err) {
            throw new InternalServerErrorException('Échec de la génération du QR Code');
        }
    }

    /**
     * Génère un code public court (Ex: UNIA-2026-X8B9)
     */
    private generatePublicIdentifier(universityCode: string): string {
        const year = new Date().getFullYear();
        const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
        return `${universityCode.toUpperCase()}-${year}-${randomHex}`;
    }
}