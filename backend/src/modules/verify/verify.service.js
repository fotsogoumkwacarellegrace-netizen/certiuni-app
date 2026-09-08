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
var VerifyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let VerifyService = VerifyService_1 = class VerifyService {
    prisma;
    logger = new common_1.Logger(VerifyService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyByHash(hash) {
        const formattedHash = hash.trim().toLowerCase();
        const certificate = await this.prisma.certificate.findFirst({
            where: { canonicalHash: formattedHash },
            include: {
                university: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!certificate) {
            this.logger.warn(`[Verification] Tentative de vérification échouée pour le hash: ${formattedHash}`);
            throw new common_1.NotFoundException('Aucun document certifié ne correspond à cette empreinte cryptographique.');
        }
        const isRevoked = certificate.status === 'REVOKED';
        const isValid = certificate.status === 'ISSUED';
        return {
            isValid,
            status: isRevoked ? 'REVOKED' : isValid ? 'VALID' : 'EXPIRED',
            documentDetails: {
                documentNumber: certificate.publicIdentifier,
                studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
                degreeTitle: certificate.degreeTitle,
                institutionName: certificate.university.name,
                issueDate: certificate.issueDate,
                ...(isRevoked && { revocationReason: certificate.revocationReason || 'Document révoqué par l\'institution.' }),
            },
            verifiedAt: new Date(),
        };
    }
    async verifyByQrData(qrData) {
        let hash = qrData.trim();
        if (hash.includes('/verify/')) {
            hash = hash.split('/verify/').pop() || hash;
        }
        hash = hash.split('?')[0];
        return this.verifyByHash(hash);
    }
};
exports.VerifyService = VerifyService;
exports.VerifyService = VerifyService = VerifyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VerifyService);
//# sourceMappingURL=verify.service.js.map