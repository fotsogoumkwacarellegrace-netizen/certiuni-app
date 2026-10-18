
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Institution, MOCK_INSTITUTIONS } from '../../assets/data/mock-data-superadmin';

@Component({
  selector: 'app-institutions-superadmin',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './institutions-superadmin.html',
  styleUrl: './institutions-superadmin.css'
})
export class InstitutionsSuperadmin {
  private readonly router = inject(Router);
  // Ne contient que les institutions déjà traitées (Active / Suspendue) —
  // les demandes en attente vivent uniquement dans MOCK_DEMANDES_INSCRIPTION.
  readonly institutions = signal<Institution[]>(MOCK_INSTITUTIONS);

  readonly searchTerm = signal('');
  readonly institutionASupprimer = signal<Institution | null>(null);

  readonly institutionsFiltrees = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.institutions();
    }
    return this.institutions().filter(i => i.nom.toLowerCase().includes(term));
  });

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  voirDetails(institution: Institution): void {
    this.router.navigate(['/superadmin/bientot'], { queryParams: { page: 'Fiche institution — ' + institution.nom } });
  }

  demanderSuppression(institution: Institution): void {
    this.institutionASupprimer.set(institution);
  }

  annulerSuppression(): void {
    this.institutionASupprimer.set(null);
  }

  confirmerSuppression(): void {
    const cible = this.institutionASupprimer();
    if (!cible) {
      return;
    }
    this.institutions.update(list => list.filter(i => i.id !== cible.id));
    this.institutionASupprimer.set(null);
  }
}

