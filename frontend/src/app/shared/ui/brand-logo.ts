import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Logo CertiUni toujours cliquable vers l'accueil du module courant.
 * Utilisation : <app-brand-logo home="/student/dashboard" img="..." /> (defaut /public/landing).
 */
@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a class="app-brand" [routerLink]="home" aria-label="CertiUni - accueil">
      <img [src]="img" alt="CertiUni" class="app-brand-img" />
    </a>
  `,
  styles: [
    `.app-brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; cursor: pointer; }
    .app-brand-img { height: 36px; width: auto; }
    .app-brand-mark { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; background: #0b4d3a; color: #fff; }
    .app-brand-name { font-weight: 800; font-size: 1.1rem; }`,
  ],
})
export class BrandLogo {
  @Input() home = '/public/landing';
  /** Image du logo CertiUni — utilisee comme lien de retour (probleme 3). */
  @Input() img = 'assets/logos/logo.png';
}