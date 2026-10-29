/**
 * CreateCertificateDto — interface TypeScript.
 * Aligné sur le modèle Prisma `Certificate` (schema.prisma) :
 *   universityId, studentId, degreeType, fieldOfStudy, issueDate, pdfS3Key.
 * La validation est effectuée manuellement dans le handler de route.
 */
export interface CreateCertificateDto {
  universityId: string;
  studentId: string;
  degreeType: string; // Ex: "MASTER", "LICENCE"
  fieldOfStudy: string; // Ex: "Génie Logiciel"
  issueDate: string; // ISO YYYY-MM-DD
  pdfS3Key?: string;
}
