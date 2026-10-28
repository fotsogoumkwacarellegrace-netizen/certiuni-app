import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MomoCheckout } from './momo-checkout';

describe('MomoCheckout', () => {
  let component: MomoCheckout;
  let fixture: ComponentFixture<MomoCheckout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MomoCheckout],
    }).compileComponents();

    fixture = TestBed.createComponent(MomoCheckout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
