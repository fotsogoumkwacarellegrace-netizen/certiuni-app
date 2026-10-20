import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { BackButton } from '../../shared/ui/back-button';
@Component({
  selector: 'app-verdict-unknown',
  standalone: true,
  imports: [CommonModule, BackButton],
  templateUrl: './verdict-unknown.html',
  styleUrl: './verdict-unknown.css'
})
export class VerdictUnknown implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly i18n = inject(I18nService);
  searchedCode = signal('');
  lang = signal<'FR' | 'EN'>('FR');
  isCopied = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.searchedCode.set(id);
  }

  onBack() {
    this.router.navigate(['/public/accueil']);
  }

  setLang(l: 'FR' | 'EN') {
    this.lang.set(l);
  }

  onManualVerification() {
    const currentUrl = this.router.url;
    localStorage.setItem('returnUrl', currentUrl);
    this.router.navigate(['/public/momo-checkout']);
  }

  copyCode() {
    const code = this.searchedCode();
    if (!code) return;
    navigator.clipboard?.writeText(code).then(() => {
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 1800);
    });
  }
}