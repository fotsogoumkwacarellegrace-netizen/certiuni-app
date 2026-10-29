import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BackButton } from '../../../shared/ui/back-button';

@Component({
  standalone: true,
  selector: 'app-student-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule, BackButton],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class StudentRegister {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  readonly submitting = signal(false);
  readonly message = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    matricule: ['', Validators.required],
    universite: ['', Validators.required],
    motDePasse: ['', [Validators.required, this.strongPassword]],
    confirmation: ['', Validators.required]
  }, { validators: this.passwordsMatch });

  field(name: keyof typeof this.form.controls) { return this.form.controls[name]; }
  isInvalid(name: keyof typeof this.form.controls) { const c = this.field(name); return c.invalid && (c.touched || c.dirty); }

  private strongPassword(control: AbstractControl): ValidationErrors | null {
    const v = control.value as string;
    return v && v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v) ? null : { strongPassword: true };
  }

  private passwordsMatch(group: AbstractControl): ValidationErrors | null {
    return group.get('motDePasse')?.value === group.get('confirmation')?.value ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.getRawValue();
    const users = this.readUsers();
    const email = raw.email.trim().toLowerCase();
    if (users.some((u: any) => u.email === email || u.matricule === raw.matricule.trim())) {
      this.message.set('Un compte existe déjà avec cet email ou matricule.'); return;
    }
    this.submitting.set(true);
    users.push({ ...raw, email, motDePasse: btoa(raw.motDePasse), createdAt: new Date().toISOString() });
    localStorage.setItem('certiuni_students', JSON.stringify(users));
    setTimeout(() => { this.submitting.set(false); this.router.navigate(['/student/login']); }, 500);
  }
  private readUsers(): any[] { try { return JSON.parse(localStorage.getItem('certiuni_students') ?? '[]'); } catch { return []; } }
}
