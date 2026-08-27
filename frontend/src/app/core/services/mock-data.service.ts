// frontend/src/app/core/services/mock-data.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// ============ INTERFACES ============
export interface Grade {
  matiere: string;
  note: number;
  semestre: string;
  credits: number;
}

export interface Certificate {
  id: string;
  course_title: string;
  university_name: string;
  final_grade: string;
  issue_date: string;
  certificat_hash: string;
  payment_state: 'PENDING' | 'PAID' | 'EXEMPTED';
  pdf_url: string | null;
  notes?: Grade[]; // ← ajoute cette ligne
}
export interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  certificates: Certificate[];
}

export interface BulkCandidate {
  uuid: string;
  name: string;
  diploma: string;
  status: 'VALID' | 'REVOKED' | 'NOT_FOUND';
}

export interface VerificationLog {
  time: string;
  diploma: string;
  student: string;
  status: string;
  location: string;
}

export interface VerificationResult {
  status: 'VALID' | 'REVOKED' | 'NOT_FOUND';
  data?: { student: Student; certificate: Certificate; };
  studentName?: string; // ← ajoute cette ligne
  message?: string;
}

// ============ SERVICE ============
@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Données mock
  private students: Student[] = [
    {
      id: 'stud-ngo-89',
      email: 'marie.ngo@univ-douala.cm',
      first_name: 'Marie',
      last_name: 'Ngo',
      certificates: [
        {
            id: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
            course_title: 'Master en Génie Logiciel',
            university_name: 'Université de Douala',
            final_grade: '16.5/20 (Mention Très Bien)',
            issue_date: '2026-07-15',
            certificat_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            payment_state: 'PAID',
            pdf_url: 'assets/docs/diploma_marie_ngo.pdf',
            notes: [
                { matiere: 'Architecture des Logiciels', note: 16.5, semestre: 'Semestre 1', credits: 6 },
                { matiere: 'Sécurité des Systèmes', note: 14.0, semestre: 'Semestre 1', credits: 4 },
                { matiere: 'Algorithmique Avancée', note: 17.5, semestre: 'Semestre 1', credits: 6 },
                { matiere: 'Bases de Données Réparties', note: 11.0, semestre: 'Semestre 2', credits: 4 },
                { matiere: 'Gestion de Projet IT', note: 15.0, semestre: 'Semestre 2', credits: 4 }
            ]
        },
        {
          id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
          course_title: 'Certification Expert Python',
          university_name: 'CertiUni Academy',
          final_grade: '94% de réussite',
          issue_date: '2026-08-01',
          certificat_hash: '8f485f4728514589a1846b9a32c2563e41b2569c4f1589da41c25893e41c4589',
          payment_state: 'PENDING',
          pdf_url: null
        }
      ]
    },
    {
      id: 'stud-modo-12',
      email: 'jean.modo@univ-yaounde1.cm',
      first_name: 'Jean',
      last_name: 'Modo',
      certificates: [
        {
          id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          course_title: 'Licence en Sciences Economiques',
          university_name: 'Université de Yaoundé I',
          final_grade: '12.0/20 (Mention Passable)',
          issue_date: '2026-07-20',
          certificat_hash: 'ca7f70c565bd256cb76e2ef3c8d1d86d654158cfc258df361c4581f216259d33',
          payment_state: 'EXEMPTED',
          pdf_url: 'assets/docs/diploma_jean_modo.pdf'
        }
      ]
    }
  ];

  private bulkCandidates: BulkCandidate[] = [
    { 
      uuid: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6', 
      name: 'Marie Ngo', 
      diploma: 'Master Génie Logiciel', 
      status: 'VALID' 
    },
    { 
      uuid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 
      name: 'Jean Modo', 
      diploma: 'Licence Sc. Économiques', 
      status: 'VALID' 
    },
    { 
      uuid: 'f0000000-0000-0000-0000-000000000000', 
      name: 'Alain Tchakounté', 
      diploma: 'Faux Diplôme Détecté', 
      status: 'REVOKED' 
    },
    { 
      uuid: 'e4444444-4444-4444-4444-444444444444', 
      name: 'Inconnu', 
      diploma: 'Code Inexistant', 
      status: 'NOT_FOUND' 
    }
  ];

  private logs: VerificationLog[] = [
    { 
      time: '15:14:22', 
      diploma: 'Master Génie Logiciel', 
      student: 'Marie Ngo', 
      status: 'VALID', 
      location: 'Cameroun (Douala)' 
    },
    { 
      time: '14:30:05', 
      diploma: 'Licence Sc. Économiques', 
      student: 'Jean Modo', 
      status: 'VALID', 
      location: 'France (Paris)' 
    },
    { 
      time: '11:15:40', 
      diploma: 'ID: f0000000...', 
      student: 'Inconnu', 
      status: 'NOT_FOUND', 
      location: 'Canada (Montréal)' 
    }
  ];

  // ============ MÉTHODES DE RÉCUPÉRATION ============

  getStudents(): Student[] {
    return this.students;
  }

  getStudentById(id: string): Student | null {
    return this.students.find(s => s.id === id) || null;
  }

  getCertificateById(id: string): Certificate | null {
    for (const student of this.students) {
      const cert = student.certificates.find(c => c.id === id);
      if (cert) return cert;
    }
    return null;
  }

  getCertificateWithStudent(id: string): { student: Student; certificate: Certificate } | null {
    for (const student of this.students) {
      const cert = student.certificates.find(c => c.id === id);
      if (cert) {
        return { student, certificate: cert };
      }
    }
    return null;
  }

  getBulkCandidates(): BulkCandidate[] {
    return this.bulkCandidates;
  }

  getVerificationLogs(): VerificationLog[] {
    return this.logs;
  }

  // ============ MÉTHODES DE SIMULATION ============

  /**
   * Vérifie un certificat par son UUID
   * @param uuid - L'identifiant unique du certificat
   * @returns Observable avec le résultat de la vérification
   */
  verifyCertificate(uuid: string): Observable<VerificationResult> {
    // Cas REVOKED - Utiliser des guillemets doubles pour les valeurs de status
    if (uuid === 'f0000000-0000-0000-0000-000000000000') {
    return of({
        status: "REVOKED" as const,
        studentName: "Alain Tchakounté", // ← ajoute cette ligne
        message: "Ce diplôme a été officiellement révoqué par l'université."
    }).pipe(delay(500));
    }
    // Cas NOT_FOUND
    if (uuid === 'e4444444-4444-4444-4444-444444444444') {
      return of({
        status: "NOT_FOUND" as const,  // ✅ Utiliser "NOT_FOUND" avec guillemets doubles
        message: "Aucun diplôme trouvé avec cet identifiant."
      }).pipe(delay(500));
    }

    // Recherche normale
    const result = this.getCertificateWithStudent(uuid);
    if (result) {
      return of({
        status: "VALID" as const,  // ✅ Utiliser "VALID" avec guillemets doubles
        data: result
      }).pipe(delay(500));
    }

    return of({
      status: "NOT_FOUND" as const,  // ✅ Utiliser "NOT_FOUND" avec guillemets doubles
      message: "Aucun diplôme trouvé avec cet identifiant."
    }).pipe(delay(500));
  }

  /**
   * Simule le traitement d'un fichier bulk
   */
  processBulkFile(file: File): Observable<{ 
    success: boolean; 
    candidates: BulkCandidate[];
    errors: string[];
  }> {
    const errors: string[] = [];
    
    // Simuler des erreurs aléatoires
    if (Math.random() < 0.2) {
      errors.push('Ligne 3: Format de date invalide');
    }
    if (Math.random() < 0.15) {
      errors.push('Ligne 7: Note hors plage (22/20)');
    }

    return of({
      success: errors.length === 0,
      candidates: this.bulkCandidates,
      errors: errors
    }).pipe(delay(2000));
  }

  /**
   * Simule la détection OCR d'un document
   */
  simulateOCR(imageFile: File): Observable<{ uuid: string; confidence: number }> {
    const mockUuid = 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6';
    const confidence = 0.85 + Math.random() * 0.14;
    
    return of({
      uuid: mockUuid,
      confidence: confidence
    }).pipe(delay(1500));
  }
  /**
 * Simule une demande de vérification manuelle via Mobile Money
 */
    processMobileMoneyPayment(phone: string, amount: number): Observable<{
    success: boolean;
    reference: string;
    message: string;
    }> {
    return of({
        success: true,
        reference: 'MOMO-' + Date.now(),
        message: 'Demande enregistrée avec succès'
    }).pipe(delay(2000));
    }
}