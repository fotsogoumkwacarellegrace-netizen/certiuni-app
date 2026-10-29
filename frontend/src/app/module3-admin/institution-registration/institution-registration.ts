import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LandingHeader } from '../../shared/ui/landing-header/landing-header';

@Component({
  selector: 'app-institution-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LandingHeader],
  templateUrl: './institution-registration.html',
  styleUrl: './institution-registration.css',
})
export class InstitutionRegistration {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly currentStep = signal(1);
  readonly steps = [
    { index: 1, label: 'Informations institutionnelles' },
    { index: 2, label: 'Représentant légal' },
  ];
  readonly typesEtablissement = ['Université', 'Grand établissement', 'École supérieure', 'Autre'];
  readonly pays = ['Cameroun', 'France', 'Belgique', 'Canada', 'Autre'];

  readonly institutionInfoForm = this.fb.nonNullable.group({
    nomOfficiel: ['', Validators.required],
    typeEtablissement: ['', Validators.required],
    domaineDns: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.cm$/)]],
    emailInstitutionnel: ['', [Validators.required, Validators.email]],
    telephoneInstitutionnel: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s]+$/)]],
    adresseComplete: ['', Validators.required],
    siteWeb: [''],
    ville: ['', Validators.required],
    pays: ['', Validators.required],
    region: ['', Validators.required],
  });

  readonly representantForm = this.fb.nonNullable.group({
    nomComplet: ['', Validators.required],
    fonction: ['', Validators.required],
    emailProfessionnel: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s]+$/)]],
  });

  private readonly _decretFileName = signal('');
  private readonly _decretFileError = signal<string | null>(null);
  private readonly _hasSignature = signal(false);
  private readonly _signatureError = signal<string | null>(null);
  private drawing = false;

  @ViewChild('signatureCanvas')
  signatureCanvas?: ElementRef<HTMLCanvasElement>;

  get decretFileName(): string {
    return this._decretFileName();
  }

  isInvalid(formName: 'institutionInfo' | 'representant', name: string): boolean {
    let control: AbstractControl | null;
    if (formName === 'institutionInfo') {
      control = this.institutionInfoForm.get(name as 'nomOfficiel' | 'typeEtablissement' | 'domaineDns' | 'emailInstitutionnel' | 'telephoneInstitutionnel' | 'adresseComplete' | 'siteWeb' | 'ville' | 'pays' | 'region');
    } else {
      control = this.representantForm.get(name as 'nomComplet' | 'fonction' | 'emailProfessionnel' | 'telephone');
    }
    if (!control) return false;
    return control.invalid && (control.touched || control.dirty);
  }

  previousStep(): void {
    if (this.currentStep() > 1) this.currentStep.update(step => step - 1);
  }

  nextStep(): void {
    if (this.currentStep() === 1) {
      if (this.institutionInfoForm.invalid) {
        this.institutionInfoForm.markAllAsTouched();
        return;
      }
      this.currentStep.set(2);
    }
  }

  goToStep(stepIndex: number): void {
    if (stepIndex === 1 || (stepIndex === 2 && !this.institutionInfoForm.invalid)) {
      this.currentStep.set(stepIndex);
    }
  }

  onSubmit(): void {
    if (this.institutionInfoForm.invalid || this.representantForm.invalid || !this._decretFileName()) {
      this.institutionInfoForm.markAllAsTouched();
      this.representantForm.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.errorMessage.set(null);
    setTimeout(() => {
      this.submitting.set(false);
      this.submitted.set(true);
    }, 800);
  }

  clearSignature(): void {
    const canvas = this.signatureCanvas?.nativeElement;
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    this._hasSignature.set(false);
    this._signatureError.set(null);
  }

  hasSignature(): boolean {
    return this._hasSignature();
  }

  signatureError(): string | null {
    return this._signatureError();
  }

  submitRegistration(): void {
    void this.router.navigate(['/admin/login']);
  }

  startDrawing(event: PointerEvent): void {
    const canvas = this.signatureCanvas?.nativeElement;
    if (!canvas) return;
    this.drawing = true;
    canvas.setPointerCapture(event.pointerId);
    const context = canvas.getContext('2d');
    if (context) {
      context.beginPath();
      context.moveTo(event.offsetX, event.offsetY);
    }
  }

  draw(event: PointerEvent): void {
    if (!this.drawing) return;
    const context = this.signatureCanvas?.nativeElement.getContext('2d');
    if (!context) return;
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#17191a';
    context.lineTo(event.offsetX, event.offsetY);
    context.stroke();
    this._hasSignature.set(true);
  }

  stopDrawing(): void {
    this.drawing = false;
  }

  decretFileError(): string | null {
    return this._decretFileError();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.setSelectedFile(file ?? null);
  }

  removeFile(): void {
    this._decretFileName.set('');
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.setSelectedFile(event.dataTransfer?.files.item(0) ?? null);
  }

  private setSelectedFile(file: File | null): void {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      this._decretFileError.set('Le décret doit être au format PDF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this._decretFileError.set('Le fichier ne doit pas dépasser 5 Mo.');
      return;
    }
    this._decretFileError.set(null);
    this._decretFileName.set(file.name);
  }
}
