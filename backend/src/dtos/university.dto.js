"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUniversitySchema = exports.CreateUniversitySchema = void 0;
const openapi = require("@nestjs/swagger");
const zod_1 = require("zod");
exports.CreateUniversitySchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nom université requis'),
    acronym: zod_1.z.string().min(2, 'Acronyme requis'),
    officialEmailDomain: zod_1.z.string().email('Domaine email invalide'),
    logoUrl: zod_1.z.string().url('URL du logo invalide').optional(),
    website: zod_1.z.string().url('URL du site invalide').optional(),
});
exports.UpdateUniversitySchema = exports.CreateUniversitySchema.partial();
//# sourceMappingURL=university.dto.js.map