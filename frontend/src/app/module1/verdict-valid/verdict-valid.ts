import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MockDataService, Student, Certificate } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-verdict-valid',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './verdict-valid.html',
  styleUrl: './verdict-valid.css'
})
export class VerdictValid implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mockService = inject(MockDataService);

  student = signal<Student | null>(null);
  certificate = signal<Certificate | null>(null);
  isLoading = signal(true);

  // Nom complet du candidat
  fullName = computed(() => {
    const s = this.student();
    return s ? `${s.first_name} ${s.last_name}` : '';
  });

  // "Diplôme Universitaire De Technologie (DUT)"
  diplomaLine = computed(() => {
    const cert = this.certificate();
    return cert ? cert.course_title : '';
  });

  // "2026 / 2027"
  academicYear = computed(() => {
    const cert = this.certificate();
    if (!cert) return '';
    const startYear = new Date(cert.issue_date).getFullYear();
    return `${startYear} / ${startYear + 1}`;
  });

  // "IUT — Université Centrale"
  accreditedInstitution = computed(() => {
    const cert = this.certificate();
    return cert ? cert.university_name : '';
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/public/accueil']);
      return;
    }

    this.mockService.verifyCertificate(id).subscribe(result => {
      this.isLoading.set(false);
      if (result.status === 'VALID' && result.data) {
        this.student.set(result.data.student);
        this.certificate.set(result.data.certificate);
      } else {
        this.router.navigate(['/public/accueil']);
      }
    });
  }

  onClose(): void {
    this.router.navigate(['/public/accueil']);
  }

  onDownload(): void {
    const cert = this.certificate();
    if (cert?.pdf_url) {
      window.open(cert.pdf_url, '_blank');
    } else {
      alert('Copie du diplôme non disponible en mode simulation.');
    }
  }

  onNewVerification(): void {
    this.router.navigate(['/public/accueil']);
  }

  onViewHistory(): void {
    alert('Historique — fonctionnalité bientôt disponible.');
  }
}