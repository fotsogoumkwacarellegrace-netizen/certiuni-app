// src/app/module1/espaces-inscription/espaces-inscription.ts
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { DarkModeService } from '../../services/dark-mode';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { I18nService, Lang } from '../../services/i18n.service';
import { FlagIcon } from '../../shared/flag-icon/flag-icon';
import { BackButton } from '../../shared/ui/back-button';

type Tone = 'green' | 'gold' | 'blue';

interface Role {
  key: 'etudiant' | 'institution' | 'recruteur';
  icon: string;
  tone: Tone;
  /** Route Angular vers le formulaire d'inscription du module correspondant. */
  route: string;
}

interface Copy {
  back: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  haveAccount: string;
  goLogin: string;
  soon: string;
  theme: string;
  language: string;
  footer: string;
  roles: Record<Role['key'], { name: string; text: string }>;
}

const ROLES: Role[] = [
  { key: 'etudiant', icon: 'badge', tone: 'gold', route: '/student/register' },
  { key: 'recruteur', icon: 'manage_search', tone: 'blue', route: '/public/register' },
  { key: 'institution', icon: 'account_balance', tone: 'green', route: '/admin/inscription' },
];

const COPY: Record<Lang, Copy> = {
  FR: {
    back: 'Retour',
    eyebrow: 'Espaces CertiUni — Inscription',
    title: 'Créer votre compte',
    subtitle: 'Choisissez le profil qui vous correspond pour commencer votre inscription.',
    haveAccount: 'Déjà un compte ?',
    goLogin: 'Se connecter',
    soon: 'Cet espace sera bientôt disponible.',
    theme: 'Changer le thème',
    language: 'Changer la langue',
    footer: 'CertiUni Cameroun — Plateforme nationale de certification des diplômes',
    roles: {
      etudiant: {
        name: 'Étudiant',
        text: 'Accédez à vos diplômes, téléchargez vos attestations et payez en ligne.',
      },
      institution: {
        name: 'Institution',
        text: 'Back-office : créez, importez, émettez et révoquez vos diplômes.',
      },
      recruteur: {
        name: 'Recruteur',
        text: 'Vérifiez des diplômes, importez des lots CSV et scannez les QR codes.',
      },
    },
  },
  EN: {
    back: 'Back',
    eyebrow: 'CertiUni spaces — Registration',
    title: 'Create your account',
    subtitle: 'Choose the profile that matches you to start your registration.',
    haveAccount: 'Already have an account?',
    goLogin: 'Sign in',
    soon: 'This space will be available soon.',
    theme: 'Toggle theme',
    language: 'Change language',
    footer: 'CertiUni Cameroon — National diploma certification platform',
    roles: {
      etudiant: {
        name: 'Student',
        text: 'Access your diplomas, download your certificates and pay online.',
      },
      institution: {
        name: 'Institution',
        text: 'Back-office: create, import, issue and revoke your diplomas.',
      },
      recruteur: {
        name: 'Recruiter',
        text: 'Verify diplomas, import CSV batches and scan QR codes.',
      },
    },
  },
};

@Component({
  selector: 'app-espaces-inscription',
  standalone: true,
  imports: [CommonModule, DarkModeDirective, FlagIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<!-- src/app/module1/espaces-inscription/espaces-inscription.html -->
<div class="page" appDarkMode>

  <div class="glow glow--1" aria-hidden="true"></div>
  <div class="glow glow--2" aria-hidden="true"></div>

  <!-- ============ HEADER ============ -->
  <header class="top">
    <div class="top__inner">

      <button type="button" class="back" (click)="goBack()">
        <span class="material-symbols-outlined">arrow_back</span>
        <span>{{ c().back }}</span>
      </button>

      <a class="brand" href="#" (click)="$event.preventDefault(); goBack()" aria-label="CertiUni">
        <img src="images/logo.png" alt="" class="brand__logo" />
        <strong>CertiUni</strong>
      </a>

      <div class="tools">
        <button type="button" class="tool tool--lang" (click)="toggleLang()" [attr.aria-label]="c().language">
          <app-flag-icon [code]="lang()" />
          <b>{{ lang() }}</b>
        </button>
        <button type="button" class="tool tool--icon" (click)="toggleDarkMode()" [attr.aria-label]="c().theme">
          <span class="material-symbols-outlined">{{ isDarkMode() ? 'light_mode' : 'dark_mode' }}</span>
        </button>
      </div>
    </div>
  </header>

  <!-- ============ CONTENU ============ -->
  <main class="main">

    <span class="eyebrow">
      <i class="dot"></i>{{ c().eyebrow }}
    </span>

    <h1 class="title">{{ c().title }}</h1>
    <p class="subtitle">{{ c().subtitle }}</p>

    <div class="grid">
      @for (role of roles; track role.key; let i = $index) {
      <button type="button" class="card" [class]="'card tone-' + role.tone" [style.--i]="i"
        (click)="select(role)">
        <span class="card__icon">
          <span class="material-symbols-outlined">{{ role.icon }}</span>
        </span>
        <span class="card__name">{{ c().roles[role.key].name }}</span>
        <span class="card__text">{{ c().roles[role.key].text }}</span>
        <span class="card__cta">
          S'inscrire
          <span class="material-symbols-outlined">arrow_forward</span>
        </span>
      </button>
      }
    </div>

    <p class="login-link">
      {{ c().haveAccount }}
      <button type="button" class="login-link__btn" (click)="goToLogin()">
        {{ c().goLogin }}
      </button>
    </p>
  </main>

  <footer class="foot">
    <i class="dot"></i>{{ c().footer }}
  </footer>

  @if (toast()) {
  <div class="toast" role="status">
    <span class="material-symbols-outlined">info</span>
    {{ toast() }}
  </div>
  }
</div>`,
  styleUrls: ['./espaces-inscription.css'],
})
export class EspacesInscription {
  private readonly router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private toastTimer?: number;

  public readonly roles = ROLES;
  public readonly lang = this.i18n.lang;
  public readonly c = computed(() => COPY[this.i18n.lang()]);

  public readonly isDarkMode = toSignal(this.darkModeService.getDarkModeObservable(), {
    initialValue: this.darkModeService.isDarkMode$,
  });

  public readonly toast = signal('');

  constructor() {
    this.destroyRef.onDestroy(() => window.clearTimeout(this.toastTimer));
    console.log('EspacesInscription: roles array is', this.roles);
  }

  select(role: Role): void {
    if (role.route) {
      void this.router.navigate([role.route]);
      return;
    }
    this.showToast(`${this.c().roles[role.key].name} : ${this.c().soon}`);
  }

  goToLogin(): void {
    void this.router.navigate(['/public/espaces']);
  }

  goBack(): void {
    void this.router.navigate(['/public/landing']);
  }

  toggleLang(): void {
    this.i18n.toggleLang();
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  private showToast(message: string): void {
    this.toast.set(message);
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toast.set(''), 2600);
  }
}
