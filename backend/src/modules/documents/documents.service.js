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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let DocumentsService = class DocumentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    documentSelect = client_1.Prisma.validator()({
        id: true,
        publicIdentifier: true,
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
    generateCertificateNumber() {
        const year = new Date().getFullYear();
        const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
        return `CERT-${year}-${randomHex}`;
    }
    async issue(dto, issuerUserId) {
        const student = await this.prisma.student.findUnique({
            where: { id: dto.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Étudiant introuvable (#${dto.studentId}).`);
        }
        const docType = await this.prisma.documentType.findUnique({
            where: { id: dto.documentTypeId },
        });
        if (!docType) {
            throw new common_1.NotFoundException(`Type de document introuvable (#${dto.documentTypeId}).`);
        }
        const certificateNumber = this.generateCertificateNumber();
        const issuedAt = dto.issuedAt ? new Date(dto.issuedAt) : new Date();
        const verificationUrl = `${process.env.FRONTEND_VERIFY_URL || 'https://verify.certiuni.com'}/${certificateNumber}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verificationUrl)}`;
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
                status: client_1.CertificateStatus.ISSUED,
                metadataJson: {
                    mention: dto.mention,
                    enrollmentId: dto.enrollmentId,
                    qrCodeUrl,
                },
            },
            select: this.documentSelect,
        });
    }
    async batchIssue(dto, issuerUserId) {
        const results = [];
        const errors = [];
        for (let i = 0; i < dto.documents.length; i++) {
            const item = dto.documents[i];
            try {
                const issuedDoc = await this.issue(item, issuerUserId);
                results.push(issuedDoc);
            }
            catch (error) {
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
    async findOne(id) {
        const document = await this.prisma.certificate.findUnique({
            where: { id },
            select: this.documentSelect,
        });
        if (!document) {
            throw new common_1.NotFoundException(`Document introuvable (#${id}).`);
        }
        return document;
    }
    async findByNumber(certificateNumber) {
        const document = await this.prisma.certificate.findUnique({
            where: { publicIdentifier: certificateNumber.trim().toUpperCase() },
            select: this.documentSelect,
        });
        if (!document) {
            throw new common_1.NotFoundException(`Document introuvable avec le numéro "${certificateNumber}".`);
        }
        return document;
    }
    async revoke(id, dto) {
        const document = await this.findOne(id);
        if (document.status === client_1.CertificateStatus.REVOKED) {
            throw new common_1.ConflictException('Ce document a déjà été révoqué.');
        }
        return this.prisma.certificate.update({
            where: { id },
            data: {
                status: client_1.CertificateStatus.REVOKED,
                revokedAt: new Date(),
                revocationReason: dto.reason.trim(),
            },
            select: this.documentSelect,
        });
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map