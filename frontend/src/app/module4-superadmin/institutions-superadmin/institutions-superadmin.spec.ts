import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { InstitutionsSuperadmin } from './institutions-superadmin';

describe('InstitutionsSuperadmin', () => {
  let component: InstitutionsSuperadmin;
  let fixture: ComponentFixture<InstitutionsSuperadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionsSuperadmin],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsSuperadmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
