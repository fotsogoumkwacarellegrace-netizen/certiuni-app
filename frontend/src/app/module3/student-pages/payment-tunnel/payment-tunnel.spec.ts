import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentTunnel } from './payment-tunnel';

describe('PaymentTunnel', () => {
  let component: PaymentTunnel;
  let fixture: ComponentFixture<PaymentTunnel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTunnel],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentTunnel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
