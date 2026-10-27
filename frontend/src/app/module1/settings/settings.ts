// frontend/src/app/module1/settings/settings.ts
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DarkModeService } from '../../services/dark-mode';
import { I18nService } from '../../services/i18n.service';
import { Subscription } from 'rxjs';

type TabKey = 'general' | 'security' | 'notifications' | 'billing' | 'about';

interface TabDef {
  key: TabKey;
  labelKey: string;
  icon: string;
  badge?: string;
}

const TABS: TabDef[] = [
  { key: 'general',       labelKey: 'settingsGeneral',       icon: 'tune' },
  { key: 'security',      labelKey: 'settingsSecurity',      icon: 'security' },
  { key: 'notifications', labelKey: 'settingsNotifications', icon: 'notifications' },
  { key: 'billing',       labelKey: 'settingsBilling',       icon: 'payments', badge: '1' },
  { key: 'about',         labelKey: 'settingsAbout',         icon: 'info' }
];

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit, OnDestroy {
  private router = inject(Router);
  private darkModeService = inject(DarkModeService);
  private darkModeSubscription: Subscription = new Subscription();

  readonly i18n = inject(I18nService);
  readonly tabs = TABS;

  // UI State
  isDarkMode = signal(false);
  activeTab = signal<TabKey>('general');

  // ===== GENERAL =====
  platformName = 'CertiUni';
  defaultLanguage = 'fr';
  timezone = 'Africa/Douala';
  currency = 'XAF';

  // ===== SECURITY =====
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  twoFactorApp = false;
  twoFactorYubiKey = false;
  twoFactorSms = false;

  // ===== NOTIFICATIONS =====
  notifEmail = true;
  notifSecurity = true;
  notifPayments = true;
  notifCertificates = true;
  notifReports = false;

  // ===== BILLING =====
  billingPlan = 'Institutionnel';
  billingStatus = 'Actif';
  nextBillingDate = '15 Septembre 2026';
  nextBillingAmount = '25 000 FCFA';
  paymentMethod = 'mtn';
  billingPhone = '+237 6XX XXX XXX';
  billingAddress = 'Université de Douala, BP 2701 Douala';

  constructor() {
    this.isDarkMode.set(this.darkModeService.isDarkMode$);
    this.darkModeSubscription = this.darkModeService.getDarkModeObservable().subscribe(
      (isDark: boolean) => {
        this.isDarkMode.set(isDark);
        const host = document.querySelector('app-settings');
        if (host) {
          if (isDark) host.classList.add('dark-mode');
          else host.classList.remove('dark-mode');
        }
      }
    );
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  ngOnDestroy(): void {
    this.darkModeSubscription.unsubscribe();
  }

  // ============================================
  // ONGLETS
  // ============================================
  setActiveTab(tab: TabKey): void {
    this.activeTab.set(tab);
  }

  // ============================================
  // NAVIGATION
  // ============================================
  goBack(): void {
    this.router.navigate(['/public/accueil']);
  }

  // ============================================
  // PERSISTANCE
  // ============================================
  saveSettings(section: string): void {
    const btn = document.querySelector('.btn-primary');
    const originalText = btn?.textContent || this.i18n.t('settingsSave');

    if (btn) {
      btn.textContent = `⏳ ${this.i18n.t('settingsSaving')}`;
      btn.setAttribute('disabled', 'true');
    }

    setTimeout(() => {
      const settings = {
        platformName: this.platformName,
        defaultLanguage: this.defaultLanguage,
        timezone: this.timezone,
        currency: this.currency,
        twoFactorApp: this.twoFactorApp,
        twoFactorYubiKey: this.twoFactorYubiKey,
        twoFactorSms: this.twoFactorSms,
        paymentMethod: this.paymentMethod,
        billingPhone: this.billingPhone,
        billingAddress: this.billingAddress,
        notifEmail: this.notifEmail,
        notifSecurity: this.notifSecurity,
        notifPayments: this.notifPayments,
        notifCertificates: this.notifCertificates,
        notifReports: this.notifReports
      };

      localStorage.setItem('certiuni_settings', JSON.stringify(settings));

      if (btn) {
        btn.textContent = `✅ ${this.i18n.t('settingsSaved')}`;
        btn.removeAttribute('disabled');
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      }

      alert(`✅ ${section} — ${this.i18n.t('settingsSavedMsg')}`);
    }, 900);
  }

  loadSettings(): void {
    const saved = localStorage.getItem('certiuni_settings');
    if (!saved) return;
    try {
      const settings = JSON.parse(saved);
      Object.assign(this, settings);
    } catch (e) {
      console.error('Erreur lors du chargement des paramètres', e);
    }
  }

  resetSettings(section: string): void {
    if (!confirm(this.i18n.t('settingsResetConfirm'))) return;

    switch (section) {
      case 'general':
        this.platformName = 'CertiUni';
        this.defaultLanguage = 'fr';
        this.timezone = 'Africa/Douala';
        this.currency = 'XAF';
        break;
      case 'security':
        this.twoFactorApp = false;
        this.twoFactorYubiKey = false;
        this.twoFactorSms = false;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        break;
      case 'notifications':
        this.notifEmail = true;
        this.notifSecurity = true;
        this.notifPayments = true;
        this.notifCertificates = true;
        this.notifReports = false;
        break;
      case 'billing':
        this.paymentMethod = 'mtn';
        this.billingPhone = '+237 6XX XXX XXX';
        this.billingAddress = 'Université de Douala, BP 2701 Douala';
        break;
    }
    alert(`✅ ${this.i18n.t('settingsResetMsg')}`);
    this.saveSettings(section);
  }

  // ============================================
  // SÉCURITÉ
  // ============================================
  updatePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      alert(this.i18n.t('settingsPwdFillAll'));
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      alert(this.i18n.t('settingsPwdMismatch'));
      return;
    }
    if (this.newPassword.length < 8) {
      alert(this.i18n.t('settingsPwdTooShort'));
      return;
    }
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    alert(this.i18n.t('settingsPwdUpdated'));
  }

  logoutAllSessions(): void {
    if (confirm(this.i18n.t('settingsLogoutConfirm'))) {
      alert(this.i18n.t('settingsLogoutDone'));
    }
  }

  // ============================================
  // FACTURATION
  // ============================================
  viewInvoices(): void {
    alert(this.i18n.t('settingsInvoicesMsg'));
  }

  // ============================================
  // DARK MODE
  // ============================================
  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}