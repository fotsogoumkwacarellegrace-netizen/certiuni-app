import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SuperadminState } from '../services/superadmin-state';

type Onglet = 'Toutes' | 'En attente' | 'Validées' | 'Rejetées';

@Component({
  selector: 'app-demandes-inscription',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './demandes-inscription.html',
  styleUrl: './demandes-inscription.css'
})
export class DemandesInscription {
  private readonly router = inject(Router);
  private readonly state = inject(SuperadminState);

  readonly demandes = this.state.demandes;
  readonly searchTerm = signal('');
  readonly ongletActif = signal<Onglet>('Toutes');

  readonly onglets: Onglet[] = ['Toutes', 'En attente', 'Validées', 'Rejetées'];

  readonly compteurs = computed(() => {
    const all = this.demandes();
    return {
      Toutes: all.length,
      'En attente': all.filter(d => d.statut === 'En attente').length,
      Validées: all.filter(d => d.statut === 'Validée').length,
      Rejetées: all.filter(d => d.statut === 'Rejetée').length
    };
  });

  readonly demandesFiltrees = computed(() => {
    const onglet = this.ongletActif();
    const term = this.searchTerm().trim().toLowerCase();

    return this.demandes().filter(d => {
      const matchOnglet =
        onglet === 'Toutes' ||
        (onglet === 'En attente' && d.statut === 'En attente') ||
        (onglet === 'Validées' && d.statut === 'Validée') ||
        (onglet === 'Rejetées' && d.statut === 'Rejetée');
      const matchTerm = !term || d.institution.toLowerCase().includes(term);
      return matchOnglet && matchTerm;
    });
  });

  selectionnerOnglet(onglet: Onglet): void {
    this.ongletActif.set(onglet);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  consulter(id: string): void {
    this.router.navigate(['/superadmin/demandes-inscription', id]);
  }
}