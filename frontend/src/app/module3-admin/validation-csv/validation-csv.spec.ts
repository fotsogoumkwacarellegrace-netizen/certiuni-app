import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ValidationCsv } from './validation-csv';

describe('ValidationCsv', () => {
  let component: ValidationCsv;
  let fixture: ComponentFixture<ValidationCsv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationCsv],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationCsv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
