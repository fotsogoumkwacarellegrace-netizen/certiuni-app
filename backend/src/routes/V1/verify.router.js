"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_controller_1 = require("../../controllers/verify.controller");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const rateLimit_middleware_1 = require("../../middlewares/rateLimit.middleware");
const certificate_dto_1 = require("../../dtos/certificate.dto");
const router = (0, express_1.Router)();
const verifyRateLimiter = (0, rateLimit_middleware_1.createRateLimiter)({
    windowInSeconds: 60,
    maxRequests: 30,
});
router.get('/', verifyRateLimiter, (0, validate_middleware_1.validateRequest)(certificate_dto_1.VerifyCertificateQuerySchema), verify_controller_1.verifyCertificate);
exports.default = router;
//# sourceMappingURL=verify.router.js.map