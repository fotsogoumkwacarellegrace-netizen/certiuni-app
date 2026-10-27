
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Certificate } from '../../student-service/student.service';

// Ce que le Dashboard doit fournir en ouvrant ce tiroir
export interface PaymentHubData {
  certificate: Certificate;
}

// Ce que ce composant renvoie quand l'utilisateur choisit un mode de paiement
export type PaymentMethod = 'momo' | 'orange' | 'card';

@Component({
  selector: 'app-payment-hub',
  imports: [CommonModule , MatIconModule],
  styleUrl: './payment-hub.css',
  templateUrl: './payment-hub.html',
})
export class PaymentHub {
  private bottomSheetRef = inject(MatBottomSheetRef<PaymentHub, PaymentMethod>);
  data = inject<PaymentHubData>(MAT_BOTTOM_SHEET_DATA);

  // Frais fixe de délivrance (conforme au cahier des charges : 1000 FCFA)
  readonly amount = 25000;

  selectMethod(method: PaymentMethod) {
    // Ferme le tiroir et renvoie le choix au Dashboard,
    // qui décidera d'ouvrir l'Écran 15/16 correspondant
    this.bottomSheetRef.dismiss(method);
  }

  close() {
    this.bottomSheetRef.dismiss();
  }
}