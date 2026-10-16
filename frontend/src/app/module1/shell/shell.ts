// src/app/module1/shell/shell.ts
import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import { DarkModeService } from '../../services/dark-mode';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { MockDataService } from '../../core/services/mock-data.service';
import { I18nService, Lang } from '../../services/i18n.service';
import { FlagIcon } from '../../shared/flag-icon/flag-icon';

import { BillingService } from '../../services/billing.service';
type MenuName = 'lang' | 'notif' | 'user';

interface NavItem {
  key: string;
  labelKey: string;
  icon: string;
  route?: string;
  match: string[];
  badge?: boolean;
}

interface Notif {
  id: number;
  tone: 'ok' | 'danger' | 'info';
  icon: string;
  text: Record<Lang, string>;
  time: Record<Lang, string>;
}

const MAIN_NAV: NavItem[] = [
  { key: 'accueil', labelKey: 'accueil', icon: 'home', route: '/public/accueil', match: ['accueil'] },
  { key: 'scan', labelKey: 'scan', icon: 'qr_code_scanner', route: '/public/camera-scan', match: ['camera-scan'] },
  { key: 'ocr', labelKey: 'ocr', icon: 'document_scanner', route: '/public/ocr-scan', match: ['ocr-scan'] },
  { key: 'lot', labelKey: 'lot', icon: 'checklist_rtl', route: '/public/bulk-upload', match: ['bulk-upload', 'bulk-table'] }
];

const ACCOUNT_NAV: NavItem[] = [
  { key: 'credits', labelKey: 'credits', icon: 'account_balance_wallet', route: '/public/credits', match: ['credits'] },
  { key: 'history', labelKey: 'history', icon: 'history', match: [], badge: true },
  { key: 'settings', labelKey: 'settings', icon: 'settings', route: '/public/settings', match: ['settings'] }
];

const PAGES: Record<string, { section: string; title: string }> = {
  accueil: { section: 'navVerification', title: 'accueil' },
  scan: { section: 'navVerification', title: 'scan' },
  ocr: { section: 'navVerification', title: 'ocr' },
  lot: { section: 'navVerification', title: 'lot' },
  settings: { section: 'navSpace', title: 'settings' }
};

const INITIAL_NOTIFS: Notif[] = [
  {
    id: 1,
    tone: 'ok',
    icon: 'verified',
    text: { FR: 'Diplôme de Marie Ngo vérifié avec succès', EN: "Marie Ngo's diploma successfully verified" },
    time: { FR: 'il y a 2 min', EN: '2 min ago' }
  },
  {
    id: 2,
    tone: 'danger',
    icon: 'block',
    text: { FR: 'Un diplôme révoqué a été détecté dans votre lot', EN: 'A revoked diploma was detected in your batch' },
    time: { FR: 'il y a 14 min', EN: '14 min ago' }
  },
  {
    id: 3,
    tone: 'info',
    icon: 'table_chart',
    text: { FR: 'Rapport de vérification en masse prêt à exporter', EN: 'Bulk verification report ready to export' },
    time: { FR: 'il y a 1 h', EN: '1 h ago' }
  }
];

