// frontend/src/app/module1/landing/landing.ts
import { Component, inject, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DarkModeService } from '../../services/dark-mode';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { ScrollToTopDirective } from '../../directives/scroll-to-top';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DarkModeDirective, ScrollToTopDirective],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements OnInit, OnDestroy {
  private router = inject(Router);
  private darkModeService = inject(DarkModeService);
  private darkModeSubscription: Subscription = new Subscription();

  isDarkMode = signal(false);
  isMenuOpen = signal(false);
  lang = signal<'FR' | 'EN'>('FR');

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
  // ACTIONS HERO
  // ============================================

  onVerifyClick(): void {
    this.closeMenu();
    this.router.navigate(['/public/accueil']);
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