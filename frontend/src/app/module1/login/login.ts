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

  // Données du formulaire
  email = '';
  password = '';
  rememberMe = false;

  // État UI
  isDarkMode = signal(false);
  isLoading = signal(false);
  showPassword = signal(false);

  // État de validation
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
    // Ne redirige que si une session recruteur valide existe réellement.
    // Grâce au logout() corrigé ailleurs, cette clé est bien supprimée
    // à la déconnexion â€” donc ce contrôle redevient fiable.
    const user = localStorage.getItem('recruteur_user');
    if (user) {
      this.router.navigate(['/public/accueil']);
    }
  }

  ngOnDestroy() {
    this.darkModeSubscription.unsubscribe();
  }

  // ============================================
  // VALIDATION
  // ============================================

  isEmailValid(): boolean {
    const email = this.email?.trim() || '';
    return email.includes('@') && email.includes('.') && email.length > 3;
  }

  isPasswordValid(): boolean {
    return (this.password?.length || 0) >= 6;
  }

  isFormValid(): boolean {
    return this.isEmailValid() && this.isPasswordValid() && !this.isLoading();
  }

  onEmailChange(): void {
    if (this.isEmailValid()) {
      this.showEmailError.set(false);
    }
  }

  onPasswordChange(): void {
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
    this.showEmailError.set(false);
    this.showPasswordError.set(false);

    let hasError = false;

    if (!this.isEmailValid()) {
      this.showEmailError.set(true);
      hasError = true;
    }

    if (!this.isPasswordValid()) {
      this.showPasswordError.set(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

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
    this.router.navigate(['/public/bientot'], { queryParams: { page: 'Mot de passe oublie' } });
  }

  onRegister(): void {
    this.router.navigate(['/public/bientot'], { queryParams: { page: 'Creation de compte recruteur' } });
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}