import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeToggle } from '../../../shared/ui/theme-toggle';
import { StudentService } from '../../student-service/student.service';

@Component({
  selector: 'app-archive',
  imports: [CommonModule, MatIconModule, RouterLink, ThemeToggle],
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
    // « Besoin d'aide » ouvre la page d'aide plein ecran (sans sidebar/navbar)
    if (section === 'support') {
      this.router.navigate(['/student/help']);
      return;
    }
    const labels: Record<string, string> = {
      'identity': 'Verification identite',
      'support': 'Aide et support etudiant',
      'add-credential': 'Ajouter un certificat',
      'user-menu': 'Menu utilisateur',
    };
    this.router.navigate(['/student/bientot'], { queryParams: { page: labels[section] ?? section } });
  }

  downloadReceipt(reference: string) {
    this.router.navigate(['/student/bientot'], { queryParams: { page: 'Recu ' + reference } });
  }

  onViewDetails(paymentId: string) {
    this.router.navigate(['/student/bientot'], { queryParams: { page: 'Detail transaction ' + paymentId } });
  }
}