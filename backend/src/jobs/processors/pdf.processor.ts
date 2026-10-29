import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PDF_QUEUE_NAME, PdfJobPayload } from '../queues/pdf.queue';
import { generateCertificatePdf } from '../../services/pdf.service';
import { uploadCertificatePdfToS3 } from '../../services/storage.service';
import { generateQrCodeDataUrl } from '../../services/qr.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
@Processor(PDF_QUEUE_NAME)
export class PdfProcessor extends WorkerHost {
    private readonly logger = new Logger(PdfProcessor.name);

    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async process(job: Job<PdfJobPayload>): Promise<any> {
        const data = job.data;
        this.logger.log(
            `[Worker PDF] Traitement du job #${job.id} pour le diplôme ${data.publicIdentifier} (certificateId=${data.certificateId})`,
        );

        try {
            // 1. Génération du véritable PDF (Puppeteer) à partir du template HTML/CSS
            const pdfBuffer: Buffer = await generateCertificatePdf({
                publicIdentifier: data.publicIdentifier,
                studentName: data.studentName,
                degreeTitle: data.degreeTitle,
                fieldOfStudy: data.fieldOfStudy,
                grade: data.grade ?? '',
                issueDate: data.issueDate,
                universityName: data.universityName,
                universityLogoUrl: data.universityLogoUrl,
                canonicalHash: data.canonicalHash,
                qrCodeDataUrl: await generateQrCodeDataUrl(data.verificationUrl),
            });

            // 2. Téléversement du PDF sur S3 / MinIO
            const { fileKey, fileUrl } = await uploadCertificatePdfToS3(
                pdfBuffer,
                data.publicIdentifier,
            );

            // 3. Mise à jour du diplôme en base (empreinte stockée, statut ISSUED)
            const updatedCertificate = await this.prisma.certificate.update({
                where: { id: data.certificateId },
                data: {
                    pdfUrl: fileUrl,
                    pdfKey: fileKey,
                    status: 'ISSUED',
                },
            });

            this.logger.log(
                `[Worker PDF] Diplôme ${data.publicIdentifier} généré, stocké (${fileKey}) et marqué ISSUED.`,
            );

            return {
                success: true,
                certificateId: updatedCertificate.id,
                publicIdentifier: updatedCertificate.publicIdentifier,
                pdfUrl: fileUrl,
                pdfKey: fileKey,
                status: updatedCertificate.status,
            };
        } catch (error: any) {
            this.logger.error(
                `[Worker PDF] Échec du job #${job.id} pour le diplôme ${data.publicIdentifier}: ${error.message}`,
                error.stack,
            );

            // Marquer comme échoué en base si c'est la dernière tentative
            const maxAttempts = (job.opts.attempts as number) ?? 3;
            if (job.attemptsMade + 1 >= maxAttempts) {
                await this.prisma.certificate
                    .update({
                        where: { id: data.certificateId },
                        data: { status: 'FAILED' },
                    })
                    .catch(() => {
                        /* best effort */
                    });
            }

            throw error; // Déclenche le système de retry de BullMQ
        }
    }
}
