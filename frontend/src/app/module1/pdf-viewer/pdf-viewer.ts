import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackButton } from '../../shared/ui/back-button';

/**
 * Visionneuse PDF (placeholder) : conserve la route existante et fournit
 * un bouton retour + un lien vers l accueil, en attendant le rendu reel.
 */
@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButton],
  template: `
    <div class="pdf-page">
      <header class="pdf-header">
        <a class="pdf-brand" routerLink="/public/accueil">
          <img src="images/logo.png" alt="CertiUni" class="pdf-logo" />
          <span>CertiUni</span>
        </a>
        <app-back-button></app-back-button>
      </header>
      <main class="pdf-main">
        <span class="material-symbols-outlined pdf-icon">picture_as_pdf</span>
        <h1>Aperçu du document</h1>
        <p>La visionneuse PDF s ouvrira ici apres la connexion au backend.</p>
        <a class="pdf-cta" routerLink="/public/accueil">Retour à l accueil</a>
      </main>
    </div>
  `,
  styles: [`
    .pdf-page { min-height: 100vh; display: flex; flex-direction: column; background: #f6f8fb; color: #0f172a; }
    .pdf-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; background: #fff; border-bottom: 1px solid #e2e8f0; }
    .pdf-brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; font-weight: 800; cursor: pointer; }
    .pdf-logo { height: 34px; width: auto; }
    .pdf-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; padding: 24px; }
    .pdf-icon { font-size: 64px; color: #c1121f; }
    .pdf-main h1 { margin: 0; font-size: 1.4rem; }
    .pdf-main p { margin: 0; color: #55636f; }
    .pdf-cta { margin-top: 8px; padding: 10px 18px; border-radius: 10px; background: #0b4d3a; color: #fff; text-decoration: none; font-weight: 700; }
    :host-context(.dark-mode) .pdf-page { background: #0a0a14; color: #e6edf3; }
    :host-context(.dark-mode) .pdf-header { background: #141425; border-color: #2a2a40; }
    :host-context(.dark-mode) .pdf-main p { color: #9aa4b2; }
  `],
})
export class PdfViewer {}