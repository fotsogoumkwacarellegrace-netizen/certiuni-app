import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DiplomaCreationState } from '../services/diploma-creation-state';
import {
  MOCK_CONTROLE_QUALITE,
  MOCK_ECHANTILLON_DIPLOMES,
  MOCK_CSV_VALIDATION
} from '../../assets/data/mock-data.admin';

@Component({
  selector: 'app-validation-emission',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './validation-emission.html',
  styleUrl: './validation-emission.css'
})
export class ValidationEmission {
  private readonly router = inject(Router);
  private readonly state = inject(DiplomaCreationState);

  readonly diplomesGeneres = MOCK_CSV_VALIDATION.lignesValides;
  readonly controleQualite = MOCK_CONTROLE_QUALITE;
  readonly echantillon = MOCK_ECHANTILLON_DIPLOMES;
  readonly emitting = signal(false);

  validerEtEmettre(): void {
    this.emitting.set(true);
    // TODO: remplacer par l'appel réel à l'API d'émission des diplômes.
    setTimeout(() => {
      this.emitting.set(false);
      this.state.reset();
      this.router.navigate(['/admin/dashboard']);
    }, 800);
  }
}