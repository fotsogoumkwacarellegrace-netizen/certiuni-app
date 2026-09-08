import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DiplomesEmisState } from '../services/diplomes-emis-state';

@Component({
  selector: 'app-voir-diplome',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './voir-diplome.html',
  styleUrl: './voir-diplome.css'
})
export class VoirDiplome {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(DiplomesEmisState);

  readonly diplome = this.state.getDiplome(this.route.snapshot.paramMap.get('id') ?? '');

  revoquerCeDiplome(): void {
    if (!this.diplome) {
      return;
    }
    this.router.navigate(['/admin/diplomes-emis', this.diplome.id, 'revoquer']);
  }
}