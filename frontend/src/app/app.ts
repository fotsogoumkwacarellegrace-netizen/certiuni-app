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
}
