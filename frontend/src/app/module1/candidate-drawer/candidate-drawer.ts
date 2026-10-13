import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService, Student, Certificate } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-candidate-drawer',
  standalone: true,
  imports: [],
  templateUrl: './candidate-drawer.html',
  styleUrl: './candidate-drawer.css'
})
export class CandidateDrawer implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mockService = inject(MockDataService);

  student = signal<Student | null>(null);
  certificate = signal<Certificate | null>(null);

  moyenneGenerale = computed(() => {
    const notes = this.certificate()?.notes;
    if (!notes || notes.length === 0) return '—';
    const total = notes.reduce((sum, n) => sum + n.note, 0);
    return (total / notes.length).toFixed(1);
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const result = this.mockService.getCertificateWithStudent(id);
    if (result) {
      this.student.set(result.student);
      this.certificate.set(result.certificate);
    }
  }

  onClose() {
    this.router.navigate(['/public/bulk-table']);
  }

  onExport() {
    alert('Export du relevé PDF — fonctionnalité simulée');
  }
}