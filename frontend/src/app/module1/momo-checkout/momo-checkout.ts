import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-momo-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './momo-checkout.html',
  styleUrl: './momo-checkout.css'
})
export class MomoCheckout implements OnInit, OnDestroy {
  private router = inject(Router);
  private mockService = inject(MockDataService);

  phoneNumber = signal('');
  isProcessing = signal(false);
  isSuccess = signal(false);
  selectedOperator = signal<'mtn' | 'orange' | null>(null);
  showOTP = signal(false);
  otpCode = signal('');
  countdown = signal(60);
  countdownInterval: any = null;
  transactionRef = signal('');
  returnUrl = signal('/public/accueil');
  redirectTimeout: any = null; // Pour stocker le timeout

  readonly amount = 2000;

  ngOnInit(): void {
    this.transactionRef.set('VER-' + Date.now().toString().slice(-8));
    
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { returnUrl?: string };
    
    if (state?.returnUrl) {
      this.returnUrl.set(state.returnUrl);
    }
    
    if (this.returnUrl() === '/public/accueil') {
      const savedUrl = localStorage.getItem('returnUrl');
      if (savedUrl) {
        this.returnUrl.set(savedUrl);
        localStorage.removeItem('returnUrl');
      }
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
      this.redirectTimeout = null;
    }
  }

  selectOperator(operator: 'mtn' | 'orange') {
    this.selectedOperator.set(operator);
  }

  onPay() {
    if (!this.phoneNumber() || this.phoneNumber().length < 9) {
      alert('Veuillez saisir un numéro de téléphone valide');
      return;
    }

    if (!this.selectedOperator()) {
      alert('Veuillez sélectionner un opérateur');
      return;
    }

    this.isProcessing.set(true);
    this.showOTP.set(true);
    this.countdown.set(60);

    this.countdownInterval = setInterval(() => {
      const current = this.countdown();
      if (current <= 1) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
        this.isProcessing.set(false);
        alert('Le délai de validation a expiré. Veuillez réessayer.');
        this.showOTP.set(false);
        this.countdown.set(60);
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);

    // Simuler la validation après 3 secondes
    setTimeout(() => {
      this.validateOTP();
    }, 3000);
  }

  validateOTP() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    this.isProcessing.set(false);
    this.isSuccess.set(true);
    this.showOTP.set(false);
    this.countdown.set(60);

    // SUPPRIMER LE REDIRECT AUTOMATIQUE
    // L'utilisateur reste sur la page de succès
    // Il clique sur le bouton pour revenir
  }

  resendOTP() {
    if (this.countdown() > 10) {
      alert('Veuillez patienter avant de renvoyer le code');
      return;
    }
    this.countdown.set(60);
    alert('Un nouveau code OTP a été envoyé');
  }

  goBack() {
    // Retourner à la page précédente (verdict-unknown)
    this.router.navigate([this.returnUrl()]);
  }

  goHome() {
    this.router.navigate(['/public/accueil']);
  }
}