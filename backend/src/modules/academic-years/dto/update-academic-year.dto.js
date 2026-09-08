"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAcademicYearDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_academic_year_dto_1 = require("./create-academic-year.dto");
class UpdateAcademicYearDto extends (0, swagger_1.PartialType)(create_academic_year_dto_1.CreateAcademicYearDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateAcademicYearDto = UpdateAcademicYearDto;
//# sourceMappingURL=update-academic-year.dto.js.map