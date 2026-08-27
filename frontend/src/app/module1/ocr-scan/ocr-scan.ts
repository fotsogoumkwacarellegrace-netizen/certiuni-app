import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-ocr-scan',
  standalone: true,
  imports: [],
  templateUrl: './ocr-scan.html',
  styleUrl: './ocr-scan.css'
})
export class OcrScan {
  private router = inject(Router);
  private mockService = inject(MockDataService);

  isDragging = signal(false);
  isScanning = signal(false);

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
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.processFile(input.files[0]);
  }

  processFile(file: File) {
    this.isScanning.set(true);
    this.mockService.simulateOCR(file).subscribe({
      next: (result) => {
        this.isScanning.set(false);
        this.router.navigate(['/public/verify', result.uuid]);
      },
      error: () => {
        this.isScanning.set(false);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/public/accueil']);
  }

  goToVerify() { this.router.navigate(['/public/accueil']); }
  goToBulk() { this.router.navigate(['/public/bulk-table']); }
  goToHistory() { /* écran non prioritaire */ }
  goToNewVerification() { this.router.navigate(['/public/accueil']); }
}