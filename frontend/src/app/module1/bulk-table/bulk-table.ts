// frontend/src/app/module1/bulk-table/bulk-table.ts
import { Component, inject, signal, computed, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MockDataService, BulkCandidate, VerificationResult, Grade } from '../../core/services/mock-data.service';
import { DarkModeService } from '../../services/dark-mode';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { Subscription } from 'rxjs';
import { I18nService } from '../../services/i18n.service';
interface PanelData {
  status: 'VALID' | 'REVOKED' | 'NOT_FOUND';
  studentName: string;
  university?: string;
  courseTitle?: string;
  mention?: string;
  average?: string;
  issueDate?: string;
  notes?: Grade[];
  totalCredits?: number;
  hash?: string;
  pdfUrl?: string | null;
  message?: string;
}

@Component({
  selector: 'app-bulk-table',
  standalone: true,
  imports: [CommonModule, RouterModule, DarkModeDirective],
  templateUrl: './bulk-table.html',
  styleUrl: './bulk-table.css'
})
export class BulkTable implements OnInit, OnDestroy {
  readonly i18n = inject(I18nService);
  private router = inject(Router);
  private mockService = inject(MockDataService);
  private darkModeService = inject(DarkModeService);
  private darkModeSubscription: Subscription = new Subscription();

  // ============================================
  // ÉTAT DE L'APPLICATION
  // ============================================
  candidates = signal<BulkCandidate[]>([]);
  currentPage = signal(1);
  pageSize = 5;
  isMobileMenuOpen = signal(false);
  isDarkMode = signal(false);
  isExporting = signal(false);
  searchTerm = signal('');
  selectedStatus = signal<string>('all');

  selectedCandidate = signal<BulkCandidate | null>(null);
  selectedResult = signal<VerificationResult | null>(null);
  isLoadingDetails = signal(false);
  hashCopied = signal(false);

  // ============================================
  // DONNÉES DU PANNEAU DÉTAIL
  // ============================================
  panelData = computed<PanelData | null>(() => {
    const candidate = this.selectedCandidate();
    const result = this.selectedResult();
    if (!candidate || !result) return null;

    if (result.status === 'VALID' && result.data) {
      const cert = result.data.certificate;
      const notes = cert.notes ?? [];
      const average = notes.length
        ? (notes.reduce((sum, n) => sum + n.note, 0) / notes.length).toFixed(1)
        : 'â€”';
      const totalCredits = notes.reduce((sum, n) => sum + (n.credits ?? 0), 0);

      return {
        status: 'VALID',
        studentName: `${result.data.student.first_name} ${result.data.student.last_name}`,
        university: cert.university_name,
        courseTitle: cert.course_title,
        mention: this.getMention(cert.final_grade),
        average,
        issueDate: cert.issue_date,
        notes,
        totalCredits,
        hash: cert.certificat_hash,
        pdfUrl: cert.pdf_url
      };
    }

    if (result.status === 'REVOKED') {
      return {
        status: 'REVOKED',
        studentName: result.studentName || candidate.name,
        message: result.message
      };
    }

    return {
      status: 'NOT_FOUND',
      studentName: candidate.name,
      message: result.message || 'Aucune donnée disponible pour cet identifiant.'
    };
  });

  // ============================================
  // COMPUTED - STATISTIQUES
  // ============================================
  totalValid = computed(() => this.candidates().filter(c => c.status === 'VALID').length);
  totalRevoked = computed(() => this.candidates().filter(c => c.status === 'REVOKED').length);
  totalUnknown = computed(() => this.candidates().filter(c => c.status === 'NOT_FOUND').length);
  totalCandidates = computed(() => this.candidates().length);

  // ============================================
  // COMPUTED - FILTRAGE & PAGINATION
  // ============================================
  filteredCandidates = computed(() => {
    let items = this.candidates();

    if (this.selectedStatus() !== 'all') {
      items = items.filter(c => c.status === this.selectedStatus());
    }

    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      items = items.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.uuid.toLowerCase().includes(search) ||
        c.diploma.toLowerCase().includes(search)
      );
    }

