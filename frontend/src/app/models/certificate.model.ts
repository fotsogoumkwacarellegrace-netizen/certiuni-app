/**
 * Modèles de domaine partagés par le service CertificateService et l'intercepteur mock.
 * Ils reflètent la structure standardisée par le backend (cf. assets/mocks/api-example.json).
 */

// --- Réponse générique (succès / erreur) ---

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// --- Module public : vérification de diplôme ---

export type CertificateStatus = 'VALID' | 'INVALID' | 'REVOKED' | 'SUSPICIOUS';

export interface University {
  id: string;
  name: string;
  logoUrl: string;
}

export interface CertificateDetails {
  certificateNumber: string;
  studentName: string;
  degreeTitle: string;
  speciality: string;
  mention: string;
  graduationYear: number;
  issueDate: string;
  university: University;
}

export interface SecurityInfo {
  hashSHA256: string;
  verificationCount: number;
}

export interface VerifyCertificateData {
  status: CertificateStatus;
  certificate: CertificateDetails;
  security: SecurityInfo;
}

export type VerifyCertificateResponse = ApiResponse<VerifyCertificateData>;

// --- Module étudiant : portefeuille académique ---

export interface StudentProfile {
  matricule: string;
  fullName: string;
  email: string;
}

export interface StudentCertificate {
  id: string;
  degreeTitle: string;
  universityName: string;
  issueYear: number;
  qrCodeUrl: string;
  downloadUrl: string;
}

export interface WalletData {
  studentProfile: StudentProfile;
  certificates: StudentCertificate[];
}

export type GetWalletResponse = ApiResponse<WalletData>;

// --- Paiements / authentification ---

export interface PaymentInitData {
  transactionId: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  amount: number;
  currency: string;
}

export type PaymentInitResponse = ApiResponse<PaymentInitData>;

export interface PaymentStatusData {
  transactionId: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  downloadToken: string;
}

export type PaymentStatusResponse = ApiResponse<PaymentStatusData>;

export interface MagicLinkData {
  // La réponse magic-link n'embarque pas de data supplémentaire dans le mock.
  [key: string]: unknown;
}

export type MagicLinkResponse = ApiResponse<MagicLinkData>;

// --- Administration (MINESUP) ---

export interface BatchImportData {
  jobId: string;
  totalRows: number;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

export type BatchImportResponse = ApiSuccessResponse<BatchImportData>;

export interface CyberRadarLog {
  id: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  action: string;
  status: CertificateStatus;
  reason: string;
  certificateTargeted: string;
}

export interface CyberRadarData {
  anomaliesCount24h: number;
  logs: CyberRadarLog[];
}

export type CyberRadarResponse = ApiResponse<CyberRadarData>;