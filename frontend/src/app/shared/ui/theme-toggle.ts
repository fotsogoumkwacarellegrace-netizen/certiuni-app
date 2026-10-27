import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../../services/dark-mode';

/**
 * Interrupteur mode clair/sombre global : bascule la classe dark-mode
 * sur <body> (meme comportement que le Module 1) + memorise le choix.
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="app-theme-toggle"
      (click)="toggle()"
      [attr.aria-label]="isDark() ? 'Passer en mode clair' : 'Passer en mode sombre'"
      [attr.aria-pressed]="isDark()"
      title="Mode clair / sombre"
    >
      <span class="material-symbols-outlined" aria-hidden="true">{{
        isDark() ? 'light_mode' : 'dark_mode'
      }}</span>
    </button>
  `,
  styles: [
    `.app-theme-toggle {
      display: inline-flex; align-items: center; justify-content: center;
      width: 40px; height: 40px; border-radius: 50%;
      border: 1px solid var(--app-border, #e2e8f0);
      background: var(--app-card, #fff); color: var(--app-text, #0f172a);
      cursor: pointer;
    }
    .app-theme-toggle:hover { background: var(--app-hover, #f1f5f9); }`,
  ],
})
export class ThemeToggle {
  private readonly dark = inject(DarkModeService);

  isDark(): boolean {
    return this.dark.isDarkMode$;
  }

  toggle(): void {
    this.dark.toggleDarkMode();
  }
}