import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EspacesInscription } from './espaces-inscription';

describe('EspacesInscription', () => {
  let component: EspacesInscription;
  let fixture: ComponentFixture<EspacesInscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspacesInscription],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EspacesInscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have roles defined', () => {
    expect(component.roles.length).toBe(3);
    expect(component.roles.map(r => r.key)).toContain('etudiant');
    expect(component.roles.map(r => r.key)).toContain('institution');
    expect(component.roles.map(r => r.key)).toContain('recruteur');
  });
});