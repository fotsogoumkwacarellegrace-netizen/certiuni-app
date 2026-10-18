import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackButton } from '../ui/back-button';

export interface Space {
  label: string;
  desc: string;
  icon: string;
  link: string;
  tone: 'green' | 'gold' | 'dark';
}

/**
 * Hub central « Se connecter » — oriente vers le login du module correspondant :
 * recruteur (module1), etudiant (module3), institution (module3-admin),
 * superadmin (module4).
 */
@Component({
  selector: 'app-connexion-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButton],
  templateUrl: './connexion-hub.html',
  styleUrl: './connexion-hub.css',
})
export class ConnexionHub {
  readonly spaces: Space[] = [
    {
      label: 'Recruteur',
      desc: 'Verifiez des diplomes, importez des lots CSV et scannez les QR codes.',
      icon: 'manage_search',
      link: '/public/login',
      tone: 'green',
    },
    {
      label: 'Etudiant',
      desc: 'Accedez a vos diplomes, telechargez vos attestations et payez en ligne.',
      icon: 'badge',
      link: '/student/login',
      tone: 'gold',
    },
    {
      label: 'Institution',
      desc: 'Back-office : creez, importez, emettez et revoquez vos diplomes.',
      icon: 'account_balance',
      link: '/admin/login',
      tone: 'green',
    },
    {
      label: 'Superadmin',
      desc: 'Administration nationale MINESUP : institutions, demandes et audit.',
      icon: 'verified_user',
      link: '/superadmin/login',
      tone: 'dark',
    },
  ];
}
