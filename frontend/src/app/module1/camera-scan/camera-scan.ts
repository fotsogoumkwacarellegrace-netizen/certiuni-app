import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { VerificationGateService } from '../../services/verification-gate.service';
import { BackButton } from '../../shared/ui/back-button';

@Component({
  selector: 'app-camera-scan',
  standalone: true,
  imports: [BackButton],
  templateUrl: './camera-scan.html',
  styleUrl: './camera-scan.css'
})
export class CameraScan implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;

  private readonly router = inject(Router);
  private readonly gate = inject(VerificationGateService);

  private stream: MediaStream | null = null;
  cameraAvailable = signal(true);
  isCapturing = signal(false);

  async ngOnInit() {
    await this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  private async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
      this.cameraAvailable.set(true);
    } catch {
      // Pas de caméra (PC sans webcam, permission refusée…) → mode simulation
      this.cameraAvailable.set(false);
    }
  }

  private stopCamera() {
    this.stream?.getTracks().forEach(track => track.stop());
  }

  onCapture() {
    if (this.isCapturing()) return;

    // Plus de gratuit ni de crédit : on redirige avant même de scanner
    if (!this.gate.ensureAllowance(1)) {
      this.stopCamera();
      return;
    }

    this.isCapturing.set(true);

    // Simule la lecture du QR code
    setTimeout(async () => {
      this.stopCamera();
      // UUID de démo (Marie Ngo) — en conditions réelles : décodé du QR
      await this.gate.verifyAndRoute('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
    }, 3000);
  }

  onClose() {
    this.stopCamera();
    this.router.navigate(['/public/accueil']);
  }
}