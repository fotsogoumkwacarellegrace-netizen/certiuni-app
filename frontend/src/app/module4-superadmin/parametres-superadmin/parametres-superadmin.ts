import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-parametres-superadmin',
  styleUrl: './parametres-superadmin.css',
  templateUrl: './parametres-superadmin.html',
})
export class ParametresSuperadmin {

  readonly notificationsActivees = signal(true);
  readonly authDeuxFacteurs = signal(false);
  readonly modeSombre = signal(false);
  readonly genererDiplomesOuvert = signal(false);

  readonly appareilsConnectes = 3; // TODO: remplacer par la liste réelle des sessions actives.
  readonly signatureFichier = signal('signature_recteur_uy1.p7s');
  readonly cachetFichier = signal('cachet_uy1.png');

  readonly showAide = signal(false);
  readonly showAPropos = signal(false);

  toggleNotifications(): void {
    this.notificationsActivees.update(v => !v);
  }

  toggleAuthDeuxFacteurs(): void {
    this.authDeuxFacteurs.update(v => !v);
  }

  toggleModeSombre(): void {
    // TODO: brancher sur le système de thème réel de l'application une fois disponible.
    this.modeSombre.update(v => !v);
  }

  toggleGenererDiplomes(): void {
    this.genererDiplomesOuvert.update(v => !v);
  }

  changerSignature(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.signatureFichier.set(file.name);
    }
  }

  changerCachet(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.cachetFichier.set(file.name);
    }
  }

  ouvrirAide(): void {
    this.showAide.set(true);
  }

  fermerAide(): void {
    this.showAide.set(false);
  }

  ouvrirAPropos(): void {
    this.showAPropos.set(true);
  }

  fermerAPropos(): void {
    this.showAPropos.set(false);
  }

}
