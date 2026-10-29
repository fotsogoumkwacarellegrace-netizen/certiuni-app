import {
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { FileUploadValidator } from './validators/file-upload.validator';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class UploadsService {
    async processAndUpload(
        file: Express.Multer.File,
        _dto?: UploadFileDto,
        _folder = 'general',
    ) {
        FileUploadValidator.validate(file);
        throw new HttpException(
            { error: 'not_configured', feature: 'storage' },
            HttpStatus.NOT_IMPLEMENTED,
        );
    }
}
