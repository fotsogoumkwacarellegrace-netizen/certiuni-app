// src/app/module1/espaces/espaces.ts
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { DarkModeService } from '../../services/dark-mode';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { I18nService, Lang } from '../../services/i18n.service';
import { FlagIcon } from '../../shared/flag-icon/flag-icon';

type Tone = 'green' | 'gold' | 'blue';

interface Role {
  key: 'recruteur' | 'etudiant' | 'institution' | 'superadmin';
  icon: string;
  tone: Tone;
  /** Sans route : l'espace n'existe pas encore (toast « bientôt ») */
  route?: string;
}

interface Copy {
  back: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  noAccount: string;
  requestInstitution: string;
  soon: string;
  theme: string;
  language: string;
  footer: string;
  roles: Record<Role['key'], { name: string; text: string }>;
}

const ROLES: Role[] = [
  { key: 'recruteur', icon: 'manage_search', tone: 'green', route: '/public/login' },
  { key: 'etudiant', icon: 'badge', tone: 'gold' },
  { key: 'institution', icon: 'account_balance', tone: 'green' },
  { key: 'superadmin', icon: 'admin_panel_settings', tone: 'blue' }
];

const COPY: Record<Lang, Copy> = {
  FR: {
    back: 'Retour',
    eyebrow: 'Espaces CertiUni',
    title: 'Où souhaitez-vous vous connecter ?',
    subtitle: 'Chaque profil dispose de son propre espace sécurisé. Choisissez le vôtre.',
    cta: 'Se connecter',
    noAccount: 'Pas encore de compte institution ?',
    requestInstitution: 'Créer une demande d’inscription',
    soon: 'Cet espace sera bientôt disponible.',
    theme: 'Changer le thème',
    language: 'Changer la langue',
    footer: 'CertiUni Cameroun — Plateforme nationale de certification des diplômes',
    roles: {
      recruteur: {
        name: 'Recruteur',
        text: 'Vérifiez des diplômes, importez des lots CSV et scannez les QR codes.'
      },
      etudiant: {
        name: 'Étudiant',
        text: 'Accédez à vos diplômes, téléchargez vos attestations et payez en ligne.'
      },
      institution: {
        name: 'Institution',
        text: 'Back-office : créez, importez, émettez et révoquez vos diplômes.'
      },
      superadmin: {
        name: 'Superadmin',
        text: 'Administration nationale MINESUP : institutions, demandes et audit.'
      }
    }
  },
  EN: {
    back: 'Back',
    eyebrow: 'CertiUni spaces',
    title: 'Where would you like to sign in?',
    subtitle: 'Each profile has its own secure space. Choose yours.',
    cta: 'Sign in',
    noAccount: 'No institution account yet?',
    requestInstitution: 'Submit a registration request',
    soon: 'This space will be available soon.',
    theme: 'Toggle theme',
    language: 'Change language',
    footer: 'CertiUni Cameroon — National diploma certification platform',
    roles: {
      recruteur: {
        name: 'Recruiter',
        text: 'Verify diplomas, import CSV batches and scan QR codes.'
      },
      etudiant: {
        name: 'Student',
        text: 'Access your diplomas, download your certificates and pay online.'
      },
      institution: {
        name: 'Institution',
        text: 'Back-office: create, import, issue and revoke your diplomas.'
      },
      superadmin: {
        name: 'Superadmin',
        text: 'National MINESUP administration: institutions, requests and audit.'
      }
    }
  }
};

@Component({
  selector: 'app-espaces',
  standalone: true,
  imports: [DarkModeDirective, FlagIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './espaces.html',
  styleUrl: './espaces.css'
})
export class Espaces {
  private readonly router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private toastTimer?: number;

  readonly roles = ROLES;
  readonly lang = this.i18n.lang;
  readonly c = computed(() => COPY[this.i18n.lang()]);

  readonly isDarkMode = toSignal(this.darkModeService.getDarkModeObservable(), {
    initialValue: this.darkModeService.isDarkMode$
  });

  readonly toast = signal('');

  constructor() {
    this.destroyRef.onDestroy(() => window.clearTimeout(this.toastTimer));
  }

  select(role: Role): void {
    if (role.route) {
      void this.router.navigate([role.route]);
      return;
    }
    this.showToast(`${this.c().roles[role.key].name} : ${this.c().soon}`);
  }

  requestInstitution(): void {
    this.showToast(this.c().soon);
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