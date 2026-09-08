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
var R2S3StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2S3StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let R2S3StorageService = R2S3StorageService_1 = class R2S3StorageService {
    configService;
    logger = new common_1.Logger(R2S3StorageService_1.name);
    bucketName;
    constructor(configService) {
        this.configService = configService;
        this.bucketName = this.configService.get('S3_BUCKET_NAME', 'certiuni-docs');
    }
    async uploadFile(fileBuffer, fileName, mimeType, folder = 'documents') {
        const key = `${folder}/${Date.now()}-${fileName.replace(/\s+/g, '_')}`;
        this.logger.log(`[Storage] Fichier uploadé vers S3/R2 : ${key}`);
        const publicUrl = `${this.configService.get('S3_PUBLIC_ENDPOINT', 'https://pub-r2.certiuni.com')}/${key}`;
        return {
            url: publicUrl,
            key,
            bucket: this.bucketName,
            mimeType,
        };
    }
    async deleteFile(key) {
        this.logger.log(`[Storage] Fichier supprimé : ${key}`);
    }
    async getSignedUrl(key, expiresInSeconds = 3600) {
        return `${this.configService.get('S3_PUBLIC_ENDPOINT')}/${key}?expires=${expiresInSeconds}`;
    }
};
exports.R2S3StorageService = R2S3StorageService;
exports.R2S3StorageService = R2S3StorageService = R2S3StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], R2S3StorageService);
//# sourceMappingURL=r2-r3.service.js.map