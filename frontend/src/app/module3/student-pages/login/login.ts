import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BackButton } from '../../../shared/ui/back-button';
import { ThemeToggle } from '../../../shared/ui/theme-toggle';
import { MatIconModule } from '@angular/material/icon';
import { StudentService } from '../../student-service/student.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterLink, BackButton, ThemeToggle],
  styleUrl: './login.css', templateUrl: './login.html'
})
export class Login {
  private fb = inject(FormBuilder); private router=inject(Router); private studentService=inject(StudentService);
  readonly errorMessage=signal(''); readonly isDemoLoading=signal(false); readonly showPassword=signal(false);
  readonly form=this.fb.nonNullable.group({identifiant:['',[Validators.required]],motDePasse:['',[Validators.required]]});
  readonly demoEnabled=true;
  onSubmit(){ if(this.form.invalid){this.form.markAllAsTouched();return;} const v=this.form.getRawValue(); const id=v.identifiant.trim().toLowerCase(); let users:any[]=[]; try{users=JSON.parse(localStorage.getItem('certiuni_students')??'[]')}catch{} const found=users.find((u:any)=>u.email===id||u.matricule===v.identifiant.trim()); if(found && found.motDePasse===btoa(v.motDePasse)){sessionStorage.setItem('certiuni_student_session',JSON.stringify(found));this.router.navigate(['/student/dashboard']);return;} this.errorMessage.set('Email/matricule ou mot de passe incorrect.'); }
  loginWithDemo(){this.isDemoLoading.set(true);this.studentService.loginDemo().subscribe({next:ok=>{this.isDemoLoading.set(false);if(ok)this.router.navigate(['/student/dashboard']);else this.errorMessage.set('Démonstration indisponible.')},error:()=>{this.isDemoLoading.set(false);this.errorMessage.set('Démonstration indisponible.')}});}
}