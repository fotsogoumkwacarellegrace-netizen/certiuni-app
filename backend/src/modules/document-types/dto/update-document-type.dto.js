"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentTypeDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_document_type_dto_1 = require("./create-document-type.dto");
class UpdateDocumentTypeDto extends (0, swagger_1.PartialType)(create_document_type_dto_1.CreateDocumentTypeDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateDocumentTypeDto = UpdateDocumentTypeDto;
//# sourceMappingURL=update-document-type.dto.js.map