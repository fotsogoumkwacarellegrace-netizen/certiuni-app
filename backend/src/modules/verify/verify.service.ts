import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Certificate } from '@prisma/client';
import { VerifyHashParamDto } from './dto/verify-hash.dto';
import { VerifyQrDto } from './dto/verify-hash.dto';
import * as crypto from 'crypto';

export interface VerificationResult {
    status: 'VALIDE' | 'RÉVOKÉ' | 'PENDING' | 'FAILED' | 'INTROUVABLE';
    universityName?: string;
    issuedBy?: string;
    revocationReason?: string | null;
}

@Injectable()
export class VerifyService {
    constructor(private readonly prisma: PrismaService) { }

    /** Vérifie un document par son empreinte SHA-256. Retourne VALIDE (ISSUED), RÉVOKÉ, ou INTROUVABLE. */
    async verifyByHash(
        hash: string,
        ctx: { ip: string; userAgent: string },
    ): Promise<VerificationResult> {
        // Validation format hash SHA-256
        if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
            throw new BadRequestException('Format de hash SHA-256 invalide.');
        }

        const certificate = await this.prisma.certificate.findUnique({
            where: { canonicalHash: hash },
            include: { university: true, issuedBy: true },
        });

        if (!certificate) {
            return { status: 'INTROUVABLE' };
        }

        // Si le certificat est révoqué
        if (certificate.revocationReason || certificate.status === 'REVOKED') {
            return {
                status: 'RÉVOKÉ',
                universityName: certificate.university?.name,
                issuedBy: `${certificate.issuedBy.firstName} ${certificate.issuedBy.lastName}`,
                revocationReason: certificate.revocationReason,
            };
        }

        // Sinon, gestion explicite des autres statuts métier
        if (certificate.status === 'PENDING') {
            return {
                status: 'PENDING',
                universityName: certificate.university?.name,
                issuedBy: `${certificate.issuedBy.firstName} ${certificate.issuedBy.lastName}`,
                revocationReason: null,
            };
        }

        if (certificate.status === 'FAILED') {
            return {
                status: 'FAILED',
                universityName: certificate.university?.name,
                issuedBy: `${certificate.issuedBy.firstName} ${certificate.issuedBy.lastName}`,
                revocationReason: null,
            };
        }

        // Par défaut, valide (statut ISSUED en BDD)
        return {
            status: 'VALIDE',
            universityName: certificate.university?.name,
            issuedBy: `${certificate.issuedBy.firstName} ${certificate.issuedBy.lastName}`,
            revocationReason: null,
        };
    }

    /** Vérifie un document à partir du contenu d'un QR Code. */
    async verifyByQrData(
        qrData: string,
        ctx: { ip: string; userAgent: string },
    ): Promise<VerificationResult> {
        // Essayer d'extraire un hash ou identifiant du QR data
        // Format typique : https://verify.example.com/CERT-xxx?signature=...
        const hashMatch = qrData.match(/[a-fA-F0-9]{64}/);
        if (hashMatch) {
            return this.verifyByHash(hashMatch[0], ctx);
        }

        // Sinon, essayer de trouver par identifiant public dans l'URL
        const publicIdMatch = qrData.match(/CERT-[A-Z0-9]+/i);
        if (publicIdMatch) {
            const publicIdentifier = publicIdMatch[0];
            const certificate = await this.prisma.certificate.findUnique({
                where: { publicIdentifier },
                include: { university: true, issuedBy: true },
            });
            if (!certificate) {
                return { status: 'INTROUVABLE' };
            }
            if (certificate.revocationReason || certificate.status === 'REVOKED') {
                return {
                    status: 'RÉVOKÉ',
                    universityName: certificate.university?.name,
                    issuedBy: `${certificate.issuedBy.firstName} ${certificate.issuedBy.lastName}`,
                    revocationReason: certificate.revocationReason,
                };
            }
            return {
                status: 'VALIDE',
                universityName: certificate.university?.name,
                issuedBy: `${certificate.issuedBy.firstName} ${certificate.issuedBy.lastName}`,
                revocationReason: null,
            };
        }

        // Par défaut, introuvable
        return { status: 'INTROUVABLE' };
    }

    /** Vérification de masse à partir d'un fichier Excel/CSV. */
    async bulkVerify(filePath: string): Promise<Array<{ hash: string; status: string; universityName?: string; issuedBy?: string; revocationReason?: string | null }>> {
        const fs = require('fs');
        const path = require('path');

        if (!fs.existsSync(filePath)) {
            throw new BadRequestException('Fichier introuvable : ' + filePath);
        }

        const ext = path.extname(filePath).toLowerCase();
        let rawData: string[];

        if (ext === '.csv') {
            const csvContent = fs.readFileSync(filePath, 'utf-8');
            const lines = csvContent.split('\n');
            // En-tête attendu: hash
            rawData = lines.slice(1).filter((line: string) => line.trim()); // skip header
        } else if (ext === '.xlsx' || ext === '.xls') {
            const workbook = require('xlsx').readFile(filePath);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            // Supposer que la colonne s'appelle "hash"
            const rows = require('xlsx').utils.sheet_to_json(worksheet);
            rawData = rows.map((row: any) => row.hash).filter((h: any) => h);
        } else {
            throw new BadRequestException('Format de fichier non supporté. Utilisez .csv, .xlsx ou .xls.');
        }

        const results: Array<{ hash: string; status: string; universityName?: string; issuedBy?: string; revocationReason?: string | null }> = [];

        for (const hash of rawData) {
            const result = await this.verifyByHash(hash, { ip: 'bulk', userAgent: 'bulk-import' });
            results.push({
                hash,
                status: result.status,
                universityName: result.universityName,
                issuedBy: result.issuedBy,
                revocationReason: result.revocationReason,
            });
        }

        return results;
    }
}
