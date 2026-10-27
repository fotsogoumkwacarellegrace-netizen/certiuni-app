import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Certificate } from '../../student-service/student.service';
import { PaymentMethod } from '../payment-hub/payment-hub';
import { MatIconModule } from '@angular/material/icon';

export interface PaymentTunnelData {
  certificate: Certificate;
  method: PaymentMethod;
}

type TunnelStep = 'form' | 'processing' | 'receipt';

@Component({
  selector: 'app-payment-tunnel',
  imports: [CommonModule, FormsModule, MatIconModule],
  styleUrl: './payment-tunnel.css',
  templateUrl: './payment-tunnel.html',
})
export class PaymentTunnel implements OnDestroy {
  private dialogRef = inject(MatDialogRef<PaymentTunnel, boolean>);
  data = inject<PaymentTunnelData>(MAT_DIALOG_DATA);

  readonly amount = 25000;

  step = signal<TunnelStep>('form');

  phoneNumber = signal('');

  cardNumber = signal('');
  cardExpiry = signal('');
  cardCvv = signal('');

  otpCode = signal('');
  showOtpStep = signal(false);

  countdown = signal(60);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  transactionRef = signal('');

  get isMobileMoney(): boolean {
    return this.data.method === 'momo' || this.data.method === 'orange';
  }

  get operatorLabel(): string {
    return this.data.method === 'momo' ? 'MTN Mobile Money' : 'Orange Money';
  }

  submitPhone() {
    if (!this.phoneNumber().trim()) return;
    this.step.set('processing');
    this.startCountdown();
  }

  submitCard() {
    if (!this.cardNumber().trim() || !this.cardExpiry().trim() || !this.cardCvv().trim()) return;
    this.showOtpStep.set(true);
  }

  submitOtp() {
    if (!this.otpCode().trim()) return;
    this.finalizePayment();
  }

  back() {
    this.dialogRef.close(false);
  }

  private startCountdown() {
    this.countdown.set(60);
    this.countdownInterval = setInterval(() => {
      const current = this.countdown();
      if (current <= 55) {
        clearInterval(this.countdownInterval!);
        this.finalizePayment();
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);
  }

  private finalizePayment() {
    this.transactionRef.set('TXN-' + Math.floor(1000 + Math.random() * 9000) + '-AB');
    this.step.set('receipt');
  }

  closeAndConfirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}