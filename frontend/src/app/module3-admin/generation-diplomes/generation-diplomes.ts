import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DiplomaCreationState } from '../services/diploma-creation-state';
import { MOCK_CSV_VALIDATION } from '../../assets/data/mock-data.admin';

@Component({
  selector: 'app-generation-diplomes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './generation-diplomes.html',
  styleUrl: './generation-diplomes.css'
})
export class GenerationDiplomes {
  private readonly router = inject(Router);
  private readonly state = inject(DiplomaCreationState);

  readonly etapes = this.state.etapesGeneration;
  readonly terminee = this.state.generationTerminee;

  readonly totalLignes = MOCK_CSV_VALIDATION.lignesValides;

  readonly progression = computed(() => {
    const etapes = this.etapes();
    if (etapes.length === 0) {
      return 0;
    }
    const faites = etapes.filter(e => e.fait).length;
    return Math.round((faites / etapes.length) * 100);
  });

  readonly diplomesGeneres = computed(() =>
    Math.round((this.progression() / 100) * this.totalLignes)
  );

  annuler(): void {
    this.router.navigate(['/admin/creer-diplomes/validation-csv']);
  }

  voirResultats(): void {
    this.router.navigate(['/admin/creer-diplomes/validation-emission']);
  }
}