import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DiplomaCreationState } from '../services/diploma-creation-state';
import { DiplomaTemplate, MOCK_DIPLOMA_TEMPLATES } from '../../assets/data/mock-data.admin';

@Component({
  selector: 'app-creer-diplomes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './creer-diplomes.html',
  styleUrl: './creer-diplomes.css',
})
export class CreerDiplomes {
  private readonly router = inject(Router);
  private readonly state = inject(DiplomaCreationState);

  readonly searchTerm = signal('');
  readonly templates = MOCK_DIPLOMA_TEMPLATES;

  readonly filteredTemplates = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.templates;
    }
    return this.templates.filter(
      (t) => t.filiere.toLowerCase().includes(term) || t.intitule.toLowerCase().includes(term),
    );
  });

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  utiliserModele(template: DiplomaTemplate): void {
    this.state.setTemplate(template);
    this.router.navigate(['/admin/creer-diplomes/importer']);
  }
}
