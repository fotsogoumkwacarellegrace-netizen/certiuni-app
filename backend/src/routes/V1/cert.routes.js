"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cert_controller_1 = require("../../controllers/cert.controller");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const certificate_dto_1 = require("../../dtos/certificate.dto");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateJwt);
router.post('/', (0, role_middleware_1.authorizeRoles)('ISSUER', 'UNIV_ADMIN', 'SUPER_ADMIN'), (0, validate_middleware_1.validateRequest)(certificate_dto_1.IssueCertificateSchema), cert_controller_1.issueCertificate);
router.get('/:id', (0, role_middleware_1.authorizeRoles)('ISSUER', 'UNIV_ADMIN', 'SUPER_ADMIN', 'VERIFIER'), cert_controller_1.getCertificateById);
router.post('/:id/revoke', (0, role_middleware_1.authorizeRoles)('UNIV_ADMIN', 'SUPER_ADMIN'), (0, validate_middleware_1.validateRequest)(certificate_dto_1.RevokeCertificateSchema), cert_controller_1.revokeCertificate);
exports.default = router;
//# sourceMappingURL=cert.routes.js.map