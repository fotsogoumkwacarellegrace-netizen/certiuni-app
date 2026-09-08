"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const batch_controller_1 = require("../../controllers/batch.controller");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateJwt);
router.post('/batch-import', (0, role_middleware_1.authorizeRoles)('ISSUER', 'UNIV_ADMIN', 'SUPER_ADMIN'), upload_middleware_1.uploadBatchFile, batch_controller_1.importCertificatesBatch);
exports.default = router;
//# sourceMappingURL=batch.router.js.map