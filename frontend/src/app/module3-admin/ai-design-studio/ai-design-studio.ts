import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DiplomaCreationState } from '../services/diploma-creation-state';

@Component({
  selector: 'app-ai-design-studio',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './ai-design-studio.html',
  styleUrl: './ai-design-studio.css'
})
export class AiDesignStudio {
  private readonly router = inject(Router);
  private readonly state = inject(DiplomaCreationState);

  readonly description = signal('');
  readonly style = signal('Moderne');
  readonly couleurs = signal('Bleu');
  readonly format = signal('A4');
  readonly inclureQrCode = signal(true);
  readonly generating = signal(false);
  readonly versionActuelle = signal(1);

  readonly styles = ['Moderne', 'Classique', 'Institutionnel'];
  readonly palettes = ['Bleu', 'Vert', 'Bordeaux'];
  readonly formats = ['A4', 'Letter'];

  genererAvecIA(): void {
    this.generating.set(true);
    // TODO: remplacer par l'appel réel au service de génération de design (AI Design Studio).
    setTimeout(() => {
      this.generating.set(false);
      this.versionActuelle.update(v => v + 1);
    }, 900);
  }

  enregistrerDesign(): void {
    // TODO: persister le design généré côté backend une fois disponible.
    this.state.setTemplate({
      id: 'tpl-generated-' + Date.now(),
      intitule: 'Licence',
      filiere: 'Génie Logiciel',
      version: 'Design v' + this.versionActuelle(),
      dateMaj: new Date().toLocaleDateString('fr-FR')
    });
    this.router.navigate(['/admin/creer-diplomes/importer']);
  }
}