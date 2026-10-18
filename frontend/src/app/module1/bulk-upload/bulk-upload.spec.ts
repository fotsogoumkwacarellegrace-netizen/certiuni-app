import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BulkUpload } from './bulk-upload';

describe('BulkUpload', () => {
  let component: BulkUpload;
  let fixture: ComponentFixture<BulkUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkUpload],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
