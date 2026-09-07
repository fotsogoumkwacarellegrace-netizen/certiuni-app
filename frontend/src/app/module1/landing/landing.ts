// frontend/src/app/module1/landing/landing.ts
import { Component, inject, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../../services/dark-mode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements OnInit, OnDestroy {
  private router = inject(Router);
  private darkModeService = inject(DarkModeService);
  private darkModeSubscription: Subscription = new Subscription();

  isDarkMode = signal(false);
  isMenuOpen = signal(false);

  ngOnInit() {
    // Récupérer l'état initial du dark mode
    this.isDarkMode.set(this.darkModeService.isDarkMode$);
    
    // S'abonner aux changements
    this.darkModeSubscription = this.darkModeService.getDarkModeObservable().subscribe(
      (isDark: boolean) => {
        this.isDarkMode.set(isDark);
        // Appliquer la classe sur l'host pour le dark mode
        const host = document.querySelector('app-landing');
        if (host) {
          if (isDark) {
            host.classList.add('dark-mode');
          } else {
            host.classList.remove('dark-mode');
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.darkModeSubscription.unsubscribe();
  }

  // ============================================
  // DARK MODE
  // ============================================

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  // ============================================
  // MENU BURGER
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
    if (this.isMenuOpen()) {
      this.closeMenu();
    }
  }

  // ============================================
  // NAVIGATION
  // ============================================

  // Bouton "Vérifier un diplôme" (header + hero)
  goToVerify(): void {
    this.router.navigate(['/public/accueil']);
  }

  // Bouton "Se connecter"
  goToLogin(): void {
    this.router.navigate(['/public/accueil']);
  }

  // Carte "Institutions"
  goToInstitutions(): void {
    this.router.navigate(['/public/accueil']);
  }

  // Carte "Étudiants"
  goToEtudiants(): void {
    this.router.navigate(['/public/accueil']);
  }


// Carte "Recruteurs"
goToRecruteurs(): void {
  // Rediriger vers la page de connexion recruteur
  this.router.navigate(['/public/login']);
}

  
 

}