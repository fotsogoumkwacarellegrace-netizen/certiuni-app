import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CameraScan } from './camera-scan';

describe('CameraScan', () => {
  let component: CameraScan;
  let fixture: ComponentFixture<CameraScan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraScan],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraScan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
