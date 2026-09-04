import { Injectable, signal } from '@angular/core';
import { DiplomeEmis, MOCK_DIPLOMES_EMIS } from '../../assets/data/mock-data.admin';

@Injectable({ providedIn: 'root' })
export class DiplomesEmisState {
  readonly diplomes = signal<DiplomeEmis[]>(MOCK_DIPLOMES_EMIS);

  getDiplome(id: string): DiplomeEmis | undefined {
    return this.diplomes().find(d => d.id === id);
  }

  revoquer(id: string): void {
    this.diplomes.update(list =>
      list.map(d => (d.id === id ? { ...d, statut: 'Révoqué' } : d))
    );
  }
}