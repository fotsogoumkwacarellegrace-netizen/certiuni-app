// src/app/services/dark-mode.ts
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  private isDarkSignal: WritableSignal<boolean> = signal(false);

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      this.isDarkSubject.next(isDark);
      this.isDarkSignal.set(isDark);
    } else {
      const prefersDark =
        typeof window.matchMedia === 'function'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
          : false;
      this.isDarkSubject.next(prefersDark);
      this.isDarkSignal.set(prefersDark);
    }
  }

  get isDarkMode$() {
    return this.isDarkSignal();
  }

  getDarkModeObservable(): Observable<boolean> {
    return this.isDarkSubject.asObservable();
  }

  toggleDarkMode() {
    const newValue = !this.isDarkSubject.value;
    this.isDarkSubject.next(newValue);
    this.isDarkSignal.set(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  }

  enableDarkMode() {
    this.isDarkSubject.next(true);
    this.isDarkSignal.set(true);
    localStorage.setItem('theme', 'dark');
  }

  enableLightMode() {
    this.isDarkSubject.next(false);
    this.isDarkSignal.set(false);
    localStorage.setItem('theme', 'light');
  }
}