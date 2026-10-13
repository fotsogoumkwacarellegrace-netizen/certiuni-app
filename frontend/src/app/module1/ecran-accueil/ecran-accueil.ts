// src/app/module1/ecran-accueil/ecran-accueil.ts
import {
  Component,
  inject,
  signal,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MockDataService } from '../../core/services/mock-data.service';
import { DarkModeService } from '../../services/dark-mode';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { ScrollToTopDirective } from '../../directives/scroll-to-top';

@Component({
  selector: 'app-ecran-accueil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DarkModeDirective,
    ScrollToTopDirective
  ],
  templateUrl: './ecran-accueil.html',
  styleUrl: './ecran-accueil.css'
})
export class EcranAccueil implements OnInit, OnDestroy {
  // ============================================
  // INJECTIONS
  // ============================================
  private router = inject(Router);
  private mockService = inject(MockDataService);
  private darkModeService = inject(DarkModeService);
  private darkModeSubscription: Subscription = new Subscription();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // ============================================
  // ÉTAT DE L'INTERFACE (Signaux)
  // ============================================
  searchQuery = signal('');
  lang = signal<'FR' | 'EN'>('FR');
  isDarkMode = signal(false);
  isMenuOpen = signal(false);
  isProcessing = signal(false);

  // ============================================
  // CYCLE DE VIE
  // ============================================
  ngOnInit(): void {
    this.isDarkMode.set(this.darkModeService.isDarkMode$);

    this.darkModeSubscription = this.darkModeService.getDarkModeObservable().subscribe(
      (isDark: boolean) => {
        this.isDarkMode.set(isDark);
        if (isDark) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.darkModeSubscription.unsubscribe();
  }

  // ============================================
  // DARK MODE
  // ============================================
  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  // ============================================
  // MENU MOBILE
  // ============================================
  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
    if (this.isMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeMenu();
  }

  // ============================================
  // LANGUE
  // ============================================
  setLang(l: 'FR' | 'EN'): void {
    this.lang.set(l);
  }

  // ============================================
  // RECHERCHE
  // ============================================
  onSearchSubmit(): void {
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

  // ============================================
  // NAVIGATION — CARTES DE LA PAGE
  // ============================================
  openCameraScan(): void {
    this.closeMenu();
    this.router.navigate(['/public/camera-scan']);
  }

  openOCRScan(): void {
    this.closeMenu();
    this.router.navigate(['/public/ocr-scan']);
  }

  navigateToBulk(): void {
    this.closeMenu();
    this.router.navigate(['/public/bulk-upload']);
  }

  // ============================================
  // NAVIGATION — NAVBAR (mêmes 6 liens que ocr-scan)
  // ============================================
  goToLanding(): void {
    this.closeMenu();
    this.router.navigate(['/public/landing']);
  }

  goToHistory(event: Event): void {
    event.preventDefault();
    alert('Historique — fonctionnalité bientôt disponible.');
  }

  goToSettings(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/public/settings']);
  }

  // ============================================
  // DÉCONNEXION
  // ============================================
  logout(): void {
    localStorage.removeItem('recruteur_user');
    localStorage.removeItem('recruteur_remember');
    sessionStorage.clear();
    this.router.navigate(['/public/landing']);
  }

  // ============================================
  // NAVIGATION — FOOTER
  // ============================================
  goToInstitutions(): void {
    this.closeMenu();
    this.router.navigate(['/public/accueil']);
  }

  goToEtudiants(): void {
    this.closeMenu();
    this.router.navigate(['/public/accueil']);
  }

  goToRecruteurs(): void {
    this.closeMenu();
  }

  // ============================================
  // UTILITAIRES
  // ============================================
  getStatusColor(status: string): string {
    switch (status) {
      case 'VALID': return 'bg-emerald-100 text-emerald-700';
      case 'REVOKED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusDot(status: string): string {
    switch (status) {
      case 'VALID': return 'bg-emerald-500';
      case 'REVOKED': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  }
}