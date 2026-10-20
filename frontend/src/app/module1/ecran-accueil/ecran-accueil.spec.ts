import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { EcranAccueil } from './ecran-accueil';

describe('EcranAccueil', () => {
  let component: EcranAccueil;
  let fixture: ComponentFixture<EcranAccueil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcranAccueil],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcranAccueil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
