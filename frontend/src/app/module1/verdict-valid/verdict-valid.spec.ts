import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { VerdictValid } from './verdict-valid';

describe('VerdictValid', () => {
  let component: VerdictValid;
  let fixture: ComponentFixture<VerdictValid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerdictValid],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(VerdictValid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
