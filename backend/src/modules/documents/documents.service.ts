import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import { CertificateStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IssueDocumentDto } from './dto/issue-document.dto';
import { RevokeDocumentDto } from './dto/revoke-document.dto';
import { BatchIssueDocumentDto } from './dto/batch-issue-document.dto';
import { createSignedCertificateVerificationUrl } from '../../common/utils/qr-signature.util';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly documentSelect = Prisma.validator<Prisma.CertificateSelect>()({
    id: true,
    publicIdentifier: true,
    metadataJson: true,
    degreeTitle: true,
    fieldOfStudy: true,
    grade: true,
    status: true,
    canonicalHash: true,
    issueDate: true,
    pdfUrl: true,
    pdfKey: true,
    revokedAt: true,
    revocationReason: true,
    createdAt: true,
    updatedAt: true,
    student: {
      select: {
        id: true,
        matricule: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    },
    documentType: {
      select: {
        id: true,
        code: true,
        name: true,
      },
    },
    university: {
      select: {
        id: true,
        name: true,
        code: true,
      },
    },
  });

  /**
   * Génère un numéro de certificat public unique (ex: CERT-2026-X9A2B4C)
   */
  private generateCertificateNumber(): string {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `CERT-${year}-${randomHex}`;
  }

  async issue(dto: IssueDocumentDto, issuerUserId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });
    if (!student) {
      throw new NotFoundException(`Étudiant introuvable (#${dto.studentId}).`);
    }

    const docType = await this.prisma.documentType.findUnique({
      where: { id: dto.documentTypeId },
    });
    if (!docType) {
      throw new NotFoundException(`Type de document introuvable (#${dto.documentTypeId}).`);
    }

    const certificateNumber = this.generateCertificateNumber();
    const issuedAt = dto.issuedAt ? new Date(dto.issuedAt) : new Date();

    const verificationUrl = createSignedCertificateVerificationUrl(certificateNumber);
    const qrCodeUrl = await QRCode.toDataURL(verificationUrl);

    const canonicalHash = require('crypto')
      .createHash('sha256')
      .update(`${certificateNumber}:${dto.studentId}:${dto.documentTypeId}:${Date.now()}`)
      .digest('hex');

    return this.prisma.certificate.create({
      data: {
        publicIdentifier: certificateNumber,
        canonicalHash,
        studentId: dto.studentId,
        typeId: dto.documentTypeId,
        issuedById: issuerUserId,
        universityId: student.universityId,
        studentFirstName: student.firstName,
        studentLastName: student.lastName,
        studentIdentifier: student.matricule,
        studentEmail: student.email ?? `${student.matricule}@student.app`,
        degreeTitle: dto.title?.trim() || docType.name || 'Diplôme',
        fieldOfStudy: '',
        grade: dto.mention,
        issueDate: issuedAt,
        status: CertificateStatus.ISSUED,
        metadataJson: {
          mention: dto.mention,
          enrollmentId: dto.enrollmentId,
          qrCodeUrl,
        },
      },
      select: this.documentSelect,
    });
  }

  async batchIssue(dto: BatchIssueDocumentDto, issuerUserId: string) {
    const results: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < dto.documents.length; i++) {
      const item = dto.documents[i];
      try {
        const issuedDoc = await this.issue(item, issuerUserId);
        results.push(issuedDoc);
      } catch (error: any) {
        errors.push({
          index: i,
          studentId: item.studentId,
          reason: error.message || "Erreur lors de l'émission.",
        });
      }
    }

    return {
      totalRequested: dto.documents.length,
      successfullyIssuedCount: results.length,
      failedCount: errors.length,
      issuedDocuments: results,
      errors,
    };
  }

  async findAll() {
    return this.prisma.certificate.findMany({
      select: this.documentSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.certificate.findUnique({
      where: { id },
      select: this.documentSelect,
    });

    if (!document) {
      throw new NotFoundException(`Document introuvable (#${id}).`);
    }

    return document;
  }

  async findByNumber(certificateNumber: string) {
    const document = await this.prisma.certificate.findUnique({
      where: { publicIdentifier: certificateNumber.trim().toUpperCase() },
      select: this.documentSelect,
    });

    if (!document) {
      throw new NotFoundException(
        `Document introuvable avec le numéro "${certificateNumber}".`,
      );
    }

    return document;
  }

  async revoke(id: string, dto: RevokeDocumentDto) {
    const document = await this.findOne(id);

    if (document.status === CertificateStatus.REVOKED) {
      throw new ConflictException('Ce document a déjà été révoqué.');
    }

    return this.prisma.certificate.update({
      where: { id },
      data: {
        status: CertificateStatus.REVOKED,
        revokedAt: new Date(),
        revocationReason: dto.reason.trim(),
      },
      select: this.documentSelect,
    });
  }
}