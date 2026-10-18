import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { PdfViewer } from './pdf-viewer';

describe('PdfViewer', () => {
  let component: PdfViewer;
  let fixture: ComponentFixture<PdfViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfViewer],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
