import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

/**
 * Page generique « fonctionnalite en preparation » — visuel CertiUni.
 * Utilisee par tous les liens/boutons sans page dediee.
 */
@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.css',
})
export class ComingSoon {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  get pageTitle(): string {
    return this.route.snapshot.queryParamMap.get('page') ?? 'Page en preparation';
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.goHome();
    }
  }

  goHome(): void {
    this.router.navigate(['/public/landing']);
  }
}
