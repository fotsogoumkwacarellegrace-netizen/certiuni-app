import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface User {
  name: string;
  nom: string;
  prenom: string;
  email: string;
  entreprise?: string;
  passwordHash: string;
}

@Component({
  standalone: true,
  selector: 'app-recruiter-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recruiter-register.html',
  styleUrl: './recruiter-register.css'
})
export class RecruiterRegister {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const motDePasse = control.get('motDePasse');
    const confirmation = control.get('confirmation');

    if (motDePasse && confirmation && motDePasse.value !== confirmation.value) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  readonly form = this.fb.nonNullable.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    entreprise: [''],
    motDePasse: ['', [Validators.required, Validators.pattern(this.strongPasswordRegex)]],
    confirmation: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();
    const email = formValues.email.trim().toLowerCase();
    const users = this.readUsers();

    if (users.some((user: User) => user.email === email)) {
      this.error.set('Un compte existe déjà avec cet email.');
      return;
    }

    this.submitting.set(true);

    try {
      const data = new TextEncoder().encode(`${email}:${formValues.motDePasse}`);
      const buf = await crypto.subtle.digest('SHA-256', data);
      const hash = Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      users.push({
        name: `${formValues.prenom} ${formValues.nom}`,
        nom: formValues.nom,
        prenom: formValues.prenom,
        email,
        entreprise: formValues.entreprise,
        passwordHash: hash
      });

      localStorage.setItem('certiuni_users', JSON.stringify(users));

      setTimeout(() => {
        this.router.navigate(['/public/login']);
      }, 500);
    } catch (err) {
      this.error.set("Une erreur est survenue lors de la création du compte.");
      this.submitting.set(false);
    }
  }

  private readUsers(): User[] {
    try {
      const stored = localStorage.getItem('certiuni_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
