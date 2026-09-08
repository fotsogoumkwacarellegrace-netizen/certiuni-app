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
var EmailQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueService = exports.EMAIL_QUEUE_NAME = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
exports.EMAIL_QUEUE_NAME = 'email-delivery-queue';
let EmailQueueService = EmailQueueService_1 = class EmailQueueService {
    emailQueue;
    logger = new common_1.Logger(EmailQueueService_1.name);
    constructor(emailQueue) {
        this.emailQueue = emailQueue;
    }
    async addEmailJob(payload) {
        const job = await this.emailQueue.add('send-transactional-email', payload, {
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 3000,
            },
            removeOnComplete: { age: 3600 },
            removeOnFail: { age: 86400 * 3 },
        });
        this.logger.log(`Email transactionnel enfilé [ID: ${job.id}] pour ${payload.to}`);
        return job.id;
    }
};
exports.EmailQueueService = EmailQueueService;
exports.EmailQueueService = EmailQueueService = EmailQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)(exports.EMAIL_QUEUE_NAME)),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], EmailQueueService);
//# sourceMappingURL=email.queue.js.map