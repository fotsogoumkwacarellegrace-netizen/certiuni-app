// src/app/core/services/bulk-session.service.ts
import { Injectable, signal } from '@angular/core';
import {BulkCandidate} from '../core/services/mock-data.service';


/**
 * Fait le pont entre la page d'upload (bulk-upload) et le rapport (bulk-table).
 * Le fichier est analysé une fois sur bulk-upload ; son résultat est conservé
 * ici pour que bulk-table l'affiche directement, sans re-générer des données.
 */
@Injectable({ providedIn: 'root' })
export class BulkSessionService {
  candidates = signal<BulkCandidate[] | null>(null);
  fileName = signal<string | null>(null);
  errors = signal<string[]>([]);
  processedAt = signal<Date | null>(null);

  setBatch(candidates: BulkCandidate[], fileName: string, errors: string[] = []): void {
    this.candidates.set(candidates);
    this.fileName.set(fileName);
    this.errors.set(errors);
    this.processedAt.set(new Date());
  }

  clear(): void {
    this.candidates.set(null);
    this.fileName.set(null);
    this.errors.set([]);
    this.processedAt.set(null);
  }

  hasBatch(): boolean {
    return this.candidates() !== null;
  }
}