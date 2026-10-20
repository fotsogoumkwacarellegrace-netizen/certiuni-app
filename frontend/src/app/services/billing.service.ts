// src/app/core/services/billing.service.ts
import { Injectable, computed, signal } from '@angular/core';

export type PackId = 'unit' | 'pack10' | 'pack50';
export type LedgerKind = 'free' | 'credit' | 'purchase';

export interface CreditPack {
  id: PackId;
  credits: number;
  price: number; // FCFA
  featured?: boolean;
}

export interface LedgerEntry {
  id: string;
  at: string; // ISO
  kind: LedgerKind;
  label: string;
  delta: number; // + achat / − consommation
}

interface WalletState {
  month: string; // "YYYY-MM"
  freeUsed: number;
  credits: number;
  ledger: LedgerEntry[];
}

export const FREE_PER_MONTH = 3;
export const UNIT_PRICE = 500;

export const CREDIT_PACKS: readonly CreditPack[] = [
  { id: 'unit', credits: 1, price: 500 },
  { id: 'pack10', credits: 10, price: 4000, featured: true },
  { id: 'pack50', credits: 50, price: 17500 }
];

/** Seuls les verdicts « Valide » et « Révoqué » sont facturés. */
export function isBillable(status: string): boolean {
  return status === 'VALID' || status === 'REVOKED';
}

const SESSION_KEY = 'recruteur_user';
const WALLET_PREFIX = 'certiuni_wallet_v1:';
const LEDGER_LIMIT = 50;

@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly state = signal<WalletState>(this.load());

  readonly freeQuota = FREE_PER_MONTH;
  readonly unitPrice = UNIT_PRICE;
  readonly packs = CREDIT_PACKS;

  readonly freeUsed = computed(() => this.state().freeUsed);
  readonly freeRemaining = computed(() => Math.max(0, FREE_PER_MONTH - this.state().freeUsed));
  readonly credits = computed(() => this.state().credits);
  readonly available = computed(() => this.freeRemaining() + this.credits());
  readonly hasAllowance = computed(() => this.available() > 0);
  readonly ledger = computed(() => this.state().ledger);

  /** Date de renouvellement du quota gratuit (1er du mois suivant). */
  readonly nextReset = computed(() => {
    const [year, month] = this.state().month.split('-').map(Number);
    return new Date(year, month, 1);
  });

  // ============================================
  // LECTURE
  // ============================================
  /** À rappeler quand la session change (connexion / déconnexion). */
  reload(): void {
    this.state.set(this.load());
  }

  canAfford(count = 1): boolean {
    const s = this.rolled();
    return Math.max(0, FREE_PER_MONTH - s.freeUsed) + s.credits >= count;
  }

  recommendPack(missing: number): CreditPack {
    if (missing <= 1) return CREDIT_PACKS[0];
    if (missing <= 10) return CREDIT_PACKS[1];
    return CREDIT_PACKS[2];
  }

  getPack(id: string | null | undefined): CreditPack | null {
    return CREDIT_PACKS.find((p) => p.id === id) ?? null;
  }

  // ============================================
  // ÉCRITURE
  // ============================================
  /** Débite `count` vérifications : gratuites d'abord, puis crédits. */
  consume(count: number, label: string): boolean {
    if (count <= 0) return true;

    const s = this.rolled();
    const free = Math.min(count, Math.max(0, FREE_PER_MONTH - s.freeUsed));
    const paid = count - free;
    if (paid > s.credits) return false;

    const entries: LedgerEntry[] = [];
    if (free) entries.push(this.entry('free', label, -free));
    if (paid) entries.push(this.entry('credit', label, -paid));

    this.commit({
      ...s,
      freeUsed: s.freeUsed + free,
      credits: s.credits - paid,
      ledger: [...entries, ...s.ledger].slice(0, LEDGER_LIMIT)
    });
    return true;
  }

  /** Crédite le pack acheté (à appeler après confirmation du paiement). */
  purchase(packId: string): CreditPack | null {
    const pack = this.getPack(packId);
    if (!pack) return null;

    const s = this.rolled();
    this.commit({
      ...s,
      credits: s.credits + pack.credits,
      ledger: [this.entry('purchase', `Pack ${pack.credits}`, pack.credits), ...s.ledger].slice(0, LEDGER_LIMIT)
    });
    return pack;
  }

  // ============================================
  // INTERNE
  // ============================================
  private monthKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  private fresh(): WalletState {
    return { month: this.monthKey(), freeUsed: 0, credits: 0, ledger: [] };
  }

  /** État courant, avec remise à zéro du quota si le mois a changé. */
  private rolled(): WalletState {
    const s = this.state();
    const month = this.monthKey();
    return s.month === month ? s : { ...s, month, freeUsed: 0 };
  }

  private entry(kind: LedgerKind, label: string, delta: number): LedgerEntry {
    return { id: crypto.randomUUID(), at: new Date().toISOString(), kind, label, delta };
  }

  private commit(next: WalletState): void {
    this.state.set(next);
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify(next));
    } catch {
      /* stockage indisponible : on garde l'état en mémoire */
    }
  }

  private storageKey(): string {
    let id = 'guest';
    try {
      const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
      if (raw) id = (JSON.parse(raw) as { email?: string }).email ?? id;
    } catch {
      /* session illisible : portefeuille invité */
    }
    return `${WALLET_PREFIX}${id}`;
  }

  private load(): WalletState {
    const fresh = this.fresh();
    try {
      const raw = localStorage.getItem(this.storageKey());
      if (!raw) return fresh;
      const parsed = JSON.parse(raw) as WalletState;
      if (typeof parsed.credits !== 'number' || typeof parsed.freeUsed !== 'number') return fresh;
      return parsed.month === fresh.month ? parsed : { ...parsed, month: fresh.month, freeUsed: 0 };
    } catch {
      return fresh;
    }
  }
}