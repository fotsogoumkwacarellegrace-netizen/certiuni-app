import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verdict-unknown',
  standalone: true,
  imports: [],
  templateUrl: './verdict-unknown.html',
  styleUrl: './verdict-unknown.css'
})
export class VerdictUnknown implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchedCode = signal('');
  lang = signal<'FR' | 'EN'>('FR');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.searchedCode.set(id);
  }

  onBack() {
    this.router.navigate(['/public/accueil']);
  }

  onClose() {
    this.router.navigate(['/public/accueil']);
  }

  setLang(l: 'FR' | 'EN') {
    this.lang.set(l);
  }

  onManualVerification() {
    this.router.navigate(['/public/momo-checkout']);
  }
}