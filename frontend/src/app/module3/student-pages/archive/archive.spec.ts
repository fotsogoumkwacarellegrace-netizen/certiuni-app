import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Archive } from './archive';

describe('Archive', () => {
  let component: Archive;
  let fixture: ComponentFixture<Archive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Archive],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Archive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
