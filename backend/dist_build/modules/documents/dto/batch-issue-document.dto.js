"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchIssueDocumentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const issue_document_dto_1 = require("./issue-document.dto");
class BatchIssueDocumentDto {
    documents;
}
exports.BatchIssueDocumentDto = BatchIssueDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [issue_document_dto_1.IssueDocumentDto],
        description: "Liste des demandes d'émission de documents",
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'La liste doit contenir au moins un document à émettre.' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => issue_document_dto_1.IssueDocumentDto),
    __metadata("design:type", Array)
], BatchIssueDocumentDto.prototype, "documents", void 0);
//# sourceMappingURL=batch-issue-document.dto.js.map