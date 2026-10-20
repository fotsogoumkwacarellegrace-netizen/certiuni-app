// src/app/shared/flag-icon/flag-icon.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type FlagCode = 'FR' | 'EN';

@Component({
  selector: 'app-flag-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    '[attr.aria-label]': 'code() === "FR" ? "Drapeau de la France" : "United Kingdom flag"'
  },
  template: `
    @if (code() === 'FR') {
      <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="1" height="2" x="0" fill="#0055a4" />
        <rect width="1" height="2" x="1" fill="#ffffff" />
        <rect width="1" height="2" x="2" fill="#ef4135" />
      </svg>
    } @else {
      <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <clipPath id="uk-clip">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" stroke-width="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#uk-clip)" stroke="#c8102e" stroke-width="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" stroke-width="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6" />
      </svg>
    }
  `,
  styles: [`
    :host {
      display: inline-block;
      width: 24px;
      height: 16px;
      flex-shrink: 0;
      border-radius: 3px;
      overflow: hidden;
      line-height: 0;
      box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.14), 0 1px 3px rgba(15, 23, 42, 0.12);
    }
    svg { width: 100%; height: 100%; display: block; }
  `]
})
export class FlagIcon {
  readonly code = input.required<FlagCode>();
}