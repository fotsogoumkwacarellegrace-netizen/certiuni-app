"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_document_type_dto_1 = require("./create-document-type.dto");
class UpdateDocumentTypeDto extends (0, swagger_1.PartialType)(create_document_type_dto_1.CreateDocumentTypeDto) {
}
exports.UpdateDocumentTypeDto = UpdateDocumentTypeDto;
//# sourceMappingURL=update-document-type.dto.js.map