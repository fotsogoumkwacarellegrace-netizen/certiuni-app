import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

/**
 * Bouton Retour universel : revient a la page precedente (historique navigateur),
 * avec repli vers l'accueil du module via `fallback`.
 * Variante `pill` (vert CertiUni) disponible via l'entree `variant`.
 */
@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="app-back-btn"
      [class.app-back-btn--pill]="variant === 'pill'"
      (click)="goBack()"
      [attr.aria-label]="label"
      [title]="label"
    >
      <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
      <span>{{ label }}</span>
    </button>
  `,
  styles: [
    `.app-back-btn {
      display: inline-flex; align-items: center; gap: 8px;
      border: 1px solid var(--app-border, #e2e8f0); background: var(--app-card, #fff);
      color: var(--app-text, #0f172a); border-radius: 10px; padding: 8px 14px;
      font-weight: 600; cursor: pointer; font-size: 0.85rem; white-space: nowrap;
      transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
    }
    .app-back-btn:hover { background: var(--app-hover, #f1f5f9); transform: translateX(-2px); }
    .app-back-btn:active { transform: translateX(0); }
    .app-back-btn .material-symbols-outlined { font-size: 18px; }
    /* Variante pill premium (vert CertiUni + ombre) */
    .app-back-btn--pill {
      background: linear-gradient(135deg, #19764A, #0B4D3A);
      border: none; color: #fff; border-radius: 999px; padding: 10px 20px;
      box-shadow: 0 6px 18px rgba(25, 118, 74, 0.35);
    }
    .app-back-btn--pill:hover {
      background: linear-gradient(135deg, #1d8a56, #0d5c45);
      box-shadow: 0 8px 22px rgba(25, 118, 74, 0.45);
      transform: translateX(-3px);
    }`,
  ],
})
export class BackButton {
  private readonly location = inject(Location);
  label = 'Retour';
  fallback = '/public/landing';
  /** 'default' | 'pill' */
  variant: 'default' | 'pill' = 'default';

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.location.go(this.fallback);
      window.location.reload();
    }
  }
}