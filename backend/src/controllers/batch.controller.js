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
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCertificatesBatch = void 0;
const openapi = require("@nestjs/swagger");
const sync_1 = require("csv-parse/sync");
const xlsx = __importStar(require("xlsx"));
const database_1 = require("../config/database");
const crypto_service_1 = require("../services/crypto.service");
const pdf_queue_1 = require("../jobs/queues/pdf.queue");
const audit_service_1 = require("../services/audit.service");
const certificate_dto_1 = require("../dtos/certificate.dto");
const app_error_1 = require("../errors/app.error");
const parseFileBuffer = (buffer, originalName) => {
    if (originalName.endsWith('.csv')) {
        return (0, sync_1.parse)(buffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
    }
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return xlsx.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: '',
    });
};
const importCertificatesBatch = async (req, res) => {
    if (!req.file) {
        throw new app_error_1.BadRequestError('Veuillez fournir un fichier CSV ou Excel.');
    }
    const universityId = req.user?.universityId;
    if (!universityId) {
        throw new app_error_1.ForbiddenError('L\'utilisateur doit être rattaché à une université pour émettre des diplômes.');
    }
    const university = await database_1.prisma.university.findUnique({
        where: { id: universityId },
    });
    if (!university) {
        throw new app_error_1.NotFoundError('Université introuvable.');
    }
    let rawRows;
    try {
        rawRows = parseFileBuffer(req.file.buffer, req.file.originalname);
    }
    catch {
        throw new app_error_1.BadRequestError('Échec de la lecture du fichier. Assurez-vous que le format est valide.');
    }
    if (!rawRows || rawRows.length === 0) {
        throw new app_error_1.BadRequestError('Le fichier transmis est vide.');
    }
    if (rawRows.length > 500) {
        throw new app_error_1.BadRequestError('La taille maximale autorisée par lot est de 500 diplômes.');
    }
    const successfulImports = [];
    const errors = [];
    for (let index = 0; index < rawRows.length; index++) {
        const rowNum = index + 2;
        const row = rawRows[index];
        const validation = certificate_dto_1.IssueCertificateSchema.safeParse(row);
        if (!validation.success) {
            errors.push({
                row: rowNum,
                errors: validation.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
            });
            continue;
        }
        const validatedData = validation.data;
        const canonicalHash = crypto_service_1.CryptoService.calculateCanonicalHash({
            studentIdentifier: validatedData.studentIdentifier,
            degreeTitle: validatedData.degreeTitle,
            issueDate: validatedData.issueDate,
            universityId,
        });
        const existingCert = await database_1.prisma.certificate.findUnique({
            where: { canonicalHash },
        });
        if (existingCert) {
            errors.push({
                row: rowNum,
                errors: [`Un diplôme avec cette empreinte existe déjà (${validatedData.studentIdentifier}).`],
            });
            continue;
        }
        const publicIdentifier = `CERT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const verificationUrl = `${process.env.FRONTEND_URL || 'https://certiuni.app'}/verify/${publicIdentifier}`;
        try {
            const certificate = await database_1.prisma.certificate.create({
                data: {
                    publicIdentifier,
                    canonicalHash,
                    studentIdentifier: validatedData.studentIdentifier,
                    studentFirstName: validatedData.studentFirstName,
                    studentLastName: validatedData.studentLastName,
                    studentEmail: validatedData.studentEmail,
                    degreeTitle: validatedData.degreeTitle,
                    fieldOfStudy: validatedData.fieldOfStudy,
                    grade: validatedData.grade,
                    issueDate: new Date(validatedData.issueDate),
                    status: 'PENDING',
                    universityId,
                    issuedById: req.user.id,
                },
            });
            await (0, pdf_queue_1.addPdfJobToQueue)({
                certificateId: certificate.id,
                publicIdentifier,
                studentName: `${validatedData.studentFirstName} ${validatedData.studentLastName}`,
                degreeTitle: validatedData.degreeTitle,
                fieldOfStudy: validatedData.fieldOfStudy,
                grade: validatedData.grade,
                issueDate: validatedData.issueDate,
                universityName: university.name,
                universityLogoUrl: university.logoUrl || undefined,
                canonicalHash,
                verificationUrl,
                documentNumber: certificate.publicIdentifier,
                universityId: certificate.universityId,
            });
            successfulImports.push({ id: certificate.id, publicIdentifier });
        }
        catch {
            errors.push({
                row: rowNum,
                errors: ['Erreur lors de l\'enregistrement en base de données.'],
            });
        }
    }
    await audit_service_1.AuditService.logAction({
        action: audit_service_1.AuditAction.CERTIFICATE_ISSUED,
        userId: req.user.id,
        universityId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: {
            batchFileName: req.file.originalname,
            totalRows: rawRows.length,
            successCount: successfulImports.length,
            errorCount: errors.length,
        },
    });
    res.status(207).json({
        success: true,
        status: 'multi_status',
        message: `Traitement terminé : ${successfulImports.length} diplômes importés avec succès, ${errors.length} échec(s).`,
        summary: {
            totalProcessed: rawRows.length,
            successCount: successfulImports.length,
            failedCount: errors.length,
        },
        data: {
            successfulImports,
            errors,
        },
    });
};
exports.importCertificatesBatch = importCertificatesBatch;
//# sourceMappingURL=batch.controller.js.map