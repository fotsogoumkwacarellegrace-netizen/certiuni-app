export interface VerifyCertificateResponse {
  valid: boolean;
  hash: string;
  studentName?: string;
  university?: string;
  program?: string;
  issueDate?: string;
}

export interface GetWalletResponse {
  certificates: any[];
}

export interface PaymentInitResponse {
  transactionId: string;
  status: string;
}

export interface PaymentStatusResponse {
  transactionId: string;
  status: string;
}

export interface MagicLinkResponse {
  success: boolean;
  message: string;
}

export interface BatchImportResponse {
  success: boolean;
  imported: number;
  failed: number;
}

export interface CyberRadarResponse {
  logs: any[];
}
