import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Audit } from './audit';

describe('Audit', () => {
  let component: Audit;
  let fixture: ComponentFixture<Audit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Audit],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Audit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
