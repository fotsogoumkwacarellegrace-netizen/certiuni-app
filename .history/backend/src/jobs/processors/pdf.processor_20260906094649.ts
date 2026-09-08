import { Job } from 'bullmq';
// Change from: import { puppeteer } from 'puppeteer';
import puppeteer from 'puppeteer';
import { redisClient } from '../../config/redis';
import { prisma } from '../../config/database';
import { generateQrCodeDataUrl } from '../../services/qr.service';
import { uploadCertificatePdfToS3 } from '../../services/s3.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PDF_QUEUE_NAME, PdfJobPayload, PdfJobData } from '../queues/pdf.queue';
import { PdfService } from '../../pdf/pdf.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';


/**
 * Fonction de rendu HTML du diplôme (peut être remplacée par Handlebars)
 */
const renderCertificateHtml = (data: PdfJobData & { qrCodeUrl: string }): string => {
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

@Processor(PDF_QUEUE_NAME)
export class PdfProcessor extends WorkerHost {
    private readonly logger = new Logger(PdfProcessor.name);

    constructor(
        private readonly pdfService: PdfService,
        private readonly prisma: PrismaService,
    ) {
        super();
    }

    async process(job: Job<PdfJobPayload>): Promise<any> {
        this.logger.log(`[Worker PDF] Traitement du job #${job.id} pour le diplôme ${job.data.documentNumber}`);

        try {
            // 1. Génération du PDF & Upload sur S3 / MinIO
            const { fileUrl, fileKey } = await this.pdfService.generateAndUploadCertificate(job.data);

            // 2. Mise à jour du statut dans la base de données via Prisma
            await this.prisma.certificate.update({
                where: { id: job.data.certificateId },
                data: {
                    fileUrl,
                    fileKey,
                    isGenerated: true,
                    generatedAt: new Date(),
                },
            });

            this.logger.log(`[Worker PDF] Succès job #${job.id} - Fichier disponible : ${fileUrl}`);
            return { success: true, fileUrl, fileKey };
        } catch (error: any) {
            this.logger.error(`[Worker PDF] Échec du job #${job.id} - ${error.message}`, error.stack);
            throw error; // Relance l'exception pour que BullMQ applique la stratégie de retry
        }
    }
}

// Instanciation du Worker BullMQ
export const pdfWorker = new Worker(PDF_QUEUE_NAME, async (job) => {
           
});

// Événements d'écoute du Worker
pdfWorker.on('completed', (job) => {
    console.log(`[Worker PDF] Job ${job.id} terminé avec succès.`);
});

pdfWorker.on('failed', (job, err) => {
    console.error(`[Worker PDF] Job ${job?.id} a échoué avec l'erreur : ${err.message}`);
});

