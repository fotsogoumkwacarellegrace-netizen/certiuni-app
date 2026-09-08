import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IssueCertificateDto } from './dto/issue-certificate.dto';
import { RevokeCertificateDto } from './dto/revoke-certificate.dto';
import { UserRole, CertificateStatus, Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class CertificatesService {
  private readonly baseUrl: string;

  constructor(private readonly prisma: PrismaService) {
    this.baseUrl = process.env.PUBLIC_VERIFY_URL || 'https://certiuni.app/verify';
  }

  /**
   * Inclusion standard des relations pour inclure l'ensemble des données d'un certificat
   */
  private readonly defaultInclude = Prisma.validator<Prisma.CertificateInclude>()({
    university: { select: { id: true, name: true, code: true, logoUrl: true } },
    student: {
      select: {
        id: true,
        matricule: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    },
    program: { select: { id: true, name: true, code: true, fieldOfStudy: true } },
    academicYear: { select: { id: true, name: true, code: true } },
    academicLevel: { select: { id: true, name: true, code: true } },
    template: { select: { id: true, name: true, layoutConfig: true } },
    issuedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
  });

  /**
   * Émet un nouveau diplôme, calcule son hash SHA-256 canonique et génère son QR Code
   */
  async issueCertificate(dto: IssueCertificateDto, currentUser: any) {
    const targetUniversityId = currentUser.universityId || dto.universityId;

    if (!targetUniversityId) {
      throw new BadRequestException('L\'identifiant de l\'université est requis');
    }

    const university = await this.prisma.university.findUnique({
      where: { id: targetUniversityId },
    });

    if (!university) {
      throw new NotFoundException(`Établissement introuvable`);
    }

    if (
      currentUser.role !== UserRole.SUPER_ADMIN &&
      currentUser.universityId !== university.id
    ) {
      throw new ForbiddenException(
        'Vous ne pouvez émettre des diplômes que pour votre propre université',
      );
    }

    const publicIdentifier = this.generatePublicIdentifier(university.code);

    // Extraction des informations étudiant (soit depuis le DTO direct, soit via l'entité Student liée)
    let studentFirstName = dto.studentFirstName;
    let studentLastName = dto.studentLastName;
    let studentMatricule = dto.studentMatricule;

    if (dto.studentId) {
      const student = await this.prisma.student.findUnique({
        where: { id: dto.studentId },
      });
      if (!student) {
        throw new NotFoundException(`Étudiant introuvable`);
      }
      studentFirstName = student.firstName;
      studentLastName = student.lastName;
      studentMatricule = student.matricule;
    }

    const canonicalString = this.buildCanonicalString({
      publicIdentifier,
      studentFirstName: studentFirstName || '',
      studentLastName: studentLastName || '',
      degreeTitle: dto.degreeTitle,
      fieldOfStudy: dto.fieldOfStudy,
      issueDate: dto.issueDate,
      universityCode: university.code,
    });

    const sha256Hash = crypto.createHash('sha256').update(canonicalString).digest('hex');
    const verificationUrl = `${this.baseUrl}/${publicIdentifier}`;
    const qrCodeDataUrl = await this.generateQrCode(verificationUrl);

    try {
      const certificate = await this.prisma.certificate.create({
        data: {
          publicIdentifier,
          certificateNumber: dto.certificateNumber || publicIdentifier,
          title: dto.degreeTitle.trim(),
          studentFirstName: studentFirstName?.trim(),
          studentLastName: studentLastName?.trim(),
          studentIdentifier: studentMatricule?.trim(),
          studentEmail: studentMatricule
            ? `${studentMatricule.toLowerCase()}@student.app`
            : undefined,
          degreeTitle: dto.degreeTitle.trim(),
          fieldOfStudy: dto.fieldOfStudy.trim(),
          grade: dto.grade?.trim(),
          issueDate: new Date(dto.issueDate),
          canonicalHash: sha256Hash,
          qrCodeUrl: qrCodeDataUrl,
          status: CertificateStatus.ISSUED,
          universityId: university.id,
          issuedById: currentUser.id,
          ...(dto.studentId && { studentId: dto.studentId }),
          ...(dto.programId && { programId: dto.programId }),
          ...(dto.academicYearId && { academicYearId: dto.academicYearId }),
          ...(dto.academicLevelId && { academicLevelId: dto.academicLevelId }),
          ...(dto.templateId && { templateId: dto.templateId }),
          ...(dto.metadataJson && { metadata: dto.metadataJson }),
        },
        include: this.defaultInclude,
      });

      const displayStudentName = certificate.student
        ? `${certificate.student.firstName} ${certificate.student.lastName}`
        : `${certificate.studentFirstName} ${certificate.studentLastName}`;

      return {
        message: 'Diplôme émis et certifié avec succès',
        certificate: {
          id: certificate.id,
          publicIdentifier: certificate.publicIdentifier,
          certificateNumber: certificate.certificateNumber,
          canonicalHash: certificate.canonicalHash,
          verificationUrl,
          qrCodeDataUrl,
          studentName: displayStudentName,
          degreeTitle: certificate.degreeTitle,
          universityName: university.name,
          issuedAt: certificate.issueDate,
          details: certificate,
        },
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Un diplôme avec cet identifiant ou cette empreinte existe déjà.',
        );
      }
      throw new InternalServerErrorException(
        'Erreur lors de la création du diplôme dans la base de données : ' + error.message,
      );
    }
  }

  /**
   * Lister les diplômes émis avec leurs relations
   */
  async findAll(currentUser: any) {
    const where: Prisma.CertificateWhereInput =
      currentUser.role === UserRole.SUPER_ADMIN
        ? {}
        : { universityId: currentUser.universityId };

    return this.prisma.certificate.findMany({
      where,
      include: this.defaultInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtention d'un certificat par son ID interne
   */
  async findOne(id: string, currentUser: any) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
      include: this.defaultInclude,
    });

    if (!certificate) {
      throw new NotFoundException(`Diplôme introuvable`);
    }

    if (
      currentUser.role !== UserRole.SUPER_ADMIN &&
      currentUser.universityId !== certificate.universityId
    ) {
      throw new ForbiddenException('Accès non autorisé à ce diplôme');
    }

    return certificate;
  }

  /**
   * Vérification publique d'un diplôme (Accès libre) avec journalisation d'audit
   */
  async verifyCertificatePublic(publicIdentifier: string, reqContext?: { ipAddress?: string; userAgent?: string }) {
    const cert = await this.prisma.certificate.findUnique({
      where: { publicIdentifier },
      include: this.defaultInclude,
    });

    if (!cert) {
      return {
        isValid: false,
        message: 'Aucun diplôme correspondant à cet identifiant n\'a été trouvé.',
      };
    }

    // Traçabilité de la consultation de vérification
    await this.prisma.verificationLog.create({
      data: {
        certificateId: cert.id,
        ipAddress: reqContext?.ipAddress,
        userAgent: reqContext?.userAgent,
        status: cert.status,
      },
    }).catch(() => {
      // Ignorer l'échec de log pour ne pas bloquer la réponse publique
    });

    const studentName = cert.student
      ? `${cert.student.firstName} ${cert.student.lastName}`
      : `${cert.studentFirstName} ${cert.studentLastName}`;

    if (cert.status === CertificateStatus.REVOKED) {
      return {
        isValid: false,
        status: CertificateStatus.REVOKED,
        revokedAt: cert.revokedAt,
        revocationReason: cert.revocationReason,
        message: 'Ce diplôme a été révoqué par l\'institution émettrice.',
        certificate: {
          publicIdentifier: cert.publicIdentifier,
          certificateNumber: cert.certificateNumber,
          studentName,
          universityName: cert.university?.name || 'Inconnue',
        },
      };
    }

    return {
      isValid: true,
      status: cert.status,
      message: 'Diplôme authentique et valide.',
      certificate: {
        ...cert,
        studentName,
        university: cert.university,
      },
    };
  }

  /**
   * Révoquer un diplôme existant
   */
  async revokeCertificate(
    certificateId: string,
    dto: RevokeCertificateDto,
    currentUser: any,
  ) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { university: true, student: true },
    });

    if (!certificate) {
      throw new NotFoundException(`Diplôme introuvable avec l'identifiant : ${certificateId}`);
    }

    if (
      currentUser.role !== UserRole.SUPER_ADMIN &&
      currentUser.universityId !== certificate.universityId
    ) {
      throw new ForbiddenException('Vous ne pouvez pas révoquer un diplôme d\'un autre établissement.');
    }

    if (certificate.status === CertificateStatus.REVOKED) {
      throw new BadRequestException('Ce diplôme a déjà été révoqué précédemment.');
    }

    const updatedCertificate = await this.prisma.certificate.update({
      where: { id: certificateId },
      data: {
        status: CertificateStatus.REVOKED,
        revocationReason: dto.reason.trim(),
        revokedAt: new Date(),
      },
      include: this.defaultInclude,
    });

    const studentName = updatedCertificate.student
      ? `${updatedCertificate.student.firstName} ${updatedCertificate.student.lastName}`
      : `${updatedCertificate.studentFirstName} ${updatedCertificate.studentLastName}`;

    return {
      message: 'Le diplôme a été révoqué avec succès.',
      certificate: {
        id: updatedCertificate.id,
        publicIdentifier: updatedCertificate.publicIdentifier,
        studentName,
        degreeTitle: updatedCertificate.degreeTitle,
        status: updatedCertificate.status,
        revocationReason: updatedCertificate.revocationReason,
        revokedAt: updatedCertificate.revokedAt,
        universityName: updatedCertificate.university?.name || 'Inconnue',
      },
    };
  }

  private buildCanonicalString(params: {
    publicIdentifier: string;
    studentFirstName: string;
    studentLastName: string;
    degreeTitle: string;
    fieldOfStudy: string;
    issueDate: string;
    universityCode: string;
  }): string {
    const clean = (str: string) => (str || '').trim().toUpperCase();
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

  private async generateQrCode(url: string): Promise<string> {
    try {
      return await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 2,
        width: 300,
        color: { dark: '#000000', light: '#FFFFFF' },
      });
    } catch {
      throw new InternalServerErrorException('Échec de la génération du QR Code');
    }
  }

  private generatePublicIdentifier(universityCode: string): string {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${universityCode.toUpperCase()}-${year}-${randomHex}`;
  }
}