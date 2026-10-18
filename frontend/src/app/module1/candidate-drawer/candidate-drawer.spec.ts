import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CandidateDrawer } from './candidate-drawer';

describe('CandidateDrawer', () => {
  let component: CandidateDrawer;
  let fixture: ComponentFixture<CandidateDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateDrawer],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateDrawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
