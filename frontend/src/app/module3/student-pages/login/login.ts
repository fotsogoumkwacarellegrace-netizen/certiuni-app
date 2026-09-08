import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { StudentService } from '../../student-service/student.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule , MatIconModule],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private studentService = inject(StudentService);
  private router = inject(Router);

  email = signal('');
  errorMessage = signal('');
  emailSent = signal(false);

  countdown = signal(59);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.studentService.loadData().subscribe();
  }

  onSubmit() {
    this.errorMessage.set('');

    if (!this.email().trim()) {
      this.errorMessage.set('Veuillez saisir votre adresse e-mail.');
      return;
    }

    console.log('Lien magique simulé envoyé à :', this.email());
    this.emailSent.set(true);
    this.startCountdown();
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