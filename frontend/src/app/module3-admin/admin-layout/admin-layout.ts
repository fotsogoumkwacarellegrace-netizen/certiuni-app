import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeToggle } from '../../shared/ui/theme-toggle';
import { MOCK_INSTITUTION } from '../../assets/data/mock-data.admin';
import { AdminState } from '../services/admin-state';


@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ThemeToggle],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  goBack(): void {
    window.history.length > 1 ? window.history.back() : this.router.navigate(['/public/landing']);
  }

  private readonly router = inject(Router);
  private readonly state = inject(AdminState);

  readonly institution = MOCK_INSTITUTION;
  readonly showLogoutConfirm = this.state.showLogoutConfirm;

  /** Menu latéral mobile : ouvert/fermé (drawer). */
  readonly menuOpen = signal(false);

  basculerMenu(): void {
    this.menuOpen.update((ouvert) => !ouvert);
  }

  fermerMenu(): void {
    this.menuOpen.set(false);
  }

  demanderDeconnexion(): void {
    this.state.openLogoutConfirm();
  }

  annulerDeconnexion(): void {
    this.state.closeLogoutConfirm();
  }

  confirmerDeconnexion(): void {
    this.state.closeLogoutConfirm();
    // TODO: remplacer par l'appel réel de déconnexion (invalidation de session/token).
    this.router.navigate(['/admin/login']);
  }
}