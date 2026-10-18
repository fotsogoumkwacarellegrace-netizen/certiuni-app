import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

/**
 * Bouton Retour universel : revient a la page precedente (historique navigateur),
 * avec repli vers l'accueil du module via `fallback`.
 */
@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="button" class="app-back-btn" (click)="goBack()" [attr.aria-label]="label">
      <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
      <span>{{ label }}</span>
    </button>
  `,
  styles: [
    `.app-back-btn {
      display: inline-flex; align-items: center; gap: 8px;
      border: 1px solid var(--app-border, #e2e8f0); background: var(--app-card, #fff);
      color: var(--app-text, #0f172a); border-radius: 10px; padding: 8px 14px;
      font-weight: 600; cursor: pointer;
    }
    .app-back-btn:hover { background: var(--app-hover, #f1f5f9); }`,
  ],
})
export class BackButton {
  private readonly location = inject(Location);
  label = 'Retour';
  fallback = '/public/landing';

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.location.go(this.fallback);
      window.location.reload();
    }
  }
}