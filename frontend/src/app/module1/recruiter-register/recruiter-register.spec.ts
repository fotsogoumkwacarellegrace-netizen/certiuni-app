import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RecruiterRegister } from './recruiter-register';

describe('RecruiterRegister', () => {
  let component: RecruiterRegister;
  let fixture: ComponentFixture<RecruiterRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiterRegister],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecruiterRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form controls', () => {
    expect(component.form.controls['nom']).toBeDefined();
    expect(component.form.controls['prenom']).toBeDefined();
    expect(component.form.controls['email']).toBeDefined();
    expect(component.form.controls['motDePasse']).toBeDefined();
    expect(component.form.controls['confirmation']).toBeDefined();
    // Enterprise is optional
    expect(component.form.controls['entreprise']).toBeDefined();
  });

  it('should validate required fields', () => {
    expect(component.form.controls['nom'].invalid).toBeTrue();
    expect(component.form.controls['prenom'].invalid).toBeTrue();
    expect(component.form.controls['email'].invalid).toEqual(true);
    expect(component.form.controls['motDePasse'].invalid).toEqual(true);
    expect(component.form.controls['confirmation'].invalid).toEqual(true);
  });
});