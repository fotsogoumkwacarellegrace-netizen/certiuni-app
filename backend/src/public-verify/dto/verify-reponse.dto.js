"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyCertificateResponseDto = void 0;
const openapi = require("@nestjs/swagger");
class VerifyCertificateResponseDto {
    isValid;
    publicIdentifier;
    studentName;
    degreeTitle;
    fieldOfStudy;
    grade;
    issueDate;
    status;
    canonicalHash;
    university;
    revocationReason;
    static _OPENAPI_METADATA_FACTORY() {
        return { isValid: { required: true, type: () => Boolean }, publicIdentifier: { required: true, type: () => String }, studentName: { required: true, type: () => String }, degreeTitle: { required: true, type: () => String }, fieldOfStudy: { required: true, type: () => String }, grade: { required: true, type: () => String, nullable: true }, issueDate: { required: true, type: () => Date }, status: { required: true, type: () => Object }, canonicalHash: { required: true, type: () => String }, university: { required: true, type: () => ({ name: { required: true, type: () => String }, code: { required: true, type: () => String }, logoUrl: { required: false, type: () => String } }) }, revocationReason: { required: false, type: () => String } };
    }
}
exports.VerifyCertificateResponseDto = VerifyCertificateResponseDto;
//# sourceMappingURL=verify-reponse.dto.js.map