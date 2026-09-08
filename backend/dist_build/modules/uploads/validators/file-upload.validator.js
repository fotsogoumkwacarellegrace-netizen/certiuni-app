"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadValidator = void 0;
const common_1 = require("@nestjs/common");
class FileUploadValidator {
    static MAX_SIZE_BYTES = 10 * 1024 * 1024;
    static ALLOWED_MIME_TYPES = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    static validate(file) {
        if (!file) {
            throw new common_1.BadRequestException('Aucun fichier n\'a été fourni.');
        }
        if (file.size > this.MAX_SIZE_BYTES) {
            throw new common_1.BadRequestException(`La taille du fichier dépasse la limite autorisée de 10 Mo. (Taille reçue: ${(file.size /
                (1024 * 1024)).toFixed(2)} Mo)`);
        }
        if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Type de fichier non supporté (${file.mimetype}). Types acceptés : PDF, PNG, JPEG, WEBP, CSV, XLS, XLSX.`);
        }
    }
}
exports.FileUploadValidator = FileUploadValidator;
//# sourceMappingURL=file-upload.validator.js.map