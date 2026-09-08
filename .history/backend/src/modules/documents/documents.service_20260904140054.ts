import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { IssueDocumentDto } from './dto/issue-document.dto';
import { RevokeDocumentDto } from './dto/revoke-document.dto';
import { BatchIssueDocumentDto } from './dto/batch-issue-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly documentSelect = {
    id: true,
    certificateNumber: true,
    title: true,
    mention: true,
    qrCodeUrl: true,
    pdfUrl: true,
    documentHash: true,
    isRevoked: true,
    revokedAt: true,
    revocationReason: true,
    issuedAt: true,
    createdAt: true,
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
        requiresQrCode: true,
      },
    },
    enrollment: {
      select: {
        id: true,
        program: { select: { name: true, code: true } },
        academicLevel: { select: { code: true } },
        academicYear: { select: { year: true } },
      },
    },
  };

  /**
   * Génère un numéro de certificat unique (ex: CERT-2026-X9A2B4C)
   */
  private generateCertificateNumber(): string {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `CERT-${year}-${randomHex}`;
  }

  /**
   * Calcule le Hash SHA-256 d'unicité et d'intégrité du document
   */
  private computeDocumentHash(
    studentId: string,
    docTypeCode: string,
    certNumber: string,
    issuedAt: Date,
  ): string {
    const rawData = `${studentId}:${docTypeCode}:${certNumber}:${issuedAt.toISOString()}`;
    return crypto.createHash('sha256').update(rawData).digest('hex');
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

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: dto.enrollmentId },
    });
    if (!enrollment) {
      throw new NotFoundException(`Inscription introuvable (#${dto.enrollmentId}).`);
    }

    const certificateNumber = this.generateCertificateNumber();
    const issuedAt = dto.issuedAt ? new Date(dto.issuedAt) : new Date();
    const documentHash = this.computeDocumentHash(
      dto.studentId,
      docType.code,
      certificateNumber,
      issuedAt,
    );

    const verificationUrl = `${process.env.FRONTEND_VERIFY_URL || 'https://verify.certiuni.com'}/${certificateNumber}`;
    const qrCodeUrl = docType.requiresQrCode
      ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verificationUrl)}`
      : null;

    return this.prisma.certificate.create({
      data: {
        certificateNumber,
        studentId: dto.studentId,
        documentTypeId: dto.documentTypeId,
        enrollmentId: dto.enrollmentId,
        issuerId: issuerUserId,
        title: dto.title || docType.name,
        mention: dto.mention || null,
        documentHash,
        qrCodeUrl,
        issuedAt,
      },
      select: this.documentSelect,
    });
  }

  async batchIssue(dto: BatchIssueDocumentDto, issuerUserId: string) {
    const results = [];
    const errors = [];

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
      where: { certificateNumber: certificateNumber.trim().toUpperCase() },
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

    if (document.isRevoked) {
      throw new ConflictException('Ce document a déjà été révoqué.');
    }

    return this.prisma.certificate.update({
      where: { id },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revocationReason: dto.reason.trim(),
      },
      select: this.documentSelect,
    });
  }
}