import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService } from '../../student-service/student.service';

@Component({
  selector: 'app-archive',
  imports: [CommonModule, MatIconModule],
  styleUrl: './archive.css',
  templateUrl: './archive.html',
})
export class Archive {
  studentService = inject(StudentService);
  private router = inject(Router);

  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  goBack() {
    this.router.navigate(['/student/dashboard']);
  }

  goToDashboard() {
    this.router.navigate(['/student/dashboard']);
  }

  onSidebarLinkClick(section: string) {
    console.log('Navigation sidebar vers :', section);
  }

  downloadReceipt(reference: string) {
    console.log('Téléchargement du reçu :', reference);
  }

  onViewDetails(paymentId: string) {
    console.log('Voir détail transaction :', paymentId);
  }
}