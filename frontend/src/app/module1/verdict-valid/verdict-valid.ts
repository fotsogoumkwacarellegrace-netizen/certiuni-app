import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MockDataService, Student, Certificate } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-verdict-valid',
  standalone: true,
  imports: [RouterModule],
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

  ngOnInit() {
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
        // Sécurité : si jamais on arrive ici sans données valides
        this.router.navigate(['/public/accueil']);
      }
    });
  }

  get documentRef(): string {
    const cert = this.certificate();
    if (!cert) return '';
    return `CU-2026-${cert.id.slice(0, 8).toUpperCase()}`;
  }

  get verifiedDate(): string {
    return new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  onNewSearch() {
    this.router.navigate(['/public/accueil']);
  }

  onDownload() {
    const cert = this.certificate();
    if (cert?.pdf_url) {
      window.open(cert.pdf_url, '_blank');
    } else {
      alert('Copie non disponible en mode simulation');
    }
  }
}