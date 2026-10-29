<<<<<<< HEAD
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeDirective } from './directives/dark-mode.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DarkModeDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'CertiUni';
=======
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('certiuni-frontend');
>>>>>>> b1a23a150e9e3d129fa272d2dcf4436f4cfbca60
}
