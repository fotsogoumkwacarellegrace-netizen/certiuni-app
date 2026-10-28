// src/app/module1/credits/credits.ts
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BillingService, CreditPack, UNIT_PRICE } from '../../services/billing.service';
import { I18nService, Lang } from '../../services/i18n.service';

interface Copy {
  title: string;
  subtitle: string;
  rule: string;
  freeLabel: string;
  creditsLabel: string;
  totalLabel: string;
  resetOn: string;
  noExpiry: string;
  packsTitle: string;
  packsSubtitle: string;
  popular: string;
  unitName: string;
  perCheck: string;
  check: string;
  checks: string;
  momo: string;
  buy: string;
}

const COPY: Record<Lang, Copy> = {
  FR: {
    title: 'Crédits & forfaits',
    subtitle: 'Suivez votre consommation et rechargez vos vérifications en quelques secondes.',
    rule: 'Facturé uniquement si le verdict est Valide ou Révoqué',
    freeLabel: 'Vérifications gratuites',
    creditsLabel: 'Crédits prépayés',
    totalLabel: 'Disponible',
    resetOn: 'Renouvellement le',
    noExpiry: 'Sans abonnement, sans expiration',
    packsTitle: 'Recharger mes crédits',
    packsSubtitle: 'Plus le pack est grand, plus la vérification coûte moins cher.',
    popular: 'Populaire',
    unitName: 'À l’unité',
    perCheck: 'vérification',
    check: 'vérification',
    checks: 'vérifications',
    momo: 'MTN MoMo & Orange Money',
    buy: 'Acheter'
  },
  EN: {
    title: 'Credits & plans',
    subtitle: 'Track your usage and top up your verifications in seconds.',
    rule: 'Charged only when the verdict is Valid or Revoked',
    freeLabel: 'Free verifications',
    creditsLabel: 'Prepaid credits',
    totalLabel: 'Available',
    resetOn: 'Resets on',
    noExpiry: 'No subscription, no expiry',
    packsTitle: 'Top up my credits',
    packsSubtitle: 'The bigger the pack, the cheaper each verification.',
    popular: 'Popular',
    unitName: 'Single',
    perCheck: 'verification',
    check: 'verification',
    checks: 'verifications',
    momo: 'MTN MoMo & Orange Money',
    buy: 'Buy'
  }
};

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './credits.html',
  styleUrl: './credits.css'
})
export class Credits {
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  readonly billing = inject(BillingService);

  readonly c = computed(() => COPY[this.i18n.lang()]);

  readonly freePercent = computed(() => (this.billing.freeRemaining() / this.billing.freeQuota) * 100);

  readonly nextResetLabel = computed(() =>
    this.billing
      .nextReset()
      .toLocaleDateString(this.i18n.lang() === 'FR' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long' })
  );

  private readonly numberFormat = new Intl.NumberFormat('fr-FR');

  fmt(value: number): string {
    return this.numberFormat.format(value);
  }

  packName(pack: CreditPack): string {
    return pack.credits === 1 ? this.c().unitName : `Pack ${pack.credits}`;
  }

  perUnit(pack: CreditPack): number {
    return Math.round(pack.price / pack.credits);
  }

  savings(pack: CreditPack): number {
    return Math.round((1 - pack.price / (pack.credits * UNIT_PRICE)) * 100);
  }

  buy(pack: CreditPack): void {
    void this.router.navigate(['/public/momo-checkout'], {
      queryParams: { type: 'credits', pack: pack.id, amount: pack.price, returnUrl: '/public/credits' }
    });
  }
}