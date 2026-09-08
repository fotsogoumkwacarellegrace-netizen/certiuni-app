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
exports.PublicVerifyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PublicVerifyService = class PublicVerifyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyByIdentifier(publicIdentifier) {
        const cleanIdentifier = publicIdentifier.trim().toUpperCase();
        const certificate = await this.prisma.certificate.findUnique({
            where: { publicIdentifier: cleanIdentifier },
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
        if (!certificate) {
            throw new common_1.NotFoundException({
                isValid: false,
                message: 'Aucun enregistrement ne correspond à cet identifiant de diplôme.',
                code: 'CERTIFICATE_NOT_FOUND',
            });
        }
        return {
            isValid: certificate.status === 'ISSUED',
            publicIdentifier: certificate.publicIdentifier,
            studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
            degreeTitle: certificate.degreeTitle,
            fieldOfStudy: certificate.fieldOfStudy,
            grade: certificate.grade,
            issueDate: certificate.issueDate,
            status: certificate.status,
            canonicalHash: certificate.canonicalHash,
            university: {
                name: certificate.university.name,
                code: certificate.university.code,
                logoUrl: certificate.university.logoUrl || undefined,
            },
            revocationReason: certificate.status === 'REVOKED' ? certificate.revocationReason || 'Diplôme révoqué par l\'établissement' : undefined,
        };
    }
    async verifyByHash(hash) {
        const cleanHash = hash.trim().toLowerCase();
        const certificate = await this.prisma.certificate.findFirst({
            where: { canonicalHash: cleanHash },
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
        if (!certificate) {
            throw new common_1.NotFoundException({
                isValid: false,
                message: 'L\'empreinte cryptographique fournie ne correspond à aucun document certifié.',
                code: 'HASH_NOT_FOUND',
            });
        }
        return this.verifyByIdentifier(certificate.publicIdentifier);
    }
};
exports.PublicVerifyService = PublicVerifyService;
exports.PublicVerifyService = PublicVerifyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicVerifyService);
//# sourceMappingURL=public-verify.service.js.map