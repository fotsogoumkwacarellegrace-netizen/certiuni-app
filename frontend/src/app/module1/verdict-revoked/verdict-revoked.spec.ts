import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerdictRevoked } from './verdict-revoked';

describe('VerdictRevoked', () => {
  let component: VerdictRevoked;
  let fixture: ComponentFixture<VerdictRevoked>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerdictRevoked],
    }).compileComponents();

    fixture = TestBed.createComponent(VerdictRevoked);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
