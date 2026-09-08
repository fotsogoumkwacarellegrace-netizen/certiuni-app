"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const payment_controller_1 = require("../../controllers/payment.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateJwt);
router.post('/process', payment_controller_1.processPayment);
router.get('/history', payment_controller_1.getPaymentHistory);
router.get('/receipt/:transactionRef', payment_controller_1.getPaymentReceipt);
exports.default = router;
//# sourceMappingURL=payment.router.js.map