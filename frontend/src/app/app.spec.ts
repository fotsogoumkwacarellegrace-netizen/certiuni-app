<<<<<<< HEAD
﻿import { TestBed } from '@angular/core/testing';
=======
import { TestBed } from '@angular/core/testing';
>>>>>>> b1a23a150e9e3d129fa272d2dcf4436f4cfbca60
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

<<<<<<< HEAD
  it('should render the router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
=======
  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, certiuni-frontend');
>>>>>>> b1a23a150e9e3d129fa272d2dcf4436f4cfbca60
  });
});
