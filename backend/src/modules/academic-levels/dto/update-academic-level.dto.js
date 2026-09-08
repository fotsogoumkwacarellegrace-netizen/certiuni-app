"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAcademicLevelDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_academic_level_dto_1 = require("./create-academic-level.dto");
class UpdateAcademicLevelDto extends (0, swagger_1.PartialType)(create_academic_level_dto_1.CreateAcademicLevelDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateAcademicLevelDto = UpdateAcademicLevelDto;
//# sourceMappingURL=update-academic-level.dto.js.map