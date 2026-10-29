import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { StudentRegister } from './register';

describe('StudentRegister', () => {
  let component: StudentRegister;
  let fixture: ComponentFixture<StudentRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentRegister],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentRegister);
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
    expect(component.form.controls['matricule']).toBeDefined();
    expect(component.form.controls['universite']).toBeDefined();
    expect(component.form.controls['motDePasse']).toBeDefined();
    expect(component.form.controls['confirmation']).toBeDefined();
  });

  it('should validate required fields', () => {
    expect(component.form.controls['nom'].invalid).toEqual(true);
    expect(component.form.controls['prenom'].invalid).toEqual(true);
    expect(component.form.controls['email'].invalid).toEqual(true);
    expect(component.form.controls['matricule'].invalid).toEqual(true);
    expect(component.form.controls['universite'].invalid).toEqual(true);
    expect(component.form.controls['motDePasse'].invalid).toEqual(true);
    expect(component.form.controls['confirmation'].invalid).toEqual(true);
  });
});