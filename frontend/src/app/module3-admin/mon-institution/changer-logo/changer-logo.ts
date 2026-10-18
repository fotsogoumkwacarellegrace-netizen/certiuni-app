import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DarkModeService } from '../../../services/dark-mode';

/**
 * Page "Changer le logo" (Module 3 admin) : apercu du logo courant,
 * import d'un nouveau fichier (png/jpg/svg) et envoi (simulation).
 */
@Component({
  selector: 'app-changer-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './changer-logo.html',
  styleUrl: './changer-logo.css',
})
export class ChangerLogo {
  private readonly router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);

  readonly isDarkMode = signal(this.darkModeService.isDarkMode$);
  readonly uploading = signal(false);
  readonly logoPreview = signal<string | null>(null);
  readonly fileName = signal('');

  constructor() {
    this.darkModeService
      .getDarkModeObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((isDark: boolean) => this.isDarkMode.set(isDark));
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.fileName.set(file.name);
    const reader = new FileReader();
    reader.onload = () => this.logoPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  envoyer(): void {
    if (!this.logoPreview()) {
      alert('Veuillez d\u00e9abord selectionner un fichier logo.');
      return;
    }
    this.uploading.set(true);
    setTimeout(() => {
      this.uploading.set(false);
      alert('Logo envoye avec succes ! (simulation)');
      this.router.navigate(['/admin/mon-institution']);
    }, 600);
  }

  back(): void {
    this.router.navigate(['/admin/mon-institution']);
  }
}