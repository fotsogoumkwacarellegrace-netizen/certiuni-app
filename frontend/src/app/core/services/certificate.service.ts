import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  VerifyCertificateResponse,
  GetWalletResponse,
  PaymentInitResponse,
  PaymentStatusResponse,
  MagicLinkResponse,
  BatchImportResponse,
  CyberRadarResponse,
} from '../../models/certificate.model';

/**
 * Service officiel d'accès à l'API CertiUni.
 *
 * Ce service écrit toujours comme s'il appelait la **vraie API REST**
 * (`environment.apiUrl`). En local, l'intercepteur `MockApiInterceptor`
 * (activé via `useMock`) court-circuite ces appels et renvoie les mocks.
 * Aucun changement à faire dans le code des composants pour passer du
 * mode simulation au mode production : il suffit de basculer `useMock`.
 */
@Injectable({ providedIn: 'root' })
export class CertificateService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Vérifie un diplôme via son hash SHA-256. */
  verifyCertificate(hash: string): Observable<VerifyCertificateResponse> {
    return this.http.get<VerifyCertificateResponse>(
      `${this.baseUrl}/certificates/verify/${hash}`
    );
  }

  /** Récupère le portefeuille académique de l'étudiant connecté. */
  getWallet(): Observable<GetWalletResponse> {
    return this.http.get<GetWalletResponse>(`${this.baseUrl}/student/wallet`);
  }

  /** Initialise un paiement Mobile Money. */
  initiatePayment(certificateHash: string, phoneNumber: string, paymentMethod: string): Observable<PaymentInitResponse> {
    return this.http.post<PaymentInitResponse>(`${this.baseUrl}/payments/initiate`, {
      certificateHash,
      phoneNumber,
      paymentMethod,
    });
  }

  /** Vérifie le statut d'une transaction de paiement. */
  getPaymentStatus(transactionId: string): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(
      `${this.baseUrl}/payments/status/${transactionId}`
    );
  }

  /** Demande un lien de connexion magique (magic link). */
  requestMagicLink(identifier: string): Observable<MagicLinkResponse> {
    return this.http.post<MagicLinkResponse>(`${this.baseUrl}/auth/magic-link`, {
      identifier,
    });
  }

  /** Importe un lot de diplômes (admin / MINESUP). */
  batchImport(file: File): Observable<BatchImportResponse> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<BatchImportResponse>(
      `${this.baseUrl}/admin/certificates/batch-import`,
      form
    );
  }

  /** Récupère les journaux du radar cyber ouest du réseau. */
  getCyberRadarLogs(): Observable<CyberRadarResponse> {
    return this.http.get<CyberRadarResponse>(`${this.baseUrl}/admin/cyber-radar/logs`);
  }
}
