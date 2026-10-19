import { Component, computed, signal } from '@angular/core';
import { AuditLog, MOCK_AUDIT_LOGS } from '../../assets/data/mock-data-superadmin';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [],
  templateUrl: './audit.html',
  styleUrl: './audit.css'
})
export class Audit {
  readonly logs = MOCK_AUDIT_LOGS;

  readonly searchTerm = signal('');
  readonly institutionFiltre = signal('');
  readonly utilisateurFiltre = signal('');
  readonly actionFiltre = signal('');
  readonly dateDebut = signal('');
  readonly dateFin = signal('');

  readonly institutions = computed(() =>
    Array.from(new Set(this.logs.map(l => l.institution))).filter(i => i !== '-')
  );
  readonly utilisateurs = computed(() => Array.from(new Set(this.logs.map(l => l.utilisateur))));
  readonly actions = computed(() => Array.from(new Set(this.logs.map(l => l.action))));

  readonly logsFiltres = computed<AuditLog[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.logs.filter(log => {
      const matchTerm =
        !term ||
        log.institution.toLowerCase().includes(term) ||
        log.utilisateur.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term);
      const matchInstitution = !this.institutionFiltre() || log.institution === this.institutionFiltre();
      const matchUtilisateur = !this.utilisateurFiltre() || log.utilisateur === this.utilisateurFiltre();
      const matchAction = !this.actionFiltre() || log.action === this.actionFiltre();
      return matchTerm && matchInstitution && matchUtilisateur && matchAction;
    });
  });

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }
}