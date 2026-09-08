"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let VerificationService = class VerificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    verificationSelect = {
        id: true,
        certificateNumber: true,
        title: true,
        mention: true,
        issuedAt: true,
        documentHash: true,
        isRevoked: true,
        revokedAt: true,
        revocationReason: true,
        student: {
            select: {
                matricule: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        },
        documentType: {
            select: {
                code: true,
                name: true,
            },
        },
        enrollment: {
            select: {
                academicYear: {
                    select: { year: true },
                },
                program: {
                    select: {
                        department: {
                            select: {
                                faculty: {
                                    select: {
                                        university: {
                                            select: {
                                                name: true,
                                                code: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };
    formatVerificationResponse(certificate) {
        const isRevoked = certificate.isRevoked;
        return {
            isValid: !isRevoked,
            status: isRevoked ? 'REVOKED' : 'AUTHENTIC',
            message: isRevoked
                ? 'Ce document a été révoqué par l\'établissement émetteur.'
                : 'Document authentique et valide émis par une institution certifiée.',
            verifiedAt: new Date(),
            documentDetails: {
                certificateNumber: certificate.certificateNumber,
                title: certificate.title,
                mention: certificate.mention,
                issuedAt: certificate.issuedAt,
                isRevoked: certificate.isRevoked,
                revokedAt: certificate.revokedAt,
                revocationReason: certificate.revocationReason,
                documentHash: certificate.documentHash,
                student: {
                    firstName: certificate.student.user.firstName,
                    lastName: certificate.student.user.lastName,
                    matricule: certificate.student.matricule,
                },
                documentType: {
                    code: certificate.documentType.code,
                    name: certificate.documentType.name,
                },
                institution: {
                    name: certificate.enrollment?.program?.department?.faculty?.university?.name || 'N/A',
                    code: certificate.enrollment?.program?.department?.faculty?.university?.code || 'N/A',
                },
                academicYear: certificate.enrollment?.academicYear?.year || 'N/A',
            },
        };
    }
    async verifyByHash(dto) {
        const cleanHash = dto.hash.trim().toLowerCase();
        const certificate = await this.prisma.certificate.findFirst({
            where: {
                canonicalHash: {
                    equals: cleanHash,
                    mode: 'insensitive',
                },
            },
            select: this.verificationSelect,
        });
        if (!certificate) {
            throw new common_1.NotFoundException({
                isValid: false,
                status: 'NOT_FOUND',
                message: 'Aucun document correspondant à ce hash SHA-256 n\'a été trouvé.',
                verifiedAt: new Date(),
            });
        }
        return this.formatVerificationResponse(certificate);
    }
    async verifyByQr(dto) {
        let rawInput = dto.qrData.trim();
        if (rawInput.includes('/')) {
            const parts = rawInput.split('/');
            rawInput = parts[parts.length - 1];
        }
        const certificateNumber = rawInput.toUpperCase();
        const certificate = await this.prisma.certificate.findUnique({
            where: { publicIdentifier: certificateNumber },
            select: this.verificationSelect,
        });
        if (!certificate) {
            throw new common_1.NotFoundException({
                isValid: false,
                status: 'NOT_FOUND',
                message: `Aucun document trouvé pour le numéro de certificat "${certificateNumber}".`,
                verifiedAt: new Date(),
            });
        }
        return this.formatVerificationResponse(certificate);
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map