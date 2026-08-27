// src/app/module1/ecran-accueil/ecran-accueil.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-ecran-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ecran-accueil.html',
  styleUrl: './ecran-accueil.css'
})
export class EcranAccueil {
  private router = inject(Router);
  private mockService = inject(MockDataService);

  searchQuery = signal('');
  lang = signal<'FR' | 'EN'>('FR');
  isDragging = signal(false);
  isProcessing = signal(false);
  showBulkResult = signal(false);

  onSearchSubmit() {
    const query = this.searchQuery().trim();
    if (!query || this.isProcessing()) return;

    this.isProcessing.set(true);

    this.mockService.verifyCertificate(query).subscribe({
      next: (result) => {
        this.isProcessing.set(false);
        switch (result.status) {
          case 'VALID':
            this.router.navigate(['/public/verify', query]);
            break;
          case 'REVOKED':
            this.router.navigate(['/public/verify/revoked', query]);
            break;
          case 'NOT_FOUND':
          default:
            this.router.navigate(['/public/verify/unknown', query]);
        }
      },
      error: () => {
        this.isProcessing.set(false);
        this.router.navigate(['/public/verify/unknown', query]);
      }
    });
  }

  setLang(l: 'FR' | 'EN') {
    this.lang.set(l);
  }

  openCameraScan() {
    this.router.navigate(['/public/camera-scan']);
  }

  openOCRScan() {
    this.router.navigate(['/public/ocr-scan']);
  }

  navigateToBulk() {
    this.router.navigate(['/public/bulk-table']);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processBulkFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processBulkFile(input.files[0]);
    }
  }

  processBulkFile(file: File) {
    this.isProcessing.set(true);
    this.mockService.processBulkFile(file).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.showBulkResult.set(true);
        setTimeout(() => this.navigateToBulk(), 1500);
      },
      error: () => {
        this.isProcessing.set(false);
        alert('Erreur lors du traitement du fichier');
      }
    });
  }
}