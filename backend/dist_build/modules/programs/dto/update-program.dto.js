"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProgramDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_program_dto_1 = require("./create-program.dto");
class UpdateProgramDto extends (0, swagger_1.PartialType)(create_program_dto_1.CreateProgramDto) {
}
exports.UpdateProgramDto = UpdateProgramDto;
//# sourceMappingURL=update-program.dto.js.map