import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SuperadminState } from '../services/superadmin-state';

interface IdentifiantsGeneres {
  institution: string;
  identifiantUnique: string;
  motDePasse: string;
}

@Component({
  selector: 'app-consulter-demande',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './consulter-demande.html',
  styleUrl: './consulter-demande.css'
})
export class ConsulterDemande {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(SuperadminState);

  readonly demande = this.state.getDemande(this.route.snapshot.paramMap.get('id') ?? '');

  readonly identifiantsGeneres = signal<IdentifiantsGeneres | null>(null);

  validerInstitution(): void {
    if (!this.demande) {
      return;
    }
    this.state.validerDemande(this.demande.id);

    // TODO: remplacer par les identifiants réellement générés par le backend.
    this.identifiantsGeneres.set({
      institution: this.demande.institution,
      identifiantUnique: this.genererIdentifiant(),
      motDePasse: this.genererMotDePasse()
    });
  }

  fermerDialogValidation(): void {
    this.identifiantsGeneres.set(null);
    this.router.navigate(['/superadmin/demandes-inscription']);
  }

  rejeterLaDemande(): void {
    if (!this.demande) {
      return;
    }
    this.state.rejeterDemande(this.demande.id);
    this.router.navigate(['/superadmin/demandes-inscription']);
  }

  private genererIdentifiant(): string {
    const annee = new Date().getFullYear();
    const suffixe = Math.floor(1000 + Math.random() * 9000);
    return `INSTI-${annee}-${suffixe}`;
  }

  private genererMotDePasse(): string {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789#@!';
    let motDePasse = '';
    for (let i = 0; i < 12; i++) {
      motDePasse += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    return motDePasse;
  }
}