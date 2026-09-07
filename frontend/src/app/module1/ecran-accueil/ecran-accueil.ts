// src/app/module1/ecran-accueil/ecran-accueil.ts
import { Component, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
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
  private router = inject(Router);
  private mockService = inject(MockDataService);
  private darkModeService = inject(DarkModeService);
  private darkModeSubscription: Subscription = new Subscription();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Signaux pour l'état de l'interface
  searchQuery = signal('');
  lang = signal<'FR' | 'EN'>('FR');
  isDarkMode = signal(false);
  isMenuOpen = signal(false);
  isProcessing = signal(false);

  /**
   * Initialisation du composant
   * Récupère l'état du dark mode depuis le service
   */
  ngOnInit() {
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

  /**
   * Nettoyage du composant
   */
  ngOnDestroy() {
    this.darkModeSubscription.unsubscribe();
  }

  // ============================================
  // GESTION DU DARK MODE
  // ============================================

  /**
   * Bascule entre le mode clair et le mode sombre
   */
  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  // ============================================
  // GESTION DU MENU BURGER
  // ============================================

  /**
   * Ouvre ou ferme le menu burger
   * Bloquer le scroll quand le menu est ouvert
   */
  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
    if (this.isMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Ferme le menu burger
   * Réactive le scroll
   */
  closeMenu(): void {
    this.isMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  /**
   * Ferme le menu avec la touche Echap
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeMenu();
  }

  // ============================================
  // GESTION DE LA LANGUE
  // ============================================

  /**
   * Change la langue de l'interface
   * @param l - 'FR' ou 'EN'
   */
  setLang(l: 'FR' | 'EN'): void {
    this.lang.set(l);
  }

  // ============================================
  // GESTION DE LA RECHERCHE
  // ============================================

  /**
   * Soumet la recherche d'un certificat
   * Vérifie le certificat via le service mock
   * Redirige vers la page appropriée selon le résultat
   */
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

  /**
   * Ouvre la page de scan par caméra
   * Ferme le menu si ouvert
   */
  openCameraScan(): void {
    this.closeMenu();
    this.router.navigate(['/public/camera-scan']);
  }

  /**
   * Ouvre la page de scan OCR
   * Ferme le menu si ouvert
   */
  openOCRScan(): void {
    this.closeMenu();
    this.router.navigate(['/public/ocr-scan']);
  }

  /**
   * Navigue vers la page de vérification par lot
   * Ferme le menu si ouvert
   */
  navigateToBulk(): void {
    this.closeMenu();
    this.router.navigate(['/public/bulk-upload']);
  }

  // ============================================
  // NAVIGATION — NAVBAR
  // ============================================

  /**
   * Lien "Accueil" — mène vers la page landing
   */
  goToLanding(): void {
    this.closeMenu();
    this.router.navigate(['/public/landing']);
  }

  /**
   * Lien "Institutions"
   */
  goToInstitutions(): void {
    this.closeMenu();
    this.router.navigate(['/public/accueil']);
  }

  /**
   * Lien "Étudiants"
   */
  goToEtudiants(): void {
    this.closeMenu();
    this.router.navigate(['/public/accueil']);
  }

  /**
   * Lien "Recruteurs" — reste sur la page accueil
   */
  goToRecruteurs(): void {
    this.closeMenu();
    // Reste sur la page actuelle (ecran-accueil)
  }

  // ============================================
  // MÉTHODES UTILITAIRES
  // ============================================

  /**
   * Obtient la couleur du statut d'un certificat
   * @param status - Le statut du certificat
   * @returns La classe CSS correspondante
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'VALID': return 'bg-emerald-100 text-emerald-700';
      case 'REVOKED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  /**
   * Obtient la couleur du point de statut
   * @param status - Le statut du certificat
   * @returns La classe CSS correspondante
   */
  getStatusDot(status: string): string {
    switch (status) {
      case 'VALID': return 'bg-emerald-500';
      case 'REVOKED': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  }
}