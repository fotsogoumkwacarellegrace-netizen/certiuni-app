import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OcrScan } from './ocr-scan';

describe('OcrScan', () => {
  let component: OcrScan;
  let fixture: ComponentFixture<OcrScan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcrScan],
    }).compileComponents();

    fixture = TestBed.createComponent(OcrScan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
