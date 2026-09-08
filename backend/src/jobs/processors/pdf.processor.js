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
var PdfProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const pdf_queue_1 = require("../queues/pdf.queue");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const renderCertificateHtml = (data) => {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4 landscape; margin: 0; }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          margin: 0; padding: 40px;
          background: #fdfdfd; color: #1a1a1a;
          box-sizing: border-box; text-align: center;
        }
        .border-container {
          border: 8px solid #0f172a; padding: 30px;
          height: 100%; box-sizing: border-box; position: relative;
        }
        h1 { font-size: 38px; color: #0f172a; margin-top: 20px; text-transform: uppercase; }
        h2 { font-size: 26px; color: #2563eb; margin-top: 10px; }
        p { font-size: 18px; margin: 10px 0; }
        .student-name { font-size: 32px; font-weight: bold; margin: 20px 0; color: #0f172a; }
        .qr-code { position: absolute; bottom: 30px; right: 30px; width: 110px; height: 110px; }
        .footer { position: absolute; bottom: 30px; left: 30px; text-align: left; font-size: 11px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="border-container">
        <p><strong>${data.universityName}</strong></p>
        <h1>DIPLÔME UNIVERSTAIRE</h1>
        <p>Le présent document atteste que</p>
        <div class="student-name">${data.studentName}</div>
        <p>a obtenu le diplôme de :</p>
        <h2>${data.degreeTitle}</h2>
        <p>Spécialité / Filière : <strong>${data.fieldOfStudy}</strong> ${data.grade ? `(${data.grade})` : ''}</p>
        <p>Délivré le : ${new Date(data.issueDate).toLocaleDateString('fr-FR')}</p>

        <div class="footer">
          <p>Identifiant Public : ${data.publicIdentifier}</p>
          <p>Empreinte SHA-256 : ${data.canonicalHash.substring(0, 32)}...</p>
        </div>

        <img class="qr-code" src="${data.qrCodeUrl}" alt="QR Code Vérification" />
      </div>
    </body>
    </html>
  `;
};
let PdfProcessor = PdfProcessor_1 = class PdfProcessor extends bullmq_1.WorkerHost {
    prisma;
    logger = new common_1.Logger(PdfProcessor_1.name);
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async process(job) {
        this.logger.log(`[Worker PDF] Traitement du job #${job.id} pour le diplôme ${job.data.documentNumber}`);
        try {
            const fileUrl = `https://storage.certiuni.com/certificates/${job.data.certificateId}.pdf`;
            await this.prisma.certificate.update({
                where: { id: job.data.certificateId },
                data: {
                    pdfUrl: fileUrl,
                },
            });
            this.logger.log(`[Worker PDF] Succès job #${job.id} - Fichier disponible : ${fileUrl}`);
            return { success: true, fileUrl };
        }
        catch (error) {
            this.logger.error(`[Worker PDF] Échec du job #${job.id} - ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.PdfProcessor = PdfProcessor;
exports.PdfProcessor = PdfProcessor = PdfProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(pdf_queue_1.PDF_QUEUE_NAME),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PdfProcessor);
//# sourceMappingURL=pdf.processor.js.map