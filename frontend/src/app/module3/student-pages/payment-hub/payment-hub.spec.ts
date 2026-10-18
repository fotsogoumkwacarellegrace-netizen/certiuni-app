import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PaymentHub } from './payment-hub';

describe('PaymentHub', () => {
  let component: PaymentHub;
  let fixture: ComponentFixture<PaymentHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentHub],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: MatBottomSheetRef, useValue: { dismiss: () => {} } },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: { certificate: {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
