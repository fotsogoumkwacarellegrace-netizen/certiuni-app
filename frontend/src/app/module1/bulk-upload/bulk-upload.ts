// src/app/module1/bulk-upload/bulk-upload.ts
import { Component, inject, signal, computed, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MockDataService, BulkCandidate } from '../../core/services/mock-data.service';
import { DarkModeService } from '../../services/dark-mode';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { Subscription } from 'rxjs';

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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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
    this.fileName.set(file.name);
    this.isProcessing.set(true);
    this.uploadComplete.set(false);

    this.mockService.processBulkFile(file).subscribe({
      next: (result) => {
        this.isProcessing.set(false);
        this.uploadComplete.set(true);
        this.processedCandidates.set(result.candidates);
        this.fileErrors.set(result.errors);
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
    alert('Paramètres — fonctionnalité bientôt disponible.');
  }

  goToSupport(): void {
    alert('Support — fonctionnalité bientôt disponible.');
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.router.navigate(['/public/accueil']);
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