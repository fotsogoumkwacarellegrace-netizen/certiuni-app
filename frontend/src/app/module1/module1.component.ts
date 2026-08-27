// frontend/src/app/module1-public/module1.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-module1',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #F9FAFB;
    }
  `]
})
export class Module1Component {}