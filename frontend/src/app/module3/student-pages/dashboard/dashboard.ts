import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ThemeToggle } from '../../../shared/ui/theme-toggle';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { StudentService, Certificate } from '../../student-service/student.service';
import { PaymentHub, PaymentHubData, PaymentMethod } from '../payment-hub/payment-hub';
import { PaymentTunnel, PaymentTunnelData } from '../payment-tunnel/payment-tunnel';
import { LinkedinShare, LinkedinShareData } from '../linkedin-share/linkedin-share';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatIconModule, RouterLink, ThemeToggle],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  studentService = inject(StudentService);
  private router = inject(Router);
  private bottomSheet = inject(MatBottomSheet);
  private dialog = inject(MatDialog);

  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  ngOnInit() {
    if (!this.studentService.currentStudent()) {
      this.router.navigate(['/student/login']);
    }
  }

  logout() {
    this.studentService.logout();
    this.router.navigate(['/student/login']);
  }

  goToArchive() {
    this.router.navigate(['/student/archive']);
  }

  onSidebarLinkClick(section: string) {
    // « Besoin d'aide » ouvre la page d'aide plein ecran (sans sidebar/navbar)
    if (section === 'support') {
      this.router.navigate(['/student/help']);
      return;
    }
    this.router.navigate(['/student/bientot'], { queryParams: { page: section } });
  }

  onUnlockClick(certificate: Certificate) {
    const sheetRef = this.bottomSheet.open<PaymentHub, PaymentHubData, PaymentMethod>(
      PaymentHub,
      { data: { certificate }, panelClass: 'certiuni-bottom-sheet' }
    );

    sheetRef.afterDismissed().subscribe((method) => {
      if (!method) return;

      const dialogRef = this.dialog.open<PaymentTunnel, PaymentTunnelData, boolean>(
        PaymentTunnel,
        { data: { certificate, method }, panelClass: 'certiuni-dialog', maxWidth: '95vw' }
      );

      dialogRef.afterClosed().subscribe((success) => {
        if (success) {
          this.studentService.markCertificateAsPaid(certificate.id);
        }
      });
    });
  }

  onShareLinkedIn(certificate: Certificate) {
    const student = this.studentService.currentStudent();
    if (!student) return;

    this.dialog.open<LinkedinShare, LinkedinShareData>(LinkedinShare, {
      data: {
        certificate,
        studentFullName: `${student.first_name} ${student.last_name}`
      },
      panelClass: 'certiuni-dialog',
      maxWidth: '95vw'
    });
  }

  onDownloadClick(certificate: Certificate) {
    this.router.navigate(['/student/bientot'], { queryParams: { page: 'Export PDF' } });
  }
  onMessageClick(): void {
    this.router.navigate(['/student/bientot'], { queryParams: { page: 'Messagerie' } });
  }
}
