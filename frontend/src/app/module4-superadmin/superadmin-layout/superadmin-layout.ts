import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeToggle } from '../../shared/ui/theme-toggle';
import { SuperadminState } from '../services/superadmin-state';
import { MOCK_SUPERADMIN } from '../../assets/data/mock-data-superadmin';


@Component({
  selector: 'app-superadmin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ThemeToggle],
  templateUrl: './superadmin-layout.html',
  styleUrl: './superadmin-layout.css'
})
export class SuperadminLayout {
  goBack(): void {
    window.history.length > 1 ? window.history.back() : this.router.navigate(['/public/landing']);
  }

  private readonly router = inject(Router);
  private readonly state = inject(SuperadminState);

  readonly superadmin = MOCK_SUPERADMIN;
  readonly showLogoutConfirm = this.state.showLogoutConfirm;

  demanderDeconnexion(): void {
    this.state.openLogoutConfirm();
  }

  annulerDeconnexion(): void {
    this.state.closeLogoutConfirm();
  }

  confirmerDeconnexion(): void {
    this.state.closeLogoutConfirm();
    // TODO: remplacer par l'appel réel de déconnexion (invalidation de session/token).
    this.router.navigate(['/superadmin/login']);
  }
}