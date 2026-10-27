import { Injectable, Logger, BadRequestException } from '@nestjs/common';
// import { R2S3StorageService } from '../../integrations/providers/storage/r2-s3.service';
import { FileUploadValidator } from './validators/file-upload.validator';
import { UploadFileDto } from './dto/upload-file.dto';
import * as fs from 'fs';

@Injectable()
export class UploadsService {
    private readonly logger = new Logger(UploadsService.name);

    constructor(/*private readonly storageService: R2S3StorageService*/) { }

    async processAndUpload(
        file: Express.Multer.File,
        dto?: UploadFileDto,
        folder: string = 'general',
    ) {
        FileUploadValidator.validate(file);

        try {
            const fileBuffer = file.buffer || fs.readFileSync(file.path);

            // Envoi du fichier vers le stockage S3 / R2 via IntegrationsModule
            // const uploadResult = await this.storageService.uploadFile(
            //     fileBuffer,
            //     file.originalname,
            //     file.mimetype,
            //     folder,
            // );
            const uploadResult = { key: 'mock-key', url: 'mock-url' };

            // Nettoyage du fichier temporaire si conservé localement sur disque
            if (file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            this.logger.log(`Fichier téléversé avec succès : ${uploadResult.key}`);

            return {
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                category: dto?.category,
                description: dto?.description,
                ...uploadResult,
            };
        } catch (error: any) {
            this.logger.error(`Échec du téléversement : ${error.message}`);
            throw new BadRequestException(
                `Erreur lors du traitement du fichier : ${(error as Error).message}`,
            );
        }
    }
}