import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MomoCheckout } from './momo-checkout';

describe('MomoCheckout', () => {
  let component: MomoCheckout;
  let fixture: ComponentFixture<MomoCheckout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MomoCheckout],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MomoCheckout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
