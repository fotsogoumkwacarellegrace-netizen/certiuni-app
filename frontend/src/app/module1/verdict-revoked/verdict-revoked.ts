import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-verdict-revoked',
  standalone: true,
  imports: [],
  templateUrl: './verdict-revoked.html',
  styleUrl: './verdict-revoked.css'
})
export class VerdictRevoked implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mockService = inject(MockDataService);

  studentName = signal('Étudiant Inconnu');
  documentRef = signal('');
  revocationReason = signal(
    "Document révoqué par l'autorité académique pour motif d'erreur administrative, mise à jour de parcours ou sanction disciplinaire. Les données nominatives sont verrouillées."
  );
  isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.documentRef.set(`DOC-2026-${id.slice(0, 8).toUpperCase()}`);

    this.mockService.verifyCertificate(id).subscribe(result => {
      this.isLoading.set(false);
      if (result.studentName) {
        this.studentName.set(result.studentName);
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