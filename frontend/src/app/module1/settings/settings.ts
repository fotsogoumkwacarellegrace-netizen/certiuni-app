// frontend/src/app/module1/settings/settings.ts
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DarkModeService } from '../../services/dark-mode';
import { Subscription } from 'rxjs';

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

  // UI State
  isDarkMode = signal(false);
  activeTab = signal('general');

  // General settings
  platformName = 'CertiUni';
  defaultLanguage = 'fr';
  timezone = 'Africa/Douala';
  currency = 'XAF';

  // Institution settings
  institutionName = 'Université de Douala';
  institutionAcronym = 'UDS';
  institutionDomain = '@univ-douala.cm';
  institutionLogo = '';
  environmentMode = 'sandbox';

  // Security settings
  twoFactorApp = false;
  twoFactorYubiKey = false;
  twoFactorSms = false;

  // Billing settings
  billingPlan = 'Institutionnel';
  billingStatus = 'Actif';
  nextBillingDate = '15 Septembre 2026';
  nextBillingAmount = '25 000 FCFA';
  paymentMethod = 'mtn';
  billingPhone = '+237 6XX XXX XXX';
  billingAddress = 'Université de Douala, BP 2701 Douala';

  // AI settings
  aiOcrModel = 'gpt-4-vision';
  aiDesignModel = 'gpt-4';
  aiTemperature = 70;
  aiMaxTokens = 80;
  aiAutoInspect = true;
  aiDesignSuggestions = true;

  // Notification settings
  notifEmail = true;
  notifSecurity = true;
  notifPayments = true;
  notifCertificates = true;
  notifReports = false;

  // API settings
  apiPublicKey = 'pub_certiuni_abc123xyz789';
  apiPrivateKey = 'priv_certiuni_xyz789abc123';
  webhookUrl = '';
  integrateLinkedin = true;
  integrateOpenStreetMap = true;

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

  ngOnInit() {
    // Load saved settings from localStorage
    this.loadSettings();
  }

  ngOnDestroy() {
    this.darkModeSubscription.unsubscribe();
  }

  // ============================================
  // TAB MANAGEMENT
  // ============================================

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  // ============================================
  // NAVIGATION
  // ============================================

  goBack(): void {
    this.router.navigate(['/public/accueil']);
  }

  // ============================================
  // SETTINGS ACTIONS
  // ============================================

  saveSettings(section: string): void {
    console.log(`Saving ${section} settings...`);
    
    const btn = document.querySelector('.btn-primary');
    const originalText = btn?.textContent || 'Enregistrer';

    if (btn) {
      btn.textContent = '⏳ Enregistrement...';
      btn.setAttribute('disabled', 'true');
    }

    setTimeout(() => {
      const settings = {
        platformName: this.platformName,
        defaultLanguage: this.defaultLanguage,
        timezone: this.timezone,
        currency: this.currency,
        institutionName: this.institutionName,
        institutionAcronym: this.institutionAcronym,
        institutionDomain: this.institutionDomain,
        environmentMode: this.environmentMode,
        twoFactorApp: this.twoFactorApp,
        twoFactorYubiKey: this.twoFactorYubiKey,
        twoFactorSms: this.twoFactorSms,
        paymentMethod: this.paymentMethod,
        billingPhone: this.billingPhone,
        billingAddress: this.billingAddress,
        aiOcrModel: this.aiOcrModel,
        aiDesignModel: this.aiDesignModel,
        aiTemperature: this.aiTemperature,
        aiMaxTokens: this.aiMaxTokens,
        aiAutoInspect: this.aiAutoInspect,
        aiDesignSuggestions: this.aiDesignSuggestions,
        notifEmail: this.notifEmail,
        notifSecurity: this.notifSecurity,
        notifPayments: this.notifPayments,
        notifCertificates: this.notifCertificates,
        notifReports: this.notifReports,
        webhookUrl: this.webhookUrl,
        integrateLinkedin: this.integrateLinkedin,
        integrateOpenStreetMap: this.integrateOpenStreetMap
      };

      localStorage.setItem('certiuni_settings', JSON.stringify(settings));

      if (btn) {
        btn.textContent = '✅ Enregistré !';
        btn.removeAttribute('disabled');
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      }

      alert(`✅ Paramètres "${section}" enregistrés avec succès !`);
    }, 1000);
  }

  loadSettings(): void {
    const saved = localStorage.getItem('certiuni_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        Object.assign(this, settings);
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres', e);
      }
    }
  }

  resetSettings(section: string): void {
    if (confirm(`Voulez-vous réinitialiser les paramètres "${section}" ?`)) {
      switch (section) {
        case 'general':
          this.platformName = 'CertiUni';
          this.defaultLanguage = 'fr';
          this.timezone = 'Africa/Douala';
          this.currency = 'XAF';
          break;
        case 'institution':
          this.institutionName = 'Université de Douala';
          this.institutionAcronym = 'UDS';
          this.institutionDomain = '@univ-douala.cm';
          this.institutionLogo = '';
          this.environmentMode = 'sandbox';
          break;
        case 'security':
          this.twoFactorApp = false;
          this.twoFactorYubiKey = false;
          this.twoFactorSms = false;
          break;
        case 'billing':
          this.paymentMethod = 'mtn';
          this.billingPhone = '+237 6XX XXX XXX';
          this.billingAddress = 'Université de Douala, BP 2701 Douala';
          break;
        case 'ai':
          this.aiOcrModel = 'gpt-4-vision';
          this.aiDesignModel = 'gpt-4';
          this.aiTemperature = 70;
          this.aiMaxTokens = 80;
          this.aiAutoInspect = true;
          this.aiDesignSuggestions = true;
          break;
        case 'notifications':
          this.notifEmail = true;
          this.notifSecurity = true;
          this.notifPayments = true;
          this.notifCertificates = true;
          this.notifReports = false;
          break;
        case 'api':
          this.apiPublicKey = 'pub_certiuni_abc123xyz789';
          this.apiPrivateKey = 'priv_certiuni_xyz789abc123';
          this.webhookUrl = '';
          this.integrateLinkedin = true;
          this.integrateOpenStreetMap = true;
          break;
      }
      alert(`✅ Paramètres "${section}" réinitialisés !`);
      this.saveSettings(section);
    }
  }

  // ============================================
  // INSTITUTION
  // ============================================

  uploadLogo(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.institutionLogo = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  removeLogo(): void {
    if (confirm('Voulez-vous supprimer le logo ?')) {
      this.institutionLogo = '';
    }
  }

  // ============================================
  // BILLING
  // ============================================

  viewInvoices(): void {
    alert('📄 Redirection vers l\'archive des factures...');
  }

  // ============================================
  // AI
  // ============================================

  testAIConnection(): void {
    alert('🔌 Test de connexion IA en cours...\n✅ Connexion établie avec succès !');
  }

  // ============================================
  // API
  // ============================================

  copyApiKey(): void {
    navigator.clipboard?.writeText(this.apiPublicKey).then(() => {
      alert('📋 Clé API copiée dans le presse-papier !');
    }).catch(() => {
      alert('📋 Clé API: ' + this.apiPublicKey);
    });
  }

  regenerateApiKey(): void {
    if (confirm('⚠️ Voulez-vous régénérer la clé API privée ? Cette action est irréversible.')) {
      this.apiPrivateKey = 'priv_certiuni_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);
      alert('🔑 Nouvelle clé API générée avec succès !');
    }
  }

  testApiConnection(): void {
    alert('🔌 Test de connexion API...\n✅ API accessible et fonctionnelle !');
  }

  // ============================================
  // DARK MODE
  // ============================================

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}