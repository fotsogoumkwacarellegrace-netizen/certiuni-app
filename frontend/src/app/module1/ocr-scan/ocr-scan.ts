// src/app/module1/ocr-scan/ocr-scan.ts
import { Component, inject, signal, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { DarkModeService } from '../../services/dark-mode';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { Subscription } from 'rxjs';
import { VerificationGateService } from '../../services/verification-gate.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-ocr-scan',
  standalone: true,
  imports: [CommonModule, RouterModule, DarkModeDirective],
  templateUrl: './ocr-scan.html',
  styleUrl: './ocr-scan.css'
})
export class OcrScan implements OnDestroy {
  private router = inject(Router);
  private mockService = inject(MockDataService);
  private darkModeService = inject(DarkModeService);
  private darkModeSubscription: Subscription = new Subscription();
  private gate = inject(VerificationGateService);
  readonly i18n = inject(I18nService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isDragging = signal(false);
  isScanning = signal(false);
  isDarkMode = signal(false);
  isMenuOpen = signal(false);

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

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
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

  processFile(file: File): void {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert(this.i18n.t('ocrErrorFormat'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(this.i18n.t('ocrErrorSize'));
      return;
    }

    if (!this.gate.ensureAllowance(1)) return;

    this.isScanning.set(true);

    this.mockService.simulateOCR(file).subscribe({
      next: async (result) => {
        try {
          await this.gate.verifyAndRoute(result.uuid);
        } finally {
          this.isScanning.set(false);
        }
      },
      error: () => {
        this.isScanning.set(false);
        alert(this.i18n.t('ocrErrorAnalysis'));
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/public/accueil']);
  }

  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
    document.body.style.overflow = this.isMenuOpen() ? 'hidden' : '';
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeMenu();
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}