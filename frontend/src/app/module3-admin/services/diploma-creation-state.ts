import { Injectable, signal } from '@angular/core';
import {
  CsvValidationResult,
  DiplomaTemplate,
  MOCK_CSV_VALIDATION,
  MOCK_ETAPES_GENERATION,
  EtapeGeneration
} from '../../assets/data/mock-data.admin';

// État partagé entre creer-diplomes → importer-diplomes → validation-csv →
// generation-diplomes → validation-emission. Évite de faire transiter les
// données par des query params sur un flux à 5 étapes.
@Injectable({ providedIn: 'root' })
export class DiplomaCreationState {
  readonly selectedTemplate = signal<DiplomaTemplate | null>(null);
  readonly csvFileName = signal<string | null>(null);
  readonly csvValidation = signal<CsvValidationResult | null>(null);
  readonly etapesGeneration = signal<EtapeGeneration[]>([]);
  readonly generationTerminee = signal(false);

  setTemplate(template: DiplomaTemplate): void {
    this.selectedTemplate.set(template);
  }

  setCsvFile(fileName: string): void {
    this.csvFileName.set(fileName);
  }

  // TODO: remplacer par le résultat réel de l'API de validation du CSV.
  runCsvValidation(): void {
    this.csvValidation.set(MOCK_CSV_VALIDATION);
  }

  // TODO: remplacer par un suivi réel (WebSocket/polling) de la génération.
  startGeneration(): void {
    this.etapesGeneration.set(MOCK_ETAPES_GENERATION);
    this.generationTerminee.set(true);
  }

  reset(): void {
    this.selectedTemplate.set(null);
    this.csvFileName.set(null);
    this.csvValidation.set(null);
    this.etapesGeneration.set([]);
    this.generationTerminee.set(false);
  }
}