"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const security_controller_1 = require("../../controllers/security.controller");
const router = (0, express_1.Router)();
router.post('/report', security_controller_1.reportSuspiciousActivity);
router.get('/logs', security_controller_1.getSuspiciousLogs);
router.post('/block-ip', security_controller_1.blockIpAddress);
exports.default = router;
//# sourceMappingURL=security.router.js.map