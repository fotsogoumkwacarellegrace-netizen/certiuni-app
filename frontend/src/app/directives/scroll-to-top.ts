// src/app/directives/scroll-to-top.ts
import { Directive, HostListener, Renderer2, OnInit, OnDestroy, inject } from '@angular/core';

@Directive({
  selector: '[appScrollToTop]',
  standalone: true
})
export class ScrollToTopDirective implements OnInit, OnDestroy {
  private renderer = inject(Renderer2);
  private button: HTMLElement | null = null;
  private clickListener: (() => void) | null = null;

  ngOnInit() {
    this.createScrollButton();
  }

  private createScrollButton() {
    // Créer le bouton
    this.button = this.renderer.createElement('button');
    
    // Ajouter une classe
    this.renderer.addClass(this.button, 'scroll-to-top-btn');
    
    // Styles
    this.renderer.setStyle(this.button, 'position', 'fixed');
    this.renderer.setStyle(this.button, 'bottom', '30px');
    this.renderer.setStyle(this.button, 'right', '30px');
    this.renderer.setStyle(this.button, 'width', '50px');
    this.renderer.setStyle(this.button, 'height', '50px');
    this.renderer.setStyle(this.button, 'border-radius', '50%');
    this.renderer.setStyle(this.button, 'border', 'none');
    this.renderer.setStyle(this.button, 'background', '#006c53');
    this.renderer.setStyle(this.button, 'color', 'white');
    this.renderer.setStyle(this.button, 'cursor', 'pointer');
    this.renderer.setStyle(this.button, 'box-shadow', '0 4px 15px rgba(0,108,83,0.3)');
    this.renderer.setStyle(this.button, 'transition', 'all 0.3s ease');
    this.renderer.setStyle(this.button, 'opacity', '0');
    this.renderer.setStyle(this.button, 'visibility', 'hidden');
    this.renderer.setStyle(this.button, 'transform', 'scale(0.8)');
    this.renderer.setStyle(this.button, 'z-index', '999');
    this.renderer.setStyle(this.button, 'display', 'flex');
    this.renderer.setStyle(this.button, 'align-items', 'center');
    this.renderer.setStyle(this.button, 'justify-content', 'center');

    // Ajouter l'icône SVG
    const svg = this.renderer.createElement('svg');
    this.renderer.setAttribute(svg, 'width', '24');
    this.renderer.setAttribute(svg, 'height', '24');
    this.renderer.setAttribute(svg, 'viewBox', '0 0 24 24');
    this.renderer.setAttribute(svg, 'fill', 'none');
    this.renderer.setAttribute(svg, 'stroke', 'currentColor');
    this.renderer.setAttribute(svg, 'stroke-width', '2.5');
    
    const polyline = this.renderer.createElement('polyline');
    this.renderer.setAttribute(polyline, 'points', '18 15 12 9 6 15');
    this.renderer.appendChild(svg, polyline);
    this.renderer.appendChild(this.button, svg);

    // Ajouter au body
    this.renderer.appendChild(document.body, this.button);

    // Écouter le click
    this.clickListener = this.renderer.listen(this.button, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Vérifier l'état initial
    this.checkScrollPosition();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScrollPosition();
  }

  private checkScrollPosition() {
    if (!this.button) return;
    
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    
    if (scrollY > 300) {
      this.renderer.setStyle(this.button, 'opacity', '1');
      this.renderer.setStyle(this.button, 'visibility', 'visible');
      this.renderer.setStyle(this.button, 'transform', 'scale(1)');
    } else {
      this.renderer.setStyle(this.button, 'opacity', '0');
      this.renderer.setStyle(this.button, 'visibility', 'hidden');
      this.renderer.setStyle(this.button, 'transform', 'scale(0.8)');
    }
  }

  ngOnDestroy() {
    if (this.button && this.button.parentNode) {
      this.renderer.removeChild(document.body, this.button);
    }
    if (this.clickListener) {
      this.clickListener();
    }
  }
}