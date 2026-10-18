import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ImporterDiplomes } from './importer-diplomes';

describe('ImporterDiplomes', () => {
  let component: ImporterDiplomes;
  let fixture: ComponentFixture<ImporterDiplomes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImporterDiplomes],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ImporterDiplomes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
