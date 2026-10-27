import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LandingHeader } from '../../shared/ui/landing-header/landing-header';

interface StepDefinition {
  index: 1 | 2 | 3;
  label: string;
}

@Component({
  selector: 'app-institution-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LandingHeader],
  templateUrl: './institution-registration.html',
  styleUrl: './institution-registration.css'
})
export class InstitutionRegistration implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  // private readonly router = inject(Router);

  readonly signatureCanvas = viewChild<ElementRef<HTMLCanvasElement>>('signatureCanvas');

  readonly steps: StepDefinition[] = [
    { index: 1, label: 'Informations institutionnelles' },
    { index: 2, label: 'Documents officiels' },
    { index: 3, label: 'Représentant légal et signature' }
  ];

  readonly currentStep = signal<1 | 2 | 3>(1);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly decretFileName = signal<string | null>(null);
  readonly decretFileError = signal<string | null>(null);
  readonly signatureError = signal<string | null>(null);
  readonly hasSignature = signal(false);

  private decretFile: File | null = null;
  private isDrawing = false;
  private canvasContext: CanvasRenderingContext2D | null = null;

  readonly typesEtablissement = [
    "Université publique",
    "Université privée",
    'Institut supérieur',
    'École supérieure',
    'Grande école'
  ];

  readonly pays = ['Cameroun', 'Sénégal', 'Côte d\'Ivoire', 'Gabon', 'Tchad'];

  readonly institutionInfoForm = this.fb.nonNullable.group({
    nomOfficiel: ['', Validators.required],
    typeEtablissement: ['', Validators.required],
    domaineDns: ['', Validators.required],
    emailInstitutionnel: ['', [Validators.required, Validators.email]],
    telephoneInstitutionnel: ['', Validators.required],
    adresseComplete: ['', Validators.required],
    siteWeb: [''],
    ville: ['', Validators.required],
    pays: ['', Validators.required],
    region: ['', Validators.required]
  });

  readonly representantForm = this.fb.nonNullable.group({
    nomComplet: ['', Validators.required],
    fonction: ['', Validators.required],
    telephone: ['', Validators.required],
    emailProfessionnel: ['', [Validators.required, Validators.email]]
  });

  ngAfterViewInit(): void {
    this.setupCanvas();
  }

  goToStep(step: 1 | 2 | 3): void {
    if (step < this.currentStep()) {
      this.currentStep.set(step);
    }
  }

  nextStep(): void {
    if (this.currentStep() === 1) {
      if (this.institutionInfoForm.invalid) {
        this.institutionInfoForm.markAllAsTouched();
        return;
      }
      this.currentStep.set(2);
      return;
    }

    if (this.currentStep() === 2) {
      if (!this.decretFile) {
        this.decretFileError.set('Le décret ministériel est requis.');
        return;
      }
      this.currentStep.set(3);
      setTimeout(() => this.setupCanvas());
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set((this.currentStep() - 1) as 1 | 2);
    }
  }

 isInvalid(
  form: 'institutionInfo' | 'representant',
  name: string
): boolean {

  if (form === 'institutionInfo') {
    const control = this.institutionInfoForm.get(name);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  const control = this.representantForm.get(name);
  return !!control && control.invalid && (control.touched || control.dirty);
}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.applyFile(file);
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0] ?? null;
    this.applyFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  removeFile(): void {
    this.decretFile = null;
    this.decretFileName.set(null);
  }

  private applyFile(file: File | null): void {
    if (!file) {
      return;
    }
    if (file.type !== 'application/pdf') {
      this.decretFileError.set('Seuls les fichiers PDF sont acceptés.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.decretFileError.set('La taille du fichier ne doit pas dépasser 5 Mo.');
      return;
    }
    this.decretFile = file;
    this.decretFileName.set(file.name);
    this.decretFileError.set(null);
  }

  private setupCanvas(): void {
    const canvasRef = this.signatureCanvas();
    if (!canvasRef) {
      return;
    }
    const canvas = canvasRef.nativeElement;
    this.canvasContext = canvas.getContext('2d');
    if (this.canvasContext) {
      this.canvasContext.strokeStyle = '#17191a';
      this.canvasContext.lineWidth = 2;
      this.canvasContext.lineCap = 'round';
    }
  }

  startDrawing(event: PointerEvent): void {
    if (!this.canvasContext) {
      return;
    }
    this.isDrawing = true;
    const { x, y } = this.getCanvasPosition(event);
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(x, y);
  }

  draw(event: PointerEvent): void {
    if (!this.isDrawing || !this.canvasContext) {
      return;
    }
    const { x, y } = this.getCanvasPosition(event);
    this.canvasContext.lineTo(x, y);
    this.canvasContext.stroke();
    this.hasSignature.set(true);
    this.signatureError.set(null);
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  clearSignature(): void {
    const canvasRef = this.signatureCanvas();
    if (!canvasRef || !this.canvasContext) {
      return;
    }
    const canvas = canvasRef.nativeElement;
    this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    this.hasSignature.set(false);
  }

  private getCanvasPosition(event: PointerEvent): { x: number; y: number } {
    const canvas = this.signatureCanvas()!.nativeElement;
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  onSubmit(): void {
    if (this.representantForm.invalid) {
      this.representantForm.markAllAsTouched();
      return;
    }
    if (!this.hasSignature()) {
      this.signatureError.set('La signature numérique est requise.');
      return;
    }

    this.submitting.set(true);

    // TODO: remplacer par l'appel réel à l'API d'inscription (multipart/form-data).
    const payload = {
      ...this.institutionInfoForm.getRawValue(),
      decretFileName: this.decretFileName(),
      ...this.representantForm.getRawValue()
    };
    console.log('Demande d\'inscription soumise', payload);

    setTimeout(() => {
      this.submitting.set(false);
      this.submitted.set(true);
    }, 800);
  }

  private router = inject(Router);

  submitRegistration(): void {

    // Simulation de l'envoi de la demande

    this.router.navigate(['/admin-login']);
  }


}