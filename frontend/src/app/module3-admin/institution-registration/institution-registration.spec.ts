import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { InstitutionRegistration } from './institution-registration';

describe('InstitutionRegistration', () => {
  let component: InstitutionRegistration;
  let fixture: ComponentFixture<InstitutionRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionRegistration],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionRegistration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
