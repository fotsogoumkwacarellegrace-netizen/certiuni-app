import { Component, computed, signal } from '@angular/core';
import { LogVerification, MOCK_LOGS_VERIFICATION } from '../../assets/data/mock-data.admin';

@Component({
  selector: 'app-logs-verification',
  standalone: true,
  imports: [],
  templateUrl: './logs-verification.html',
  styleUrl: './logs-verification.css'
})
export class LogsVerification {
  readonly logs = MOCK_LOGS_VERIFICATION;

  readonly searchTerm = signal('');
  readonly typeFiltre = signal('');
  readonly statutFiltre = signal('');
  readonly dateDebut = signal('');
  readonly dateFin = signal('');

  readonly types = ['QR Code', 'Numéro'];
  readonly statuts = ['Authentique', 'Révoqué', 'Non validé'];

  readonly logsFiltres = computed<LogVerification[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.logs.filter(log => {
      const matchTerm = !term || log.numeroDiplome.toLowerCase().includes(term);
      const matchType = !this.typeFiltre() || log.type === this.typeFiltre();
      const matchStatut = !this.statutFiltre() || log.statut === this.statutFiltre();
      return matchTerm && matchType && matchStatut;
    });
  });

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }
}