import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DiplomaCreationState } from '../services/diploma-creation-state';
import { REQUIRED_CSV_COLUMNS } from '../../assets/data/mock-data.admin';

@Component({
  selector: 'app-importer-diplomes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './importer-diplomes.html',
  styleUrl: './importer-diplomes.css'
})
export class ImporterDiplomes {
  private readonly router = inject(Router);
  private readonly state = inject(DiplomaCreationState);

  readonly requiredColumns = REQUIRED_CSV_COLUMNS;
  readonly selectedTemplate = this.state.selectedTemplate;
  readonly fileName = signal<string | null>(this.state.csvFileName());
  readonly fileError = signal<string | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.applyFile(input.files?.[0] ?? null);
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.applyFile(event.dataTransfer?.files?.[0] ?? null);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private applyFile(file: File | null): void {
    if (!file) {
      return;
    }
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    if (!isCsv) {
      this.fileError.set('Seuls les fichiers CSV sont acceptés.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.fileError.set('La taille du fichier ne doit pas dépasser 10 Mo.');
      return;
    }
    this.fileError.set(null);
    this.fileName.set(file.name);
    this.state.setCsvFile(file.name);
  }

  annuler(): void {
    this.router.navigate(['/admin/creer-diplomes']);
  }

  suivant(): void {
    if (!this.fileName()) {
      this.fileError.set('Veuillez importer un fichier CSV avant de continuer.');
      return;
    }
    this.state.runCsvValidation();
    this.router.navigate(['/admin/creer-diplomes/validation-csv']);
  }
}