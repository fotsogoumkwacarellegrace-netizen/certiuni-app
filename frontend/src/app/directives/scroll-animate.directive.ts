// src/app/directives/scroll-animate.directive.ts
import { Directive, ElementRef, Renderer2, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements AfterViewInit {
  private observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    // Ne fonctionne que dans le navigateur
    if (!isPlatformBrowser(this.platformId)) return;

    // Ajouter une classe initiale pour masquer l'élément
    this.renderer.addClass(this.el.nativeElement, 'animate-hidden');

    // Créer l'observateur d'intersection
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // L'élément entre dans la vue → animation
            this.renderer.addClass(this.el.nativeElement, 'animate-visible');
            this.renderer.removeClass(this.el.nativeElement, 'animate-hidden');
            // Une fois animé, on arrête de l'observer
            this.observer?.unobserve(this.el.nativeElement);
          }
        });
      },
      {
        threshold: 0.1, // Déclenché quand 10% de l'élément est visible
        rootMargin: '0px 0px -50px 0px' // Légèrement avant que l'élément arrive
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}