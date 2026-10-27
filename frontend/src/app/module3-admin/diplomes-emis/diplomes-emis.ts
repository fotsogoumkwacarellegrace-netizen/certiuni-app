import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DiplomesEmisState } from '../services/diplomes-emis-state';

@Component({
  selector: 'app-diplomes-emis',
  standalone: true,
  imports: [],
  templateUrl: './diplomes-emis.html',
  styleUrl: './diplomes-emis.css'
})
export class DiplomesEmis {
  private readonly router = inject(Router);
  private readonly state = inject(DiplomesEmisState);

  readonly diplomes = this.state.diplomes;

  readonly searchTerm = signal('');
  readonly typeFiltre = signal('');
  readonly statutFiltre = signal('');

  readonly types = computed(() => Array.from(new Set(this.diplomes().map(d => d.type))));
  readonly promotions = computed(() => Array.from(new Set(this.diplomes().map(d => d.promotion))));
  readonly promotionFiltre = signal('');

  readonly diplomesFiltres = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.diplomes().filter(d => {
      const matchTerm =
        !term ||
        d.titulaireNom.toLowerCase().includes(term) ||
        d.matricule.toLowerCase().includes(term) ||
        d.numero.toLowerCase().includes(term);
      const matchType = !this.typeFiltre() || d.type === this.typeFiltre();
      const matchPromotion = !this.promotionFiltre() || d.promotion === this.promotionFiltre();
      const matchStatut = !this.statutFiltre() || d.statut === this.statutFiltre();
      return matchTerm && matchType && matchPromotion && matchStatut;
    });
  });

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  voirDiplome(id: string): void {
    this.router.navigate(['/admin/diplomes-emis', id]);
  }

  telechargerPdf(id: string): void {
    const diplome = this.diplomes().find((d) => d.id === id);
    const nom = diplome ? diplome.numero + '-' + diplome.titulaireNom : id;
    const blob = new Blob(['Recapitulatif diplome CertiUni — ' + nom], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diplome-' + id + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }
}