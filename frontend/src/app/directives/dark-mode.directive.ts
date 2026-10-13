// src/app/directives/dark-mode.directive.ts
import { Directive, Renderer2, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { DarkModeService } from '../services/dark-mode';

@Directive({
  selector: '[appDarkMode]',
  standalone: true
})
export class DarkModeDirective implements OnInit, OnDestroy {
  private renderer = inject(Renderer2);
  private darkModeService = inject(DarkModeService);
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    // Appliquer l'état initial
    this.applyDarkMode(this.darkModeService.isDarkMode$);
    
    // S'abonner aux changements
    this.subscription = this.darkModeService.getDarkModeObservable().subscribe(
      (isDark: boolean) => {
        this.applyDarkMode(isDark);
      }
    );
  }

  private applyDarkMode(isDark: boolean) {
    if (isDark) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}