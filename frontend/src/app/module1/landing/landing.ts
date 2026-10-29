// src/app/module1/landing/landing.ts
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  NgZone,
  computed,
  inject,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DarkModeService } from '../../services/dark-mode';
import { I18nService, Lang } from '../../services/i18n.service';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { ScrollToTopDirective } from '../../directives/scroll-to-top';
import { RevealDirective } from '../../directives/reveal.directive';
import { FlagIcon } from '../../shared/flag-icon/flag-icon';
import {
  AUDIT_EVENTS,
  AUDIT_LINES,
  CTA_POINTS,
  FAQ_ITEMS,
  FEATURES,
  FOOTER_COLUMNS,
  FREE_MONTHLY,
  FooterLink,
  HERO_TRUST,
  IMPORT_CHECKLIST,
  IMPORT_STEPS,
  INSPECTOR_ROWS,
  NAV_ITEMS,
  PRICING_PLANS,
  PricingPlan,
  RECRUITER_PACKS,
  RecruiterPack,
  SECURITY_LINES
} from './landing.data';

/** Largeur à partir de laquelle le menu burger disparaît (à garder synchronisée avec le CSS : 1180px). */
const DESKTOP_NAV_MIN_WIDTH = 1181;

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule, DarkModeDirective, ScrollToTopDirective, RevealDirective, FlagIcon],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  
  // ===== Données de la page =====
  readonly recruiterPacks = RECRUITER_PACKS;
  readonly freeMonthly = FREE_MONTHLY;
  readonly navItems = NAV_ITEMS;
  readonly heroTrust = HERO_TRUST;
  readonly features = FEATURES;
  readonly importChecklist = IMPORT_CHECKLIST;
  readonly importSteps = IMPORT_STEPS;
  readonly securityLines = SECURITY_LINES;
  readonly inspectorRows = INSPECTOR_ROWS;
  readonly auditLines = AUDIT_LINES;
  readonly auditEvents = AUDIT_EVENTS;
  readonly plans = PRICING_PLANS;
  readonly faqs = FAQ_ITEMS;
  readonly ctaPoints = CTA_POINTS;
  readonly footerColumns = FOOTER_COLUMNS;
  readonly currentYear = new Date().getFullYear();

  // ===== État UI =====
  readonly isDarkMode = toSignal(this.darkModeService.getDarkModeObservable(), {
    initialValue: this.darkModeService.isDarkMode$
  });
  readonly menuOpen = signal(false);
  readonly langOpen = signal(false);
  readonly openFaq = signal<number | null>(0);

  // ===== Langue (partagée avec le reste de l'application via I18nService) =====
  readonly lang = this.i18n.lang;

  // ===== Scroll =====
  readonly scrollProgress = signal(0);
  readonly isScrolled = signal(false);
  readonly activeSection = signal('accueil');

  /** Les sections intermédiaires restent rattachées à « Fonctionnalités » dans le menu */
  private readonly sectionToNav: Record<string, string> = {
    gestion: 'fonctionnalites',
    securite: 'fonctionnalites',
    audit: 'fonctionnalites'
  };
  readonly activeNav = computed(() => this.sectionToNav[this.activeSection()] ?? this.activeSection());

  private ticking = false;

  // ===== Newsletter =====
  readonly email = signal('');
  readonly newsletterStatus = signal<'idle' | 'error' | 'success'>('idle');

  constructor() {
    this.destroyRef.onDestroy(() => (document.body.style.overflow = ''));
  }

  ngAfterViewInit(): void {
    this.initScrollSpy();
    this.bindWindowListeners();
    this.updateScrollState();
  }

  // ============================================
  // TRADUCTION
  // ============================================
  t(key: string): string {
    return this.i18n.t(key);
  }

  // ============================================
  // SCROLL : progression, header, scroll-spy
  // Les écouteurs tournent HORS zone Angular : aucun cycle de détection
  // de changements n'est déclenché à chaque événement de scroll/resize.
  // ============================================
  private bindWindowListeners(): void {
    const onScroll = (): void => {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        this.updateScrollState();
        this.ticking = false;
      });
    };

    const onResize = (): void => {
      // Repassage en grand écran avec le menu ouvert : on le ferme proprement
      if (this.menuOpen() && window.innerWidth >= DESKTOP_NAV_MIN_WIDTH) {
        this.zone.run(() => this.closeMenu());
      }
      onScroll();
    };

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });
    });

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    });
  }

  private updateScrollState(): void {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    this.scrollProgress.set(Math.round(progress * 1000) / 1000);
    this.isScrolled.set(window.scrollY > 8);
  }

  private initScrollSpy(): void {
    const ids = ['accueil', 'fonctionnalites', 'gestion', 'securite', 'audit', 'tarifs', 'faq', 'a-propos'];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.activeSection.set(entry.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    ids.forEach((id) => {
      const el = this.host.nativeElement.querySelector(`#${id}`);
      if (el) observer.observe(el);
    });

    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  scrollTo(id: string, event?: Event): void {
    event?.preventDefault();
    this.closeMenu();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  // ============================================
  // MENU MOBILE / LANGUE / THÈME
  // ============================================
  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    document.body.style.overflow = '';
  }

  setLang(l: Lang): void {
    this.i18n.setLang(l);
    this.langOpen.set(false);
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.langOpen()) this.langOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
    this.langOpen.set(false);
  }

  // ============================================
  // NAVIGATION & ACTIONS
  // ============================================
  goToLogin(): void {
    this.closeMenu();
    this.router.navigate(['/public/espaces']);
  }

  goToRegister(): void {
    this.closeMenu();
    this.router.navigate(['/public/espaces-inscription']);
  }

  // ✅ MODIFIÉ : "Vérifier un diplôme" mène désormais vers la page login
  goToVerify(): void {
    this.closeMenu();
    this.router.navigate(['/public/login']);
  }

  onPlanAction(plan: PricingPlan): void {
    switch (plan.action) {
      case 'verify':
        this.goToVerify();
        break;
      case 'login':
        this.goToLogin();
        break;
      case 'contact':
        window.location.href = 'mailto:contact@certiuni.cm?subject=Offre%20Entreprise%20CertiUni';
        break;
    }
  }

  buyPack(pack: RecruiterPack): void {
    this.closeMenu();
    this.router.navigate(['/public/momo-checkout'], {
      queryParams: { type: 'credits', pack: pack.id, returnUrl: '/public/accueil' }
    });
  }

  onLink(event: Event, link: FooterLink): void {
    event.preventDefault();
    if (link.route) this.router.navigate([link.route]);
    else if (link.section) this.scrollTo(link.section);
    // Sans route ni section : lien « bientôt », volontairement sans action
  }

  // ============================================
  // FAQ
  // ============================================
  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }

  // ============================================
  // NEWSLETTER
  // ============================================
  submitNewsletter(): void {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.email().trim());
    this.newsletterStatus.set(valid ? 'success' : 'error');
    if (valid) this.email.set('');
  }
}