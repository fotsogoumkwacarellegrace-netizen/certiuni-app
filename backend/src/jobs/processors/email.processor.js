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
var EmailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const email_queue_1 = require("../queues/email.queue");
const email_service_1 = require("../../services/email.service");
let EmailProcessor = EmailProcessor_1 = class EmailProcessor extends bullmq_1.WorkerHost {
    emailService;
    logger = new common_1.Logger(EmailProcessor_1.name);
    constructor(emailService) {
        super();
        this.emailService = emailService;
    }
    async process(job) {
        this.logger.log(`[Worker Email] Envoi en cours pour la tâche #${job.id} vers ${job.data.to}`);
        try {
            const { to, subject, context, attachments } = job.data;
            const html = typeof context.html === 'string'
                ? context.html
                : JSON.stringify(context);
            await this.emailService.sendEmail({
                to,
                subject,
                html,
                attachments,
            });
            this.logger.log(`[Worker Email] Message délivré avec succès à ${job.data.to}`);
            return { success: true, recipient: job.data.to };
        }
        catch (error) {
            this.logger.error(`[Worker Email] Échec: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.EmailProcessor = EmailProcessor;
exports.EmailProcessor = EmailProcessor = EmailProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(email_queue_1.EMAIL_QUEUE_NAME),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map