import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { VerdictUnknown } from './verdict-unknown';

describe('VerdictUnknown', () => {
  let component: VerdictUnknown;
  let fixture: ComponentFixture<VerdictUnknown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerdictUnknown],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(VerdictUnknown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
