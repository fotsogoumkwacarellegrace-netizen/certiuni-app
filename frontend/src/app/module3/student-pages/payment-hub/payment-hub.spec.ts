import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentHub } from './payment-hub';

describe('PaymentHub', () => {
  let component: PaymentHub;
  let fixture: ComponentFixture<PaymentHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentHub],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
