import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ValidationEmission } from './validation-emission';

describe('ValidationEmission', () => {
  let component: ValidationEmission;
  let fixture: ComponentFixture<ValidationEmission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationEmission],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationEmission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
