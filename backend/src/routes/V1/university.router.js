"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const university_controller_1 = require("../../controllers/university.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateJwt);
router.get('/dashboard', university_controller_1.getDashboard);
router.get('/:id', university_controller_1.getUniversityById);
router.patch('/:id', university_controller_1.updateUniversity);
router.get('/:id/audit-logs', university_controller_1.getAuditLogs);
exports.default = router;
//# sourceMappingURL=university.router.js.map