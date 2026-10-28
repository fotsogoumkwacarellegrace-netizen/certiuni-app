// src/app/core/services/verification-gate.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MockDataService, VerificationResult } from '../core/services/mock-data.service';
import { BillingService, isBillable } from './billing.service';

export type GateOutcome = 'done' | 'blocked' | 'empty';

const STATUS_LABEL: Record<VerificationResult['status'], string> = {
  VALID: 'Valide',
  REVOKED: 'Révoqué',
  NOT_FOUND: 'Introuvable'
};

/**
 * Point d'entrée unique pour toute vérification unitaire :
 * contrôle du solde → vérification → débit (verdict facturable uniquement) → navigation.
 */
@Injectable({ providedIn: 'root' })
export class VerificationGateService {
  private readonly router = inject(Router);
  private readonly mock = inject(MockDataService);
  private readonly billing = inject(BillingService);

  /** Vérifie qu'il reste au moins `needed` vérifications ; sinon redirige vers le paiement. */
  ensureAllowance(needed = 1): boolean {
    if (this.billing.canAfford(needed)) return true;
    this.goToCheckout(needed - this.billing.available());
    return false;
  }

  /** Redirige vers momo-checkout avec le pack le mieux adapté. */
  goToCheckout(missing = 1): void {
    const pack = this.billing.recommendPack(missing);
    const returnUrl = this.router.url;

    try {
      localStorage.setItem('returnUrl', returnUrl);
    } catch {
      /* non bloquant */
    }

    void this.router.navigate(['/public/momo-checkout'], {
      queryParams: {
        type: 'credits',
        pack: pack.id,
        amount: pack.price,
        reason: 'no-allowance',
        returnUrl
      }
    });
  }

  async verifyAndRoute(rawId: string): Promise<GateOutcome> {
    const id = rawId.trim();
    if (!id) return 'empty';
    if (!this.ensureAllowance(1)) return 'blocked';

    let result: VerificationResult;
    try {
      result = await firstValueFrom(this.mock.verifyCertificate(id));
    } catch {
      // Erreur technique : jamais de débit
      await this.router.navigate(['/public/verify/unknown', id]);
      return 'done';
    }

    if (isBillable(result.status)) {
      this.billing.consume(1, `Vérification · ${STATUS_LABEL[result.status]}`);
    }

    switch (result.status) {
      case 'VALID':
        await this.router.navigate(['/public/verify', id]);
        break;
      case 'REVOKED':
        await this.router.navigate(['/public/verify/revoked', id]);
        break;
      default:
        await this.router.navigate(['/public/verify/unknown', id]);
    }
    return 'done';
  }
}