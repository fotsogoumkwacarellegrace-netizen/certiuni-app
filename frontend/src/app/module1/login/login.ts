// frontend/src/app/module1/login/login.ts
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DarkModeService } from '../../services/dark-mode';
import { I18nService } from '../../services/i18n.service';
import { Subscription } from 'rxjs';

type View = 'login' | 'register' | 'forgot';
type Provider = 'google' | 'facebook';

interface StoredUser {
  name: string;
  email: string;
  passwordHash: string;
}

const USERS_KEY = 'certiuni_users';
const SESSION_KEY = 'recruteur_user';
const REMEMBER_KEY = 'recruteur_remember';
const LAST_EMAIL_KEY = 'recruteur_last_email';

const DEMO = {
  name: 'Recruteur Démo',
  email: 'recruteur@certiuni.cm',
  password: 'Recruteur123'
};

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

  /** Service i18n — accessible depuis le template */
  readonly i18n = inject(I18nService);

  readonly demoEmail = DEMO.email;
  readonly demoPassword = DEMO.password;

  email = '';
  password = '';
  rememberMe = false;

  regName = '';
  regEmail = '';
  regPassword = '';
  regConfirm = '';
  acceptTerms = false;

  forgotEmail = '';

  view = signal<View>('login');
  isDarkMode = signal(false);
  isLoading = signal(false);
  showPassword = signal(false);
  submitted = signal(false);
  formError = signal('');
  notice = signal('');
  forgotSent = signal(false);
  socialLoading = signal<Provider | null>(null);

  constructor() {
    this.isDarkMode.set(this.darkModeService.isDarkMode$);
    this.darkModeSubscription = this.darkModeService.getDarkModeObservable().subscribe(
      (isDark: boolean) => {
        this.isDarkMode.set(isDark);
        const host = document.querySelector('app-login');
        if (host) {
          host.classList.toggle('dark-mode', isDark);
        }
      }
    );
  }

  ngOnInit(): void {
    const user = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
    if (user) {
      this.router.navigate(['/public/accueil']);
      return;
    }

    const lastEmail = localStorage.getItem(LAST_EMAIL_KEY);
    if (lastEmail) {
      this.email = lastEmail;
      this.rememberMe = true;
    }
  }

  ngOnDestroy(): void {
    this.darkModeSubscription.unsubscribe();
  }

  setView(view: View): void {
    this.view.set(view);
    this.submitted.set(false);
    this.formError.set('');
    this.notice.set('');
    this.forgotSent.set(false);
    this.showPassword.set(false);
  }

  goBack(): void {
    this.router.navigate(['/public/landing']);
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  isEmailValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((value ?? '').trim());
  }

  isLoginPasswordValid(): boolean {
    return this.password.length >= 6;
  }

  isRegPasswordValid(): boolean {
    const p = this.regPassword;
    return p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p);
  }

  passwordStrength(): { score: number; label: string } {
    const p = this.regPassword;
    if (!p) return { score: 0, label: '' };

    let score = 0;
    if (p.length >= 8) score++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p) || p.length >= 12) score++;

    const labels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Excellent'];
    return { score, label: labels[score] };
  }

  async onSubmit(): Promise<void> {
    this.submitted.set(true);
    this.formError.set('');
    this.notice.set('');

    if (!this.isEmailValid(this.email) || !this.isLoginPasswordValid()) return;

    this.isLoading.set(true);
    await this.wait(900);

    const email = this.email.trim().toLowerCase();
    let name: string | null = null;

    if (email === DEMO.email && this.password === DEMO.password) {
      name = DEMO.name;
    } else {
      const user = this.findUser(email);
      if (user && user.passwordHash === (await this.hash(email, this.password))) {
        name = user.name;
      }
    }

    this.isLoading.set(false);

    if (!name) {
      this.formError.set('Email ou mot de passe incorrect.');
      return;
    }

    this.startSession(name, email);
  }

  useDemoAccount(): void {
    this.email = DEMO.email;
    this.password = DEMO.password;
    this.submitted.set(false);
    this.formError.set('');
  }

  async onRegister(): Promise<void> {
    this.submitted.set(true);
    this.formError.set('');

    const valid =
      this.regName.trim().length >= 2 &&
      this.isEmailValid(this.regEmail) &&
      this.isRegPasswordValid() &&
      this.regPassword === this.regConfirm &&
      this.acceptTerms;

    if (!valid) return;

    const email = this.regEmail.trim().toLowerCase();

    if (email === DEMO.email || this.findUser(email)) {
      this.formError.set('Un compte existe déjà avec cette adresse email.');
      return;
    }

    this.isLoading.set(true);
    await this.wait(1000);

    const users = this.readUsers();
    users.push({
      name: this.regName.trim(),
      email,
      passwordHash: await this.hash(email, this.regPassword)
    });
    this.writeUsers(users);

    this.isLoading.set(false);

    this.email = email;
    this.password = '';
    this.regName = this.regEmail = this.regPassword = this.regConfirm = '';
    this.acceptTerms = false;
    this.setView('login');
    this.notice.set('Compte créé avec succès. Vous pouvez vous connecter.');
  }

  async onForgot(): Promise<void> {
    this.submitted.set(true);
    this.formError.set('');

    if (!this.isEmailValid(this.forgotEmail)) return;

    this.isLoading.set(true);
    await this.wait(1000);
    this.isLoading.set(false);

    this.forgotSent.set(true);
  }

  async onSocialLogin(provider: Provider): Promise<void> {
    if (this.socialLoading() || this.isLoading()) return;

    this.formError.set('');
    this.socialLoading.set(provider);
    await this.wait(1100);
    this.socialLoading.set(null);

    const label = provider === 'google' ? 'Google' : 'Facebook';
    this.startSession(`Utilisateur ${label}`, `${provider}.user@certiuni.cm`);
  }

  private startSession(name: string, email: string): void {
    const session = JSON.stringify({
      name,
      email,
      role: 'recruteur',
      loginTime: new Date().toISOString()
    });

    if (this.rememberMe) {
      localStorage.setItem(SESSION_KEY, session);
      localStorage.setItem(REMEMBER_KEY, 'true');
      localStorage.setItem(LAST_EMAIL_KEY, email);
    } else {
      sessionStorage.setItem(SESSION_KEY, session);
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem(LAST_EMAIL_KEY);
    }

    this.router.navigate(['/public/accueil']);
  }

  private readUsers(): StoredUser[] {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as StoredUser[];
    } catch {
      return [];
    }
  }

  private writeUsers(users: StoredUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private findUser(email: string): StoredUser | undefined {
    return this.readUsers().find((u) => u.email === email);
  }

  private async hash(email: string, password: string): Promise<string> {
    const data = new TextEncoder().encode(`${email}:${password}`);
    const buffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}