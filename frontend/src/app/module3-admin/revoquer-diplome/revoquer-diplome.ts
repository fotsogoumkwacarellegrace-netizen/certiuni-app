import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DiplomesEmisState } from '../services/diplomes-emis-state';

@Component({
  selector: 'app-revoquer-diplome',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './revoquer-diplome.html',
  styleUrl: './revoquer-diplome.css'
})
export class RevoquerDiplome {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(DiplomesEmisState);

  readonly diplome = this.state.getDiplome(this.route.snapshot.paramMap.get('id') ?? '');

  readonly motifs = [
    'Erreur administrative',
    'Fraude avérée',
    'Demande de l\'étudiant',
    'Décision disciplinaire',
    'Autre'
  ];

  readonly motif = signal('');
  readonly commentaire = signal('');
  readonly motifError = signal<string | null>(null);
  readonly submitting = signal(false);

  onCommentaireChange(value: string): void {
    this.commentaire.set(value.slice(0, 300));
  }

  annuler(): void {
    if (this.diplome) {
      this.router.navigate(['/admin/diplomes-emis', this.diplome.id]);
    } else {
      this.router.navigate(['/admin/diplomes-emis']);
    }
  }

  confirmerLaRevocation(): void {
    if (!this.diplome) {
      return;
    }
    if (!this.motif()) {
      this.motifError.set('Veuillez sélectionner un motif de révocation.');
      return;
    }

    this.submitting.set(true);
    // TODO: remplacer par l'appel réel à l'API de révocation.
    this.state.revoquer(this.diplome.id);

    setTimeout(() => {
      this.submitting.set(false);
      this.router.navigate(['/admin/diplomes-emis', this.diplome!.id]);
    }, 500);
  }
}