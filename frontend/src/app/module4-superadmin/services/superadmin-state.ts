import { Injectable, signal } from '@angular/core';
import { DemandeInscription, MOCK_DEMANDES_INSCRIPTION } from '../../assets/data/mock-data-superadmin';

@Injectable({ providedIn: 'root' })
export class SuperadminState {
  // Demandes d'inscription tenues en mémoire pour permettre valider/rejeter en local.
  readonly demandes = signal<DemandeInscription[]>(MOCK_DEMANDES_INSCRIPTION);

  // Affichage de la confirmation de déconnexion (overlay flouté, géré par le layout).
  readonly showLogoutConfirm = signal(false);

  getDemande(id: string): DemandeInscription | undefined {
    return this.demandes().find(d => d.id === id);
  }

  validerDemande(id: string): void {
    this.demandes.update(list =>
      list.map(d => (d.id === id ? { ...d, statut: 'Validée' } : d))
    );
  }

  rejeterDemande(id: string): void {
    this.demandes.update(list =>
      list.map(d => (d.id === id ? { ...d, statut: 'Rejetée' } : d))
    );
  }

  openLogoutConfirm(): void {
    this.showLogoutConfirm.set(true);
  }

  closeLogoutConfirm(): void {
    this.showLogoutConfirm.set(false);
  }
}