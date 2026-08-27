import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { DecimalPipe } from '@angular/common';

type Operator = 'MTN' | 'ORANGE' | null;

@Component({
  selector: 'app-momo-checkout',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './momo-checkout.html',
  styleUrl: './momo-checkout.css'
})
export class MomoCheckout {
  private router = inject(Router);
  private mockService = inject(MockDataService);

  phoneNumber = signal('');
  selectedOperator = signal<Operator>(null);
  isProcessing = signal(false);
  requestSent = signal(false);

  readonly auditAmount = 2000;

  selectOperator(op: Operator) {
    this.selectedOperator.set(op);
  }

  onSubmit() {
    const phone = this.phoneNumber().trim();
    if (!phone || phone.length < 9) return;

    this.isProcessing.set(true);
    this.mockService.processMobileMoneyPayment(phone, this.auditAmount).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.requestSent.set(true);
        setTimeout(() => this.onClose(), 2000);
      },
      error: () => {
        this.isProcessing.set(false);
      }
    });
  }

  onClose() {
    this.router.navigate(['/public/accueil']);
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('backdrop')) {
      this.onClose();
    }
  }
}