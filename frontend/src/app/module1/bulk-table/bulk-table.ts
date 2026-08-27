import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService, BulkCandidate } from '../../core/services/mock-data.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-bulk-table',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './bulk-table.html',
  styleUrl: './bulk-table.css'
})
export class BulkTable {
  private router = inject(Router);
  private mockService = inject(MockDataService);

  candidates = signal<BulkCandidate[]>([]);
  currentPage = signal(1);
  pageSize = 5;

  totalPages = computed(() => Math.ceil(this.candidates().length / this.pageSize) || 1);

  pagedCandidates = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.candidates().slice(start, start + this.pageSize);
  });

  constructor() {
    this.candidates.set(this.mockService.getBulkCandidates());
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'VALID': return 'VERIFIED';
      case 'REVOKED': return 'REVOKED';
      default: return 'UNKNOWN';
    }
  }

  onRowClick(candidate: BulkCandidate) {
    this.router.navigate(['/public/candidate-drawer', candidate.uuid]);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onNewList() {
    this.router.navigate(['/public/accueil']);
  }

  exportReport() {
    // Simulation d'export — en mode démo, pas de vrai fichier généré
    alert('Export du rapport (.xlsx) — fonctionnalité simulée');
  }

  goToVerify() { this.router.navigate(['/public/accueil']); }
  goToBulk() { this.router.navigate(['/public/bulk-table']); }
  goToHistory() {}
  goToNewVerification() { this.router.navigate(['/public/accueil']); }
}