const SESSION_KEY = 'recruteur_user';
const COLLAPSE_KEY = 'certiuni_sidebar_collapsed';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, DarkModeDirective,FlagIcon],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})
export class Shell {
  private readonly router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);
  private readonly mockService = inject(MockDataService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private toastTimer?: number;

  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly mainNav = MAIN_NAV;
  readonly accountNav = ACCOUNT_NAV;
  readonly billing = inject(BillingService);

    /** Part de vérifications gratuites restantes (jauge de la sidebar) */
  readonly freePercent = computed(
    () => (this.billing.freeRemaining() / this.billing.freeQuota) * 100
  );
  // ===== État UI =====
  readonly collapsed = signal(localStorage.getItem(COLLAPSE_KEY) === '1');
  readonly mobileOpen = signal(false);
  readonly toast = signal('');
  readonly openMenu = signal<MenuName | null>(null);

  // ===== Langue (déléguée au service) =====
  readonly lang = this.i18n.lang;

  // ===== Recherche rapide =====
  readonly query = signal('');
  readonly searching = signal(false);

  // ===== Notifications =====
  readonly notifs = signal<Notif[]>(INITIAL_NOTIFS);
  readonly readIds = signal<number[]>([]);
  readonly unreadCount = computed(
    () => this.notifs().filter((n) => !this.readIds().includes(n.id)).length
  );

  readonly isDarkMode = toSignal(this.darkModeService.getDarkModeObservable(), {
    initialValue: this.darkModeService.isDarkMode$
  });

  // ===== Route courante =====
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly activeKey = computed(() => {
    const segment = this.url().split(/[?#]/)[0].split('/')[2] ?? '';
    const all = [...MAIN_NAV, ...ACCOUNT_NAV];
    return all.find((item) => item.match.includes(segment))?.key ?? '';
  });

  readonly page = computed(() => {
    const p = PAGES[this.activeKey()];
    return p
      ? { section: this.t(p.section), title: this.t(p.title) }
      : { section: this.t('portal'), title: 'CertiUni' };
  });

  // ===== Utilisateur (session locale) =====
  readonly user = computed(() => {
    this.url();
    return this.readSession();
  });
  readonly displayName = computed(() => this.user()?.name ?? this.t('guest'));
  readonly userEmail = computed(() => this.user()?.email ?? '');
  readonly initials = computed(() => {
    const parts = this.displayName().trim().split(/\s+/);
    return ((parts[0]?.[0] ?? 'I') + (parts[1]?.[0] ?? '')).toUpperCase();
  });

  constructor() {
    // À chaque changement de route : ferme les menus et recharge le solde
    effect(() => {
      this.url();
      this.mobileOpen.set(false);
      this.openMenu.set(null);
      this.billing.reload();
    });

    // Bloque le scroll de fond quand le tiroir mobile est ouvert
    effect(() => {
      document.body.style.overflow = this.mobileOpen() ? 'hidden' : '';
    });

    this.destroyRef.onDestroy(() => {
      document.body.style.overflow = '';
      window.clearTimeout(this.toastTimer);
    });
  }

  // ============================================
  // TRADUCTION
  // ============================================
  t(key: string): string {
    return this.i18n.t(key);
  }

  setLang(l: Lang): void {
    this.i18n.setLang(l);
    this.openMenu.set(null);
    this.showToast(this.t('langChanged'));
  }

  // ============================================
  // SIDEBAR
  // ============================================
  toggleCollapse(): void {
    this.collapsed.update((v) => !v);
    localStorage.setItem(COLLAPSE_KEY, this.collapsed() ? '1' : '0');
  }

  openMobile(): void {
    this.mobileOpen.set(true);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  // ============================================
  // MENUS DÉROULANTS (topbar)
  // ============================================
  toggleMenu(name: MenuName, event: Event): void {
    event.stopPropagation();
    this.openMenu.update((current) => (current === name ? null : name));
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenu.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMobile();
    this.openMenu.set(null);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchInput()?.nativeElement.focus();
    }
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================
  isUnread(id: number): boolean {
    return !this.readIds().includes(id);
  }

  markRead(id: number): void {
    if (this.isUnread(id)) this.readIds.update((ids) => [...ids, id]);
  }

  markAllRead(): void {
    this.readIds.set(this.notifs().map((n) => n.id));
  }

  // ============================================
  // RECHERCHE RAPIDE
  // ============================================
  onQueryInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  submitSearch(): void {
    const q = this.query().trim();
    if (!q || this.searching()) return;

    this.searching.set(true);
    this.mockService.verifyCertificate(q).subscribe({
      next: (result) => {
        this.searching.set(false);
        this.query.set('');
        this.searchInput()?.nativeElement.blur();
        if (result.status === 'VALID') this.router.navigate(['/public/verify', q]);
        else if (result.status === 'REVOKED') this.router.navigate(['/public/verify/revoked', q]);
        else this.router.navigate(['/public/verify/unknown', q]);
      },
      error: () => {
        this.searching.set(false);
        this.router.navigate(['/public/verify/unknown', q]);
      }
    });
  }

  // ============================================
  // ACTIONS
  // ============================================
  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  comingSoon(labelKey: string): void {
    this.closeMobile();
    this.openMenu.set(null);
    this.showToast(`${this.t(labelKey)} : ${this.t('soonMsg')}`);
  }

  goTo(route: string): void {
    this.openMenu.set(null);
    this.router.navigate([route]);
  }

  logout(): void {
    this.openMenu.set(null);
    if (!this.user()) {
      this.router.navigate(['/public/login']);
      return;
    }
    localStorage.removeItem('recruteur_user');
    localStorage.removeItem('recruteur_remember');
    sessionStorage.clear();
    this.showToast(this.t('loggedOut'));
    this.router.navigate(['/public/landing']);
  }

  private showToast(message: string): void {
    this.toast.set(message);
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toast.set(''), 2600);
  }

  private readSession(): { name: string; email: string } | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as { name: string; email: string }) : null;
    } catch {
      return null;
    }
  }
}