    return items;
  });

  totalPages = computed(() => Math.ceil(this.filteredCandidates().length / this.pageSize) || 1);

  pagedCandidates = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredCandidates().slice(start, start + this.pageSize);
  });

  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize + 1);
  endIndex = computed(() => {
    const end = this.currentPage() * this.pageSize;
    const total = this.filteredCandidates().length;
    return end < total ? end : total;
  });

  // ============================================
  // CYCLE DE VIE
  // ============================================
  constructor() {
    this.isDarkMode.set(this.darkModeService.isDarkMode$);
    this.darkModeSubscription = this.darkModeService.getDarkModeObservable().subscribe(
      (isDark: boolean) => {
        this.isDarkMode.set(isDark);
      }
    );
  }

  ngOnInit(): void {
    this.candidates.set(this.mockService.getBulkCandidates());
  }

  ngOnDestroy(): void {
    this.darkModeSubscription.unsubscribe();
  }

  // ============================================
  // PAGINATION
  // ============================================
  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (current >= total - 2) {
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(current - 2, current - 1, current, current + 1, current + 2);
      }
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // ============================================
  // FILTRES & RECHERCHE
  // ============================================
  setStatusFilter(status: string): void {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.currentPage.set(1);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  // ============================================
  // PANNEAU DE DÉTAIL
  // ============================================
  openDetails(candidate: BulkCandidate): void {
    this.selectedCandidate.set(candidate);
    this.selectedResult.set(null);
    this.isLoadingDetails.set(true);

    this.mockService.verifyCertificate(candidate.uuid).subscribe({
      next: (result) => {
        this.isLoadingDetails.set(false);
        this.selectedResult.set(result);
      },
      error: () => {
        this.isLoadingDetails.set(false);
        this.selectedResult.set({ status: 'NOT_FOUND', message: 'Erreur lors de la récupération des données.' });
      }
    });
  }

  closeDetails(): void {
    this.selectedCandidate.set(null);
    this.selectedResult.set(null);
  }

  // ============================================
  // MÉTHODES UTILITAIRES
  // ============================================
  getMention(finalGrade: string): string {
    const match = finalGrade.match(/\(([^)]+)\)/);
    return match ? match[1].replace('Mention ', '') : 'â€”';
  }

  copyHash(hash: string | undefined): void {
    if (!hash) return;
    navigator.clipboard?.writeText(hash).then(() => {
      this.hashCopied.set(true);
      setTimeout(() => this.hashCopied.set(false), 1800);
    });
  }

  onViewOriginal(): void {
    const pdfUrl = this.panelData()?.pdfUrl;
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert('Copie du diplôme non disponible en mode simulation.');
    }
  }

  // ============================================
  // NAVIGATION
  // ============================================
  goToHistory(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/public/bientot'], { queryParams: { page: 'Historique des verifications' } });
  }

  goToSettings(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/public/settings']);
  }

  logout(): void {
    localStorage.removeItem('recruteur_user');
    localStorage.removeItem('recruteur_remember');
    sessionStorage.clear();
    this.router.navigate(['/public/landing']);
  }

  onNewList(): void {
    this.router.navigate(['/public/bulk-upload']);
  }

  // ============================================
  // EXPORT
  // ============================================
  exportReport(): void {
    const data = this.filteredCandidates();
    if (!data || data.length === 0) {
      alert('Aucune donnée à exporter.');
      return;
    }

    this.isExporting.set(true);

    setTimeout(() => {
      try {
        const csv = this.convertToCSV(data);
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `rapport_verification_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.isExporting.set(false);
      } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        alert('Erreur lors de l\'export du rapport.');
        this.isExporting.set(false);
      }
    }, 500);
  }

  private convertToCSV(data: BulkCandidate[]): string {
    if (!data || data.length === 0) return '';

    const headers = ['UUID', 'Nom du candidat', 'Diplôme', 'Statut'];
    const rows = data.map(item => [
      item.uuid,
      item.name,
      item.diploma,
      item.status
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // ============================================
  // MENU MOBILE
  // ============================================
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
    document.body.style.overflow = this.isMobileMenuOpen() ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeMobileMenu();
    this.closeDetails();
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  // ============================================
  // AFFICHAGE DES STATUTS
  // ============================================
  getStatusLabel(status: string): string {
    switch (status) {
      case 'VALID': return 'Validé';
      case 'REVOKED': return 'Révoqué';
      case 'NOT_FOUND': return 'Inconnu';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'VALID': return 'valid';
      case 'REVOKED': return 'revoked';
      case 'NOT_FOUND': return 'unknown';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'VALID': return 'check_circle';
      case 'REVOKED': return 'cancel';
      case 'NOT_FOUND': return 'help';
      default: return 'circle';
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getRandomColor(name: string): string {
    const colors = [
      '#0b4d3a', '#1e3a8a', '#7c3aed', '#dc2626',
      '#d97706', '#059669', '#2563eb', '#9333ea'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
}