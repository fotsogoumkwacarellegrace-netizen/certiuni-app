import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LinkedinShare } from './linkedin-share';

describe('LinkedinShare', () => {
  let component: LinkedinShare;
  let fixture: ComponentFixture<LinkedinShare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedinShare],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { certificate: {}, studentFullName: 'Test Etudiant' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedinShare);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
