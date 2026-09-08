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
var AuditLogInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuditLogInterceptor = AuditLogInterceptor_1 = class AuditLogInterceptor {
    prisma;
    logger = new common_1.Logger(AuditLogInterceptor_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip, user } = request;
        const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        const startTime = Date.now();
        return next.handle().pipe((0, operators_1.tap)(async (responseData) => {
            if (!isMutation)
                return;
            const duration = Date.now() - startTime;
            const statusCode = context.switchToHttp().getResponse().statusCode;
            this.logger.log(`[AUDIT] User: ${user?.id || 'ANONYMOUS'} | ${method} ${url} | Status: ${statusCode} | ${duration}ms`);
            try {
                await this.prisma.auditLog.create({
                    data: {
                        userId: user?.id || null,
                        action: client_1.AuditAction.USER_UPDATED,
                        ipAddress: ip || request.headers['x-forwarded-for'] || '127.0.0.1',
                        metadata: {
                            method,
                            url,
                            statusCode,
                            payload: request.body ? JSON.stringify(request.body) : null,
                        },
                    },
                });
            }
            catch (error) {
                this.logger.error('Échec de la sauvegarde du log d\'audit', error);
            }
        }));
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = AuditLogInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map