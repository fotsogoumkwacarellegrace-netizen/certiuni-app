import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { BackButton } from '../../shared/ui/back-button';
import { ThemeToggle } from '../../shared/ui/theme-toggle';

@Component({
  selector: 'app-superadmin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './superadmin-login.html',
  styleUrl: './superadmin-login.css'
})
export class SuperadminLogin {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly showPassword = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    identifiant: ['', Validators.required],
    motDePasse: ['', Validators.required]
  });

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  isInvalid(name: 'identifiant' | 'motDePasse'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    // TODO: remplacer par l'appel réel au service d'authentification Super Admin.
    setTimeout(() => {
      this.submitting.set(false);
      this.router.navigate(['/superadmin/dashboard']);
    }, 600);
  }
}