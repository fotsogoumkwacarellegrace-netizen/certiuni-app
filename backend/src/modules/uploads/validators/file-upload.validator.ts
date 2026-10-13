import { BadRequestException } from '@nestjs/common';

export class FileUploadValidator {
    private static readonly MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo
    private static readonly ALLOWED_MIME_TYPES = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    static validate(file: Express.Multer.File): void {
        if (!file) {
            throw new BadRequestException('Aucun fichier n\'a été fourni.');
        }

        if (file.size > this.MAX_SIZE_BYTES) {
            throw new BadRequestException(
                `La taille du fichier dépasse la limite autorisée de 10 Mo. (Taille reçue: ${(
                    file.size /
                    (1024 * 1024)
                ).toFixed(2)} Mo)`,
            );
        }

        if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new BadRequestException(
                `Type de fichier non supporté (${file.mimetype}). Types acceptés : PDF, PNG, JPEG, WEBP, CSV, XLS, XLSX.`,
            );
        }
    }
}