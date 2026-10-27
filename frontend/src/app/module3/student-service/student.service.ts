import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Certificate {
  id: string;
  course_title: string;
  university_name: string;
  final_grade: string;
  issue_date: string;
  certificat_hash: string;
  payment_state: 'PAID' | 'PENDING' | 'EXEMPTED' | 'IN_PROGRESS';
  pdf_url: string | null;
}

export interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  certificates: Certificate[];
}

export interface PaymentHistoryItem {
  id: string;
  certificate_title: string;
  amount: number;
  method: string;
  date: string;
  reference: string;
}

interface MockData {
  students: Student[];
  payment_history: PaymentHistoryItem[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);

  // Toutes les données brutes chargées depuis le JSON
  private mockData = signal<MockData | null>(null);

  // L'étudiant actuellement connecté (simulation)
  private currentStudentId = signal<string | null>(null);

  // Signal calculé : l'étudiant connecté avec ses infos complètes
  currentStudent = computed(() => {
    const data = this.mockData();
    const id = this.currentStudentId();
    if (!data || !id) return null;
    return data.students.find(s => s.id === id) ?? null;
  });

  // Signal calculé : historique des paiements
  paymentHistory = computed(() => this.mockData()?.payment_history ?? []);

  // Charge le fichier mock-data.json (appelé une seule fois au démarrage)
  loadData() {
    return this.http.get<MockData>('assets/data/mock-data.json').pipe(
      tap(data => this.mockData.set(data))
    );
  }

  // Simule la connexion par lien magique : on cherche l'étudiant par email
  loginByEmail(email: string): boolean {
    const data = this.mockData();
    const student = data?.students.find(s => s.email === email);
    if (student) {
      this.currentStudentId.set(student.id);
      return true;
    }
    return false;
  }

  /**
   * Connexion de DEMONSTRATION (dev uniquement) — compte etudiant fictif
   * controle, role « etudiant », sans mot de passe ni secret, aucun appel externe.
   * Bloquee en production via `environment.production`.
   */
  static readonly DEMO_EMAIL = 'marie.ngo@univ-douala.cm';
  static readonly DEMO_ROLE = 'etudiant';

  isDemoEnabled(): boolean {
    return !environment.production;
  }

  /** Connecte le compte de demonstration (charge le mock si besoin). */
  loginDemo(): Observable<boolean> {
    if (environment.production) return of(false);
    if (this.mockData()) return of(this.loginByEmail(StudentService.DEMO_EMAIL));
    return this.loadData().pipe(map(() => this.loginByEmail(StudentService.DEMO_EMAIL)));
  }

  // Simule le déblocage d'un diplôme après paiement (PENDING -> PAID)
  markCertificateAsPaid(certificateId: string) {
    const data = this.mockData();
    if (!data) return;

    const updated: MockData = {
      ...data,
      students: data.students.map(s => ({
        ...s,
        certificates: s.certificates.map(c =>
          c.id === certificateId ? { ...c, payment_state: 'PAID' as const } : c
        )
      }))
    };
    this.mockData.set(updated);
  }

  logout() {
    this.currentStudentId.set(null);
  }
}