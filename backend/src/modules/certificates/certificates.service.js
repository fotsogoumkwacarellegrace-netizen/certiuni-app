"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
const QRCode = __importStar(require("qrcode"));
let CertificatesService = class CertificatesService {
    prisma;
    baseUrl;
    constructor(prisma) {
        this.prisma = prisma;
        this.baseUrl = process.env.PUBLIC_VERIFY_URL || 'https://certiuni.app/verify';
    }
    defaultInclude = client_1.Prisma.validator()({
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
        program: { select: { id: true, name: true, code: true } },
        academicYear: { select: { id: true, year: true, universityId: true } },
        academicLevel: { select: { id: true, name: true, code: true } },
        template: { select: { id: true, name: true, layoutConfig: true } },
        issuedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
    });
    async issueCertificate(dto, currentUser) {
        const targetUniversityId = currentUser.universityId || dto.universityId;
        if (!targetUniversityId) {
            throw new common_1.BadRequestException('L\'identifiant de l\'université est requis');
        }
        const university = await this.prisma.university.findUnique({
            where: { id: targetUniversityId },
        });
        if (!university) {
            throw new common_1.NotFoundException(`Établissement introuvable`);
        }
        if (currentUser.role !== client_1.UserRole.SUPER_ADMIN &&
            currentUser.universityId !== university.id) {
            throw new common_1.ForbiddenException('Vous ne pouvez émettre des diplômes que pour votre propre université');
        }
        const publicIdentifier = this.generatePublicIdentifier(university.code);
        let studentFirstName = dto.studentFirstName;
        let studentLastName = dto.studentLastName;
        let studentMatricule = dto.studentMatricule;
        if (dto.studentId) {
            const student = await this.prisma.student.findUnique({
                where: { id: dto.studentId },
            });
            if (!student) {
                throw new common_1.NotFoundException(`Étudiant introuvable`);
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
                    studentFirstName: studentFirstName?.trim(),
                    studentLastName: studentLastName?.trim(),
                    studentIdentifier: studentMatricule?.trim(),
                    studentEmail: studentMatricule
                        ? `${studentMatricule.toLowerCase()}@student.app`
                        : '',
                    degreeTitle: dto.degreeTitle.trim(),
                    fieldOfStudy: dto.fieldOfStudy.trim(),
                    grade: dto.grade?.trim(),
                    issueDate: new Date(dto.issueDate),
                    canonicalHash: sha256Hash,
                    metadataJson: {
                        ...(dto.metadataJson ?? {}),
                        qrCodeUrl: qrCodeDataUrl,
                    },
                    status: client_1.CertificateStatus.ISSUED,
                    universityId: university.id,
                    issuedById: currentUser.id,
                    ...(dto.studentId && { studentId: dto.studentId }),
                    ...(dto.programId && { programId: dto.programId }),
                    ...(dto.academicYearId && { yearId: dto.academicYearId }),
                    ...(dto.academicLevelId && { levelId: dto.academicLevelId }),
                    ...(dto.templateId && { templateId: dto.templateId }),
                },
                include: this.defaultInclude,
            });
            const displayStudentName = `${certificate.studentFirstName} ${certificate.studentLastName}`;
            return {
                message: 'Diplôme émis et certifié avec succès',
                certificate: {
                    id: certificate.id,
                    publicIdentifier: certificate.publicIdentifier,
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
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Un diplôme avec cet identifiant ou cette empreinte existe déjà.');
            }
            throw new common_1.InternalServerErrorException('Erreur lors de la création du diplôme dans la base de données : ' + error.message);
        }
    }
    async findAll(currentUser) {
        const where = currentUser.role === client_1.UserRole.SUPER_ADMIN
            ? {}
            : { universityId: currentUser.universityId };
        return this.prisma.certificate.findMany({
            where,
            include: this.defaultInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, currentUser) {
        const certificate = await this.prisma.certificate.findUnique({
            where: { id },
            include: this.defaultInclude,
        });
        if (!certificate) {
            throw new common_1.NotFoundException(`Diplôme introuvable`);
        }
        if (currentUser.role !== client_1.UserRole.SUPER_ADMIN &&
            currentUser.universityId !== certificate.universityId) {
            throw new common_1.ForbiddenException('Accès non autorisé à ce diplôme');
        }
        return certificate;
    }
    async verifyCertificatePublic(publicIdentifier, reqContext) {
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
        await this.prisma.verificationLog.create({
            data: {
                certificateId: cert.id,
                ipAddress: reqContext?.ipAddress,
                userAgent: reqContext?.userAgent,
            },
        }).catch(() => {
        });
        const studentName = cert.student
            ? `${cert.student.firstName} ${cert.student.lastName}`
            : `${cert.studentFirstName} ${cert.studentLastName}`;
        if (cert.status === client_1.CertificateStatus.REVOKED) {
            return {
                isValid: false,
                status: client_1.CertificateStatus.REVOKED,
                revokedAt: cert.revokedAt,
                revocationReason: cert.revocationReason,
                message: 'Ce diplôme a été révoqué par l\'institution émettrice.',
                certificate: {
                    publicIdentifier: cert.publicIdentifier,
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
    async revokeCertificate(certificateId, dto, currentUser) {
        const certificate = await this.prisma.certificate.findUnique({
            where: { id: certificateId },
            include: { university: true, student: true },
        });
        if (!certificate) {
            throw new common_1.NotFoundException(`Diplôme introuvable avec l'identifiant : ${certificateId}`);
        }
        if (currentUser.role !== client_1.UserRole.SUPER_ADMIN &&
            currentUser.universityId !== certificate.universityId) {
            throw new common_1.ForbiddenException('Vous ne pouvez pas révoquer un diplôme d\'un autre établissement.');
        }
        if (certificate.status === client_1.CertificateStatus.REVOKED) {
            throw new common_1.BadRequestException('Ce diplôme a déjà été révoqué précédemment.');
        }
        const updatedCertificate = await this.prisma.certificate.update({
            where: { id: certificateId },
            data: {
                status: client_1.CertificateStatus.REVOKED,
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
    buildCanonicalString(params) {
        const clean = (str) => (str || '').trim().toUpperCase();
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
    async generateQrCode(url) {
        try {
            return await QRCode.toDataURL(url, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                margin: 2,
                width: 300,
                color: { dark: '#000000', light: '#FFFFFF' },
            });
        }
        catch {
            throw new common_1.InternalServerErrorException('Échec de la génération du QR Code');
        }
    }
    generatePublicIdentifier(universityCode) {
        const year = new Date().getFullYear();
        const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
        return `${universityCode.toUpperCase()}-${year}-${randomHex}`;
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map