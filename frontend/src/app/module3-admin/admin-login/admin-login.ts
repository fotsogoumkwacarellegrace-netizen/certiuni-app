import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BackButton } from '../../shared/ui/back-button';
import { ThemeToggle } from '../../shared/ui/theme-toggle';
import { LandingHeader } from '../../shared/ui/landing-header/landing-header';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LandingHeader],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly showPassword = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    identifiant: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required]]
  });

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  field(name: 'identifiant' | 'email' | 'motDePasse') {
    return this.form.controls[name];
  }

  isInvalid(name: 'identifiant' | 'email' | 'motDePasse'): boolean {
    const control = this.field(name);
    return control.invalid && (control.touched || control.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    // TODO: remplacer par l'appel réel au service d'authentification MINESUP.
    setTimeout(() => {
      this.submitting.set(false);
      this.router.navigate(['/admin/dashboard']);
    }, 600);
  }
}