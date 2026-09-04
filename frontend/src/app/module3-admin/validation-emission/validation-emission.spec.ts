import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationEmission } from './validation-emission';

describe('ValidationEmission', () => {
  let component: ValidationEmission;
  let fixture: ComponentFixture<ValidationEmission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationEmission],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationEmission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
