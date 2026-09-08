"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchUploadSchema = void 0;
const openapi = require("@nestjs/swagger");
const zod_1 = require("zod");
exports.BatchUploadSchema = zod_1.z.object({
    universityId: zod_1.z.string().uuid('ID université invalide'),
    fileName: zod_1.z.string(),
});
//# sourceMappingURL=batchUpload.dto.js.map