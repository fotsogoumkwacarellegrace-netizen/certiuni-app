// frontend/src/app/module1/login/login.ts
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DarkModeService } from '../../services/dark-mode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {
  private router = inject(Router);
  private darkModeService = inject(DarkModeService);
  private darkModeSubscription: Subscription = new Subscription();

  // Données du formulaire - PRÉ-REMPLIES POUR LE TEST
  email = '';
  password = '';
  rememberMe = false;

  // État UI
  isDarkMode = signal(false);
  isLoading = signal(false);
  showPassword = signal(false);

  // État de validation - Faux par défaut
  showEmailError = signal(false);
  showPasswordError = signal(false);

  constructor() {
    this.isDarkMode.set(this.darkModeService.isDarkMode$);
    this.darkModeSubscription = this.darkModeService.getDarkModeObservable().subscribe(
      (isDark: boolean) => {
        this.isDarkMode.set(isDark);
        const host = document.querySelector('app-login');
        if (host) {
          if (isDark) host.classList.add('dark-mode');
          else host.classList.remove('dark-mode');
        }
      }
    );
  }

  ngOnInit() {
    const user = localStorage.getItem('recruteur_user');
    if (user) {
      this.router.navigate(['/public/accueil']);
    }
  }

  ngOnDestroy() {
    this.darkModeSubscription.unsubscribe();
  }

  // ============================================
  // VALIDATION - FONCTIONS PUBLIQUES
  // ============================================

  isEmailValid(): boolean {
    const email = this.email?.trim() || '';
    // Accepte les emails avec @ et .
    return email.includes('@') && email.includes('.') && email.length > 3;
  }

  isPasswordValid(): boolean {
    return (this.password?.length || 0) >= 6;
  }

  isFormValid(): boolean {
    return this.isEmailValid() && this.isPasswordValid() && !this.isLoading();
  }

  // ============================================
  // GESTION DES CHAMPS - RESET DES ERREURS
  // ============================================

  onEmailChange(): void {
    // Si l'email devient valide, on cache l'erreur immédiatement
    if (this.isEmailValid()) {
      this.showEmailError.set(false);
    }
  }

  onPasswordChange(): void {
    // Si le mot de passe devient valide, on cache l'erreur immédiatement
    if (this.isPasswordValid()) {
      this.showPasswordError.set(false);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  // ============================================
  // SOUMISSION
  // ============================================

  onSubmit(): void {
    // Réinitialiser les erreurs avant de valider
    this.showEmailError.set(false);
    this.showPasswordError.set(false);

    // Vérifier les champs un par un
    let hasError = false;

    if (!this.isEmailValid()) {
      this.showEmailError.set(true);
      hasError = true;
    }

    if (!this.isPasswordValid()) {
      this.showPasswordError.set(true);
      hasError = true;
    }

    // Si une erreur, on arrête
    if (hasError) {
      return;
    }

    // Connexion
    this.isLoading.set(true);

    setTimeout(() => {
      const userData = {
        email: this.email,
        role: 'recruteur',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('recruteur_user', JSON.stringify(userData));
      if (this.rememberMe) {
        localStorage.setItem('recruteur_remember', 'true');
      }
      this.isLoading.set(false);
      // Réinitialiser les erreurs
      this.showEmailError.set(false);
      this.showPasswordError.set(false);
      this.router.navigate(['/public/accueil']);
    }, 1500);
  }

  // ============================================
  // NAVIGATION
  // ============================================

  goBack(): void {
    this.router.navigate(['/public/landing']);
  }

  onForgotPassword(): void {
    alert('Réinitialisation du mot de passe - bientôt disponible.');
  }

  onRegister(): void {
    alert('Création de compte - bientôt disponible.');
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}