import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerdictUnknown } from './verdict-unknown';

describe('VerdictUnknown', () => {
  let component: VerdictUnknown;
  let fixture: ComponentFixture<VerdictUnknown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerdictUnknown],
    }).compileComponents();

    fixture = TestBed.createComponent(VerdictUnknown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
