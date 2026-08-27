import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Intercepteur qui, **en mode mock** (`environment.useMock === true`),
 * court-circuite les appels réseau vers le backend et renvoie les
 * réponses simulées présentes dans `assets/mocks/api-example.json`.
 *
 * En production (`useMock === false`), il laisse passer les requêtes
 * vers le véritable backend REST sans aucune altération.
 *
 * Le JSON est chargé une seule fois (mis en cache) afin d'éviter des
 * fetches répétés et une latence superflue entre les requêtes.
 *
 * Adapté à la vraie structure du fichier `api-example.json` du projet
 * (et non au squelette fourni dans le brief, dont les chemins d'accès
 * `verifyCertificateDataset.cases` / `getAcademicWalletProfiles.mockWallets`
 * n'existent pas dans les données réelles).
 */
@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  private mockCache: Record<string, any> | null = null;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si le mode simulation est désactivé, on transmet la requête au vrai backend.
    if (!environment.useMock) {
      return next.handle(req);
    }

    const url = req.url;

    // --- GET /api/v1/certificates/verify/:hash ---
    if (req.method === 'GET' && url.includes('/api/v1/certificates/verify/')) {
      const hash = url.split('/').pop() ?? '';
      return this.handleVerifyCertificate(hash);
    }

    // --- GET /api/v1/student/wallet ---
    if (req.method === 'GET' && url.includes('/api/v1/student/wallet')) {
      return this.handleWallet();
    }

    // --- POST /api/v1/payments/initiate ---
    if (req.method === 'POST' && url.includes('/api/v1/payments/initiate')) {
      return this.handleInitiatePayment();
    }

    // --- GET /api/v1/payments/status/:transactionId ---
    if (req.method === 'GET' && url.includes('/api/v1/payments/status/')) {
      return this.handlePaymentStatus();
    }

    // --- POST /api/v1/auth/magic-link ---
    if (req.method === 'POST' && url.includes('/api/v1/auth/magic-link')) {
      return this.handleMagicLink();
    }

    // --- POST /api/v1/admin/certificates/batch-import ---
    if (req.method === 'POST' && url.includes('/api/v1/admin/certificates/batch-import')) {
      return this.handleBatchImport();
    }

    // --- GET /api/v1/admin/cyber-radar/logs ---
    if (req.method === 'GET' && url.includes('/api/v1/admin/cyber-radar/logs')) {
      return this.handleCyberRadar();
    }

    // Toute autre route : laisser passer vers le backend réel.
    return next.handle(req);
  }

  /** Charge (une seule fois) le fichier de mocks JSON. */
  private loadMockData(): Observable<any> {
    if (this.mockCache) {
      return of(this.mockCache);
    }
    return of(null).pipe(
      mergeMap(() => fetch('assets/mocks/api-example.json').then((res) => res.json())),
      mergeMap((json: any) => {
        this.mockCache = json;
        return of(json);
      })
    );
  }

  private httpResponse<T>(body: T, status = 200): Observable<HttpEvent<T>> {
    return of(new HttpResponse<T>({ status, body }));
  }

  private handleVerifyCertificate(hash: string): Observable<HttpEvent<any>> {
    return this.loadMockData().pipe(
      delay(500), // simulation latence réseau
      mergeMap((json) => {
        const verify = json.modulePublic.verifyCertificate;
        const data = verify?.response200?.data;
        const matches = data?.security?.hashSHA256 === hash;

        if (matches) {
          const body = {
            success: true,
            message: 'Diplôme vérifié avec succès',
            data: {
              status: data.status,
              certificate: data.certificate,
              security: data.security,
            },
          };
          return this.httpResponse(body, 200);
        }

        // Hash inconnu → 404 conforme au standard du backend
        const body = {
          success: false,
          error: {
            code: 'CERTIFICATE_NOT_FOUND',
            message: 'Aucun diplôme ne correspond au hash fourni.',
            details: null,
          },
        };
        return this.httpResponse(body, 404);
      })
    );
  }

  private handleWallet(): Observable<HttpEvent<any>> {
    return this.loadMockData().pipe(
      delay(300),
      mergeMap((json) => {
        const body = json.moduleStudent.getAcademicWallet.response200;
        return this.httpResponse(body, 200);
      })
    );
  }

  private handleInitiatePayment(): Observable<HttpEvent<any>> {
    return this.loadMockData().pipe(
      delay(400),
      mergeMap((json) =>
        this.httpResponse(json.modulePublic.initiatePayment.response200, 200)
      )
    );
  }

  private handlePaymentStatus(): Observable<HttpEvent<any>> {
    return this.loadMockData().pipe(
      delay(300),
      mergeMap((json) =>
        this.httpResponse(json.modulePublic.checkPaymentStatus.response200, 200)
      )
    );
  }

  private handleMagicLink(): Observable<HttpEvent<any>> {
    return this.loadMockData().pipe(
      delay(400),
      mergeMap((json) =>
        this.httpResponse(json.moduleStudent.requestMagicLink.response200, 200)
      )
    );
  }

  private handleBatchImport(): Observable<HttpEvent<any>> {
    return this.loadMockData().pipe(
      delay(600),
      mergeMap((json) =>
        this.httpResponse(json.moduleAdminMinesup.batchImportCertificates.response202, 202)
      )
    );
  }

  private handleCyberRadar(): Observable<HttpEvent<any>> {
    return this.loadMockData().pipe(
      delay(350),
      mergeMap((json) =>
        this.httpResponse(json.moduleAdminMinesup.getCyberRadarLogs.response200, 200)
      )
    );
  }
}
