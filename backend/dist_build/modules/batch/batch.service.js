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
var BatchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const upload_batch_dto_1 = require("./dto/upload-batch.dto");
const xlsx = __importStar(require("xlsx"));
let BatchService = BatchService_1 = class BatchService {
    prisma;
    logger = new common_1.Logger(BatchService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processBatchUpload(file, dto, userId) {
        if (!file) {
            throw new common_1.BadRequestException('Aucun fichier fourni pour l\'importation.');
        }
        let rows = [];
        try {
            const workbook = xlsx.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Erreur lors de la lecture du fichier : ${error.message}`);
        }
        if (rows.length === 0) {
            throw new common_1.BadRequestException('Le fichier d\'importation est vide.');
        }
        const results = [];
        let validCount = 0;
        let invalidCount = 0;
        for (let index = 0; index < rows.length; index++) {
            const rowData = rows[index];
            const rowErrors = this.validateRow(rowData, dto.batchType);
            const isValid = rowErrors.length === 0;
            if (isValid)
                validCount++;
            else
                invalidCount++;
            results.push({
                rowNumber: index + 2,
                data: rowData,
                isValid,
                ...(rowErrors.length > 0 && { errors: rowErrors }),
            });
        }
        const processedRows = results.filter((item) => item.isValid);
        this.logger.log(`[Batch] Lot ${dto.batchType} traité par l'utilisateur #${userId}. Succès: ${validCount}, Échecs: ${invalidCount}`);
        return {
            batchType: dto.batchType,
            institutionId: dto.institutionId,
            totalRows: rows.length,
            validRowsCount: validCount,
            invalidRowsCount: invalidCount,
            details: results,
        };
    }
    validateRow(data, batchType) {
        const errors = [];
        if (batchType === upload_batch_dto_1.BatchType.STUDENTS_IMPORT) {
            if (!data['matricule'] || String(data['matricule']).trim() === '') {
                errors.push('Le matricule est obligatoire.');
            }
            if (!data['firstName'] || String(data['firstName']).trim() === '') {
                errors.push('Le prénom est obligatoire.');
            }
            if (!data['lastName'] || String(data['lastName']).trim() === '') {
                errors.push('Le nom est obligatoire.');
            }
            if (!data['email'] || !String(data['email']).includes('@')) {
                errors.push('L\'adresse e-mail est absente ou invalide.');
            }
        }
        else if (batchType === upload_batch_dto_1.BatchType.DIPLOMAS_IMPORT) {
            if (!data['studentMatricule'])
                errors.push('Le matricule étudiant est obligatoire.');
            if (!data['diplomaTitle'])
                errors.push('Le titre du diplôme est obligatoire.');
            if (!data['issueDate'])
                errors.push('La date de délivrance est obligatoire.');
        }
        return errors;
    }
};
exports.BatchService = BatchService;
exports.BatchService = BatchService = BatchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BatchService);
//# sourceMappingURL=batch.service.js.map