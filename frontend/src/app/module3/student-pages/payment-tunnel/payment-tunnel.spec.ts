import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentTunnel } from './payment-tunnel';

describe('PaymentTunnel', () => {
  let component: PaymentTunnel;
  let fixture: ComponentFixture<PaymentTunnel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTunnel],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { certificate: {}, method: 'momo' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentTunnel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
