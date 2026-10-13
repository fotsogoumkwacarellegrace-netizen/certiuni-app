import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminState {
  readonly showLogoutConfirm = signal(false);

  openLogoutConfirm(): void {
    this.showLogoutConfirm.set(true);
  }

  closeLogoutConfirm(): void {
    this.showLogoutConfirm.set(false);
  }
}
