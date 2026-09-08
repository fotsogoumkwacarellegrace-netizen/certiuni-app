"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PaymentProviderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProviderService = void 0;
const common_1 = require("@nestjs/common");
let PaymentProviderService = PaymentProviderService_1 = class PaymentProviderService {
    logger = new common_1.Logger(PaymentProviderService_1.name);
    async processPayment(params) {
        this.logger.log(`[PaymentGateway] Traitement du paiement ${params.amount} ${params.currency} via ${params.provider}`);
        const ref = `TXN-${params.provider}-${Date.now()}`;
        return {
            success: true,
            transactionRef: ref,
            status: 'SUCCESSFUL',
            message: 'Transaction traitée avec succès.',
        };
    }
};
exports.PaymentProviderService = PaymentProviderService;
exports.PaymentProviderService = PaymentProviderService = PaymentProviderService_1 = __decorate([
    (0, common_1.Injectable)()
], PaymentProviderService);
//# sourceMappingURL=payment-provider.service.js.map