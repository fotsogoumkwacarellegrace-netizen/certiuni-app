// src/app/module1/momo-checkout/momo-checkout.ts
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { MockDataService } from '../../core/services/mock-data.service';
import { BillingService, CreditPack } from '../../services/billing.service';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { BackButton } from '../../shared/ui/back-button';

type Operator = 'mtn' | 'orange';
type Step = 'form' | 'pending' | 'success';
type Mode = 'credits' | 'manual';

interface Receipt {
  reference: string;
  label: string;
  amount: number;
  operator: Operator;
  phone: string;
  paidAt: Date;
  credited: number | null;
  balance: number | null;
}

const MANUAL_AMOUNT = 2000;
const PENDING_SECONDS = 60;
/** Simulation : délai avant que « l'utilisateur » valide sur son téléphone. */
const SIMULATED_APPROVAL_MS = 1500;
const SAFE_RETURN_PREFIX = '/public/';
const OPERATOR_LABEL: Record<Operator, string> = { mtn: 'MTN MoMo', orange: 'Orange Money' };

@Component({
  selector: 'app-momo-checkout',
  standalone: true,
  imports: [DatePipe, DarkModeDirective, BackButton],
  templateUrl: './momo-checkout.html',
  styleUrl: './momo-checkout.css'
})
export class MomoCheckout implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly mock = inject(MockDataService);
  private readonly destroyRef = inject(DestroyRef);
  readonly billing = inject(BillingService);

  // ===== Contexte de la commande =====
  readonly mode = signal<Mode>('manual');
  readonly pack = signal<CreditPack | null>(null);
  readonly reason = signal<string | null>(null);
  readonly returnUrl = signal('/public/accueil');
  readonly orderRef = 'VER-' + Date.now().toString().slice(-8);

  // ===== Formulaire =====
  readonly operator = signal<Operator | null>(null);
  readonly phone = signal('');
  readonly step = signal<Step>('form');
  readonly error = signal('');
  readonly countdown = signal(PENDING_SECONDS);
  readonly receipt = signal<Receipt | null>(null);

  readonly amount = computed(() => (this.mode() === 'credits' && this.pack() ? this.pack()!.price : MANUAL_AMOUNT));
  readonly title = computed(() =>
    this.mode() === 'credits' ? 'Recharge de crédits de vérification' : 'Vérification manuelle d’un diplôme'
  );
  readonly phoneValid = computed(() => /^6\d{8}$/.test(this.phone()));
  readonly phoneDisplay = computed(() => this.formatPhone(this.phone()));
  readonly maskedPhone = computed(() => {
    const p = this.phone();
    return p.length === 9 ? `+237 6•• ••• •${p.slice(-2)}` : '+237';
  });

  private readonly numberFormat = new Intl.NumberFormat('fr-FR');
  private tick?: ReturnType<typeof setInterval>;
  private approval?: ReturnType<typeof setTimeout>;
  /** Invalide les réponses tardives d'une tentative annulée. */
  private attempt = 0;

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTimers());
  }

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;

    // Le montant n'est jamais lu dans l'URL : il est dérivé du pack.
    const pack = q.get('type') === 'credits' ? this.billing.getPack(q.get('pack')) : null;
    if (pack) {
      this.mode.set('credits');
      this.pack.set(pack);
    }

    this.reason.set(q.get('reason'));
    this.returnUrl.set(this.resolveReturnUrl(q.get('returnUrl')));
  }

  // ============================================
  // AFFICHAGE
  // ============================================
  fmt(value: number): string {
    return this.numberFormat.format(value);
  }

  packName(pack: CreditPack): string {
    return pack.credits === 1 ? 'À l’unité' : `Pack ${pack.credits}`;
  }

  perUnit(pack: CreditPack): number {
    return Math.round(pack.price / pack.credits);
  }

  operatorLabel(op: Operator): string {
    return OPERATOR_LABEL[op];
  }

  // ============================================
  // SAISIE
  // ============================================
  selectPack(pack: CreditPack): void {
    if (this.step() === 'form') this.pack.set(pack);
  }

  selectOperator(op: Operator): void {
    this.operator.set(op);
    this.error.set('');
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '');
    if (digits.startsWith('237')) digits = digits.slice(3);
    digits = digits.slice(0, 9);

    this.phone.set(digits);
    input.value = this.formatPhone(digits);
    this.error.set('');
  }

  // ============================================
  // PAIEMENT
  // ============================================
  async pay(): Promise<void> {
    if (this.step() !== 'form') return;

    if (!this.operator()) {
      this.error.set('Choisissez votre opérateur Mobile Money.');
      return;
    }
    if (!this.phoneValid()) {
      this.error.set('Saisissez un numéro camerounais valide : 9 chiffres commençant par 6.');
      return;
    }

    const attempt = ++this.attempt;
    this.error.set('');
    this.step.set('pending');
    this.startCountdown();

    try {
      const res = await firstValueFrom(this.mock.processMobileMoneyPayment(this.phone(), this.amount()));
      if (attempt !== this.attempt) return; // annulé entre-temps
      if (!res.success) throw new Error(res.message);

      // Simulation de la validation sur le téléphone de l'utilisateur
      this.approval = setTimeout(() => this.complete(attempt, res.reference), SIMULATED_APPROVAL_MS);
    } catch {
      if (attempt === this.attempt) this.fail('La demande de paiement n’a pas pu être envoyée. Réessayez.');
    }
  }

  cancelPending(): void {
    this.attempt++;
    this.clearTimers();
    this.step.set('form');
  }

  private complete(attempt: number, reference: string): void {
    if (attempt !== this.attempt || this.step() !== 'pending') return;
    this.clearTimers();

    const pack = this.pack();
    let credited: number | null = null;
    let balance: number | null = null;

    // Les crédits ne sont ajoutés qu'ici, une seule fois, après confirmation
    if (this.mode() === 'credits' && pack && this.billing.purchase(pack.id)) {
      credited = pack.credits;
      balance = this.billing.credits();
    }

    this.receipt.set({
      reference,
      label: this.mode() === 'credits' && pack ? this.packName(pack) : 'Vérification manuelle',
      amount: this.amount(),
      operator: this.operator()!,
      phone: this.maskedPhone(),
      paidAt: new Date(),
      credited,
      balance
    });
    this.step.set('success');
  }

  private fail(message: string): void {
    this.clearTimers();
    this.step.set('form');
    this.error.set(message);
  }

  private startCountdown(): void {
    this.clearTimers();
    this.countdown.set(PENDING_SECONDS);
    this.tick = setInterval(() => {
      const left = this.countdown() - 1;
      if (left <= 0) {
        this.attempt++;
        this.fail('Le délai de validation a expiré. Aucun montant n’a été débité, vous pouvez réessayer.');
      } else {
        this.countdown.set(left);
      }
    }, 1000);
  }

  private clearTimers(): void {
    if (this.tick) clearInterval(this.tick);
    if (this.approval) clearTimeout(this.approval);
    this.tick = undefined;
    this.approval = undefined;
  }

  // ============================================
  // NAVIGATION
  // ============================================
  goBack(): void {
    void this.router.navigateByUrl(this.returnUrl());
  }

  goCredits(): void {
    void this.router.navigate(['/public/credits']);
  }

  goHome(): void {
    void this.router.navigate(['/public/accueil']);
  }

  // ============================================
  // UTILITAIRES
  // ============================================
  private formatPhone(digits: string): string {
    return [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 7), digits.slice(7, 9)]
      .filter(Boolean)
      .join(' ');
  }

  /** Ordre : paramètre d'URL, état de navigation, localStorage ; seules les routes internes sont acceptées. */
  private resolveReturnUrl(fromQuery: string | null): string {
    const fromState = (history.state as { returnUrl?: string } | null)?.returnUrl ?? null;

    let fromStorage: string | null = null;
    try {
      fromStorage = localStorage.getItem('returnUrl');
      localStorage.removeItem('returnUrl');
    } catch {
      /* non bloquant */
    }

    const safe = [fromQuery, fromState, fromStorage].find(
      (u): u is string => !!u && u.startsWith(SAFE_RETURN_PREFIX)
    );
    return safe ?? (this.mode() === 'credits' ? '/public/credits' : '/public/accueil');
  }
}