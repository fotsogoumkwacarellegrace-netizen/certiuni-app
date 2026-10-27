
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface DocumentOfficiel {
  nom: string;
  fichier: string;
  dateUpload: string;
}

@Component({
  selector: 'app-mon-institution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mon-institution.html',
  styleUrl: './mon-institution.css'
})
export class MonInstitution {
  private readonly router = inject(Router);

  institution = {
    nomOfficiel: 'Université de Yaoundé II',
    sigle: 'UY2',
    type: 'Université publique',
    dateCreation: '18/05/1992',
    statut: 'Validé par le MINESUP',

    domaineDns: 'uy2.cm',
    adresse: 'BP 812, Yaoundé, Cameroun',
    telephone: '+237 6 12 34 56 78',
    email: 'contact@uy2.cm',
    siteWeb: 'https://www.uy2.cm',

    representant: 'Pr. Jean Bosco NDO',
    fonction: 'Recteur',
    telephoneRepresentant: '+237 6 98 76 54 32',
    emailRepresentant: 'recteur@uy2.cm',
    logoImage: ''
  };

  documents: DocumentOfficiel[] = [
    {
      nom: "Rattachement à l'Université de Yaoundé II",
      fichier: 'documents/rattachement.pdf',
      dateUpload: '2026-01-15'
    },
    {
      nom: 'Justificatif de responsabilite juridique',
      fichier: 'documents/responsabilite.pdf',
      dateUpload: '2026-02-01'
    }
  ];

  get logo(): string | null {
    return this.institution.logoImage ?? null;
  }

  changerLogo(): void {
    // Ouvre la page dediee « Changer le logo » (aperçu + import de fichier)
    this.router.navigate(['/admin/mon-institution/changer-logo']);
  }

  modifierInstitution(): void {
    alert("Modele de modification de l'institution (simulation)");
  }
}

