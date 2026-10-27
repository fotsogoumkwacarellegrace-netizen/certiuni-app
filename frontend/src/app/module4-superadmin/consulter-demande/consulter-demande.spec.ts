import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ConsulterDemande } from './consulter-demande';

describe('ConsulterDemande', () => {
  let component: ConsulterDemande;
  let fixture: ComponentFixture<ConsulterDemande>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsulterDemande],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsulterDemande);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
