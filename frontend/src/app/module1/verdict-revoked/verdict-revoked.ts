import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { I18nService } from '../../services/i18n.service';
import { BackButton } from '../../shared/ui/back-button';
@Component({
  selector: 'app-verdict-revoked',
  standalone: true,
  imports: [BackButton],
  templateUrl: './verdict-revoked.html',
  styleUrl: './verdict-revoked.css'
})
export class VerdictRevoked implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mockService = inject(MockDataService);
  readonly i18n = inject(I18nService);
  studentName = signal('Étudiant Inconnu');
  diplomaLine = signal('Master en Cybersécurité et Réseaux');
  institutionName = signal('Université Virtuelle de Yaoundé');
  documentRef = signal('');
  revocationReason = signal(
    "Document révoqué par l'autorité académique pour motif d'erreur administrative, mise à jour de parcours ou sanction disciplinaire. Les données nominatives sont verrouillées."
  );
  isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.documentRef.set(`DOC-2026-${id.slice(0, 8).toUpperCase()}`);

    // Récupère les infos réelles (étudiant + certificat) si disponibles,
    // même si le certificat est marqué révoqué côté vérification.
    const full = this.mockService.getCertificateWithStudent(id);
    if (full) {
      this.diplomaLine.set(full.certificate.course_title);
      this.institutionName.set(full.certificate.university_name);
    }

    this.mockService.verifyCertificate(id).subscribe(result => {
      this.isLoading.set(false);
      if (result.studentName) {
        this.studentName.set(result.studentName);
      } else if (full) {
        this.studentName.set(`${full.student.first_name} ${full.student.last_name}`);
      }
    });
  }

  onBackToHome() {
    this.router.navigate(['/public/accueil']);
  }

  onContactSecretariat() {
    window.location.href = 'mailto:rectorat@univ-douala.cm';
  }
}