// src/app/directives/reveal.directive.ts
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
  numberAttribute
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type RevealType = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade';

/**
 * Fait apparaître un élément (ou ses enfants directs) quand il entre dans le viewport.
 *
 * Exemples :
 *   <section appReveal="up">…</section>
 *   <div class="grid" appReveal="up" [revealStagger]="90">…enfants en cascade…</div>
 */
@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  /** Type d'animation */
  @Input('appReveal') type: RevealType | '' = 'up';
  /** Délai avant l'animation (ms) */
  @Input({ transform: numberAttribute }) revealDelay = 0;
  /** Durée de l'animation (ms) */
  @Input({ transform: numberAttribute }) revealDuration = 700;
  /** Si > 0 : anime les enfants directs en cascade (ms entre chaque enfant) */
  @Input({ transform: numberAttribute }) revealStagger = 0;
  /** Part de l'élément qui doit être visible pour déclencher (0 à 1) */
  @Input({ transform: numberAttribute }) revealThreshold = 0.12;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);

  private observer?: IntersectionObserver;
  private timerId?: number;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Accessibilité : on laisse le contenu visible tel quel
    // (matchMedia peut etre absent hors navigateur — ex. environnement de test)
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) return;

    const variant: RevealType = this.type || 'up';
    const targets: HTMLElement[] =
      this.revealStagger > 0 ? (Array.from(this.host.children) as HTMLElement[]) : [this.host];

    targets.forEach((el, index) => {
      const delay = this.revealDelay + index * this.revealStagger;
      el.classList.add('reveal', `reveal--${variant}`);
      el.style.setProperty('--reveal-delay', `${delay}ms`);
      el.style.setProperty('--reveal-duration', `${this.revealDuration}ms`);
    });

    // L'observer tourne hors zone : aucun cycle de détection de changements inutile
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            // top < 0 : élément déjà dépassé (rechargement au milieu de la page)
            if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
              this.play(targets, variant);
              this.observer?.disconnect();
              break;
            }
          }
        },
        { threshold: this.revealThreshold, rootMargin: '0px 0px -8% 0px' }
      );
      this.observer.observe(this.host);
    });
  }

  private play(targets: HTMLElement[], variant: RevealType): void {
    targets.forEach((el) => el.classList.add('reveal--visible'));

    // Une fois l'animation terminée, on retire les classes pour rendre la main
    // aux styles propres de l'élément (hover, transform, transition…)
    const total =
      this.revealDelay + (targets.length - 1) * this.revealStagger + this.revealDuration + 80;

    this.timerId = window.setTimeout(() => {
      targets.forEach((el) => {
        el.classList.remove('reveal', `reveal--${variant}`, 'reveal--visible');
        el.style.removeProperty('--reveal-delay');
        el.style.removeProperty('--reveal-duration');
      });
    }, total);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.timerId) window.clearTimeout(this.timerId);
  }
}