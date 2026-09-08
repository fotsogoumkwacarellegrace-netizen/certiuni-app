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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PdfQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfQueueService = exports.addPdfJobToQueue = exports.pdfQueue = exports.PDF_QUEUE_NAME = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("@nestjs/bullmq");
exports.PDF_QUEUE_NAME = 'pdf-generation-queue';
exports.pdfQueue = new bullmq_1.Queue(exports.PDF_QUEUE_NAME, {
    connection: redis_1.redisClient,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: { age: 86400, count: 1000 },
        removeOnFail: { age: 604800 },
    },
});
const addPdfJobToQueue = async (data) => {
    const job = await exports.pdfQueue.add(`pdf-${data.publicIdentifier}`, data, {
        jobId: `job-pdf-${data.certificateId}`,
    });
    return job.id || '';
};
exports.addPdfJobToQueue = addPdfJobToQueue;
let PdfQueueService = PdfQueueService_1 = class PdfQueueService {
    pdfQueue;
    logger = new common_1.Logger(PdfQueueService_1.name);
    constructor(pdfQueue) {
        this.pdfQueue = pdfQueue;
    }
    async addPdfGenerationJob(payload) {
        const job = await this.pdfQueue.add('generate-certificate-pdf', payload, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
            removeOnComplete: { age: 3600 },
            removeOnFail: { age: 86400 },
        });
        this.logger.log(`Tâche de génération PDF enfilée [ID: ${job.id}] pour le diplôme ${payload.documentNumber}`);
        return job.id;
    }
};
exports.PdfQueueService = PdfQueueService;
exports.PdfQueueService = PdfQueueService = PdfQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_2.InjectQueue)(exports.PDF_QUEUE_NAME)),
    __metadata("design:paramtypes", [bullmq_1.Queue])
], PdfQueueService);
//# sourceMappingURL=pdf.queue.js.map