import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AdminLogin} from './module3-admin/admin-login/admin-login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('certiuni-frontend');
}
