import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camera-scan',
  standalone: true,
  imports: [],
  templateUrl: './camera-scan.html',
  styleUrl: './camera-scan.css'
})
export class CameraScan implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;

  private stream: MediaStream | null = null;
  cameraAvailable = signal(true);
  isCapturing = signal(false);

  constructor(private router: Router) {}

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
    } catch (err) {
      // Pas de caméra dispo (PC sans webcam, permission refusée...) → mode simulation
      this.cameraAvailable.set(false);
    }
  }

  private stopCamera() {
    this.stream?.getTracks().forEach(track => track.stop());
  }

  onCapture() {
    if (this.isCapturing()) return;
    this.isCapturing.set(true);

    // Simule le temps de lecture du QR code (comme prévu au cahier des charges)
    setTimeout(() => {
      this.stopCamera();
      // UUID de démo (Marie Ngo) — en conditions réelles ce serait décodé du QR
      this.router.navigate(['/public/verify', 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6']);
    }, 3000);
  }

  onClose() {
    this.stopCamera();
    this.router.navigate(['/public/accueil']);
  }

  onRotateCamera() {
    // Pour une vraie implémentation multi-caméra, basculer front/back ici
    console.log('Rotation caméra (non implémentée en mode démo)');
  }
}