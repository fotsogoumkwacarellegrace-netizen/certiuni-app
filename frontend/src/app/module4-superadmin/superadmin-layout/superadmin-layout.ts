import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SuperadminState } from '../services/superadmin-state';
import { MOCK_SUPERADMIN } from '../../assets/data/mock-data-superadmin';


@Component({
  selector: 'app-superadmin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './superadmin-layout.html',
  styleUrl: './superadmin-layout.css'
})
export class SuperadminLayout {
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
    this.router.navigate(['/superadmin-login']);
  }
}