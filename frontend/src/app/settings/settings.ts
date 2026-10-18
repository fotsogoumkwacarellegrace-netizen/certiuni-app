import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { DarkModeService } from '../services/dark-mode';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  private router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);

  readonly isDarkMode = signal(this.darkModeService.isDarkMode$);
  readonly activeTab = signal('general');

  constructor() {
    this.darkModeService
      .getDarkModeObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((isDark: boolean) => this.isDarkMode.set(isDark));
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  goBack(): void {
    this.back();
  }

  back(): void {
    this.router.navigate(['/admin/mon-institution']);
  }

  envoyer(): void {
    alert('Envoi... (simulation)');
  }
}