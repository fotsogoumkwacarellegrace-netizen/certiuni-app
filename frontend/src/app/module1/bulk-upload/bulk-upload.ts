// src/app/module1/bulk-upload/bulk-upload.ts
import { Component, inject, signal, computed, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MockDataService, BulkCandidate } from '../../core/services/mock-data.service';
import { DarkModeService } from '../../services/dark-mode';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { Subscription } from 'rxjs';
import { VerificationGateService } from '../../services/verification-gate.service';
import{BillingService, isBillable} from '../../services/billing.service';
@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  imports: [CommonModule, RouterModule, DarkModeDirective],
  templateUrl: './bulk-upload.html',
  styleUrl: './bulk-upload.css'
})
export class BulkUpload implements OnDestroy {
  private router = inject(Router);
  private mockService = inject(MockDataService);
  private darkModeService = inject(DarkModeService);
  private darkModeSubscription: Subscription = new Subscription();
  private billing = inject(BillingService);
  private gate = inject(VerificationGateService);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  

  /** Renseigné quand le lot dépasse le solde disponible */
  paywall = signal<{ needed: number; missing: number } | null>(null);
  /** Nombre de vérifications débitées pour le lot en cours */
  chargedCount = signal(0);


  isDragging = signal(false);
  isProcessing = signal(false);
  uploadComplete = signal(false);
  isDarkMode = signal(false);
  isMobileMenuOpen = signal(false);
  fileName = signal('');
  processedCandidates = signal<BulkCandidate[]>([]);
  fileErrors = signal<string[]>([]);

  totalValid = computed(() => this.processedCandidates().filter(c => c.status === 'VALID').length);
  totalRevoked = computed(() => this.processedCandidates().filter(c => c.status === 'REVOKED').length);
  totalUnknown = computed(() => this.processedCandidates().filter(c => c.status === 'NOT_FOUND').length);

  constructor() {
    this.isDarkMode.set(this.darkModeService.isDarkMode$);
    this.darkModeSubscription = this.darkModeService.getDarkModeObservable().subscribe(
      (isDark: boolean) => {
        this.isDarkMode.set(isDark);
      }
    );
  }

  ngOnDestroy(): void {
    this.darkModeSubscription.unsubscribe();
  }

  // ============================================
  // DRAG & DROP
  // ============================================

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  // ============================================
  // TRAITEMENT DU FICHIER
  // ============================================

processFile(file: File): void {
  // Plus rien de disponible : inutile d'analyser
  if (!this.gate.ensureAllowance(1)) return;

  this.fileName.set(file.name);
  this.isProcessing.set(true);
  this.uploadComplete.set(false);
  this.paywall.set(null);

  this.mockService.processBulkFile(file).subscribe({
    next: (result) => {
      this.isProcessing.set(false);
      this.fileErrors.set(result.errors);

      // Seuls les verdicts Valide / Révoqué sont facturés
      const needed = result.candidates.filter(c => isBillable(c.status)).length;

      if (!this.billing.canAfford(needed)) {
        this.paywall.set({ needed, missing: needed - this.billing.available() });
        return;
      }

      this.billing.consume(needed, `Lot · ${file.name}`);
      this.chargedCount.set(needed);
      this.processedCandidates.set(result.candidates);
      this.uploadComplete.set(true);
    },
    error: () => {
      this.isProcessing.set(false);
      alert('Erreur lors du traitement du fichier.');
    }
  });
}

onReset(): void {
  this.uploadComplete.set(false);
  this.fileName.set('');
  this.processedCandidates.set([]);
  this.fileErrors.set([]);
  this.paywall.set(null);
  this.chargedCount.set(0);
}

buyMissing(): void {
  this.gate.goToCheckout(this.paywall()?.missing ?? 1);
}

  onViewResults(): void {
    this.router.navigate(['/public/bulk-table']);
  }

  // ============================================
  // NAVIGATION — NAVBAR
  // ============================================

  goToHistory(event: Event): void {
    event.preventDefault();
    alert('Historique — fonctionnalité bientôt disponible.');
  }
goToSettings(event: Event): void {
  event.preventDefault();
  this.router.navigate(['/public/settings']);
}

  goToSupport(): void {
    alert('Support — fonctionnalité bientôt disponible.');
  }


  logout(): void {
    localStorage.removeItem('recruteur_user');
    localStorage.removeItem('recruteur_remember');
    sessionStorage.clear();
    this.router.navigate(['/public/landing']);
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
  }

  // ============================================
  // DARK MODE
  // ============================================

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}