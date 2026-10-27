import { Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DarkModeService } from '../../../services/dark-mode';

/**
 * En-tête original de la landing page, réutilisé sur les pages
 * de connexion / inscription administrateur d'institution.
 * Le balisage, les styles et les comportements sont identiques
 * à ceux de `module1/landing`.
 */
@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [],
  templateUrl: './landing-header.html',
  styleUrl: './landing-header.css'
})
export class LandingHeader implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);
  private darkModeSubscription: Subscription = new Subscription();

  readonly isDarkMode = signal(false);
  readonly isMenuOpen = signal(false);
  readonly lang = signal<'FR' | 'EN'>('FR');

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
    document.body.style.overflow = '';
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
    document.body.style.overflow = this.isMenuOpen() ? 'hidden' : '';
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
  // LANGUE
  // ============================================

  setLang(l: 'FR' | 'EN'): void {
    this.lang.set(l);
  }

  // ============================================
  // NAVIGATION
  // ============================================

  goToLanding(): void {
    this.closeMenu();
    this.router.navigate(['/public/landing']);
  }

  goToLogin(): void {
    this.closeMenu();
    this.router.navigate(['/public/connexion']);
  }

  goToInstitutions(): void {
    this.closeMenu();
    this.router.navigate(['/admin/login']);
  }

  goToEtudiants(): void {
    this.closeMenu();
    this.router.navigate(['/student/login']);
  }

  goToRecruteurs(): void {
    this.closeMenu();
    this.router.navigate(['/public/login']);
  }
}
