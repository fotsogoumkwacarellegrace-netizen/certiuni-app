import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DiplomaCreationState } from '../services/diploma-creation-state';

@Component({
  selector: 'app-validation-csv',
  standalone: true,
  imports: [],
  templateUrl: './validation-csv.html',
  styleUrl: './validation-csv.css'
})
export class ValidationCsv {
  private readonly router = inject(Router);
  private readonly state = inject(DiplomaCreationState);

  readonly validation = this.state.csvValidation;

  telechargerRapport(): void {
    // TODO: générer et télécharger le rapport réel une fois l'API disponible.
    console.log('Téléchargement du rapport d\'erreurs (mock)');
  }

  corrigerLeFichier(): void {
    this.router.navigate(['/admin/creer-diplomes/importer']);
  }

  suivant(): void {
    this.state.startGeneration();
    this.router.navigate(['/admin/creer-diplomes/generation']);
  }
}