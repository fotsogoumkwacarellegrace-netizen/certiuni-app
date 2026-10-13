import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DocumentOfficiel {
  nom: string;
  fichier: string;
  dateUpload: string;
}

@Component({
  selector: 'app-mon-institution',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mon-institution.html',
  styleUrl: './mon-institution.css'
})
export class MonInstitution {

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
    emailRepresentant: 'recteur@uy2.cm'
  };

  documents: DocumentOfficiel[] = [
    {
      nom: 'Décret ministériel',
      fichier: 'decret_uy2_2026.pdf',
      dateUpload: '10/09/2026'
    },
    
    {
      nom: 'Signature numérique du représentant légal',
      fichier: 'signature_recteur_uy2.pdf',
      dateUpload: '10/09/2026'
    }
  ];

  changerLogo(): void {
    // À connecter plus tard à l'upload réel du logo.
    console.log('Changer le logo');
  }

  modifierInstitution(): void {
    console.log('Modification de l’institution');
  }

  voirDocument(document: DocumentOfficiel): void {
    console.log('Voir le document :', document.fichier);
  }

  telechargerDocument(document: DocumentOfficiel): void {
    console.log('Télécharger le document :', document.fichier);
  }
}