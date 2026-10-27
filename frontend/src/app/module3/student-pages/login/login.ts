import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BackButton } from '../../../shared/ui/back-button';
import { ThemeToggle } from '../../../shared/ui/theme-toggle';
import { MatIconModule } from '@angular/material/icon';
import { StudentService } from '../../student-service/student.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatIconModule, RouterLink, BackButton, ThemeToggle],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private studentService = inject(StudentService);
  private router = inject(Router);

  email = signal('');
  errorMessage = signal('');
  emailSent = signal(false);
  infoMessage = signal('');
  isDemoLoading = signal(false);

  /** Demo desactivee en production (securite : aucune simulation en prod). */
  get demoEnabled(): boolean {
    return !environment.production;
  }

  countdown = signal(59);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.studentService.loadData().subscribe();
  }

  onSubmit() {
    this.errorMessage.set('');
    this.infoMessage.set('');

    if (!this.email().trim()) {
      this.errorMessage.set('Veuillez saisir votre adresse e-mail.');
      return;
    }

    // Pas de backend : aucun email n'est reellement envoye (message honnete).
    this.infoMessage.set(
      "L'envoi du lien magique sera disponible apres la connexion du service d'authentification. Pour tester le module, utilisez le compte de demonstration ci-dessous."
    );
  }

  /** Connexion simulee DEV uniquement : compte etudiant fictif -> vrai dashboard. */
  loginWithDemo() {
    if (!this.demoEnabled) return;
    this.errorMessage.set('');
    this.infoMessage.set('');
    this.isDemoLoading.set(true);
    this.studentService.loginDemo().subscribe({
      next: (ok) => {
        this.isDemoLoading.set(false);
        if (ok) this.router.navigate(['/student/dashboard']);
        else this.errorMessage.set("La demonstration est indisponible pour le moment.");
      },
      error: () => {
        this.isDemoLoading.set(false);
        this.errorMessage.set("La demonstration est indisponible pour le moment.");
      },
    });
  }

  private startCountdown() {
    this.countdown.set(59);
    this.countdownInterval = setInterval(() => {
      const current = this.countdown();
      if (current <= 0) {
        clearInterval(this.countdownInterval!);
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);
  }

  resendEmail() {
    if (this.countdown() > 0) return;
    console.log('Lien magique renvoyé à :', this.email());
    this.startCountdown();
  }

  simulateClickOnEnvelope() {
    const success = this.studentService.loginByEmail(this.email());
    if (success) {
      this.router.navigate(['/student/dashboard']);
    } else {
      this.errorMessage.set("Aucun compte trouvé pour cet e-mail. Essayez : marie.ngo@univ-douala.cm");
      this.emailSent.set(false);
    }
  }
}