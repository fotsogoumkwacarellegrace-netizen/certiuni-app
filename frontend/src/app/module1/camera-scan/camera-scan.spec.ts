import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CameraScan } from './camera-scan';

describe('CameraScan', () => {
  let component: CameraScan;
  let fixture: ComponentFixture<CameraScan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraScan],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraScan